import React from "react";
import { FaRegCalendar } from "react-icons/fa";

const CalendarLogo = ({ date }) => {
  const formattedDate = new Date(); // Asegúrate de que el formato de `date` sea compatible.
  const month = formattedDate.toLocaleString("default", { month: "short" }); // Ej: "Jan"
  const day = formattedDate.getDate(); // Ej: 25

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <FaRegCalendar size={70} color="#3b00c4" />
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          fontWeight: "bold",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        <div>{month}</div>
        <div style={{color:"black", fontSize:"26px"}}>{day}</div>
      </div>
    </div>
  );
};

export default CalendarLogo;