import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav>
      <Link to="/" className={path === "/" ? "selected" : ""}>
        Meteostanice
      </Link>

      <Link to="/historie" className={path === "/historie" ? "selected" : ""}>
        Úplná data
      </Link>

      <Link to="/predpoved" className={path === "/predpoved" ? "selected" : ""}>
        Předpověď
      </Link>

      <Link to="/info" className={path === "/info" ? "selected" : ""}>
        O meteostanici
      </Link>
    </nav>
  );
}
