import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";

export const onTicketCreate = inngest.createFunction(
  {
    id: "on-ticket-create",
    retries: 2,
  },
  { event: "ticket/create" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      const ticket = await Ticket.findById({ ticketId });
      if (!ticket) {
        throw new NonRetriableError("Ticket not found");
      }
      return ticket;
    } catch (error) {}
  }
);
