import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      <Container>
        <p className="mb-0">
          © {new Date().getFullYear()} Employee Dashboard | All Rights Reserved
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
