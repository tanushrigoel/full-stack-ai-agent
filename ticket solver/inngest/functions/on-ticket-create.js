import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.js";
import { sendMail } from "../../utils/mailer.js";

export const onTicketCreate = inngest.createFunction(
  {
    id: "on-ticket-created",
    retries: 2,
  },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticket) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "To-Do" });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "In-progress",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elementMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const ticket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket assigned",
            `Hi, a ticket have been assigned to you ${ticketId}`
          );
        }
      });
    } catch (error) {
      return;
    }
  }
);
