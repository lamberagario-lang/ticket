import React from "react";
import TicketForm from "./TicketForm";

export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: 30 }}>
        Эскалада, Totma, X-Caro | Ставрополь
      </h1>
      <p style={{ textAlign: "center" }}>Дата: 6 декабря 2025, Время: 19:00</p>
      <TicketForm />
    </div>
  );
}
