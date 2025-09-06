import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Header({ onLogout }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "employee", "manager", or "admin"

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Employee Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {/* Only manager/admin can see Employees link */}
            {(role === "manager" || role === "admin") && (
              <Nav.Link as={Link} to="/employees">Employees</Nav.Link>
            )}

            {/* Only manager/admin can see Performance link */}
            {(role === "manager" || role === "admin") && (
              <Nav.Link as={Link} to="/reports">Performance</Nav.Link>
            )}

            {/* Employee can see Performance and My Details */}
            {role === "employee" && (
              <>
                <Nav.Link as={Link} to="/reports">My Performance</Nav.Link>
                <Nav.Link as={Link} to="/my-details">My Details</Nav.Link>
              </>
            )}

            <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
