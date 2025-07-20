import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CheckAuth from "./components/checkAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tickets from "./pages/Tickets";
import TicketDetailsPage from "./pages/Ticket";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Admin from "./pages/Admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protected={true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protected={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <CheckAuth protected={false}>
              <Signup />
            </CheckAuth>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <CheckAuth protected={true}>
              <Admin />
            </CheckAuth>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
