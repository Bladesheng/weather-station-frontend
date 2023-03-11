import React from "react";

export default function Navbar() {
  return (
    <nav>
      <button className="selected">Meteostanice</button>
      <button>Historie</button>
      <button>Předpověď</button>
      <button>O meteostanici</button>
    </nav>
  );
}
