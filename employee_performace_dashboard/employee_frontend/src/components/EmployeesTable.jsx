import React, { useState, useEffect } from "react";
import { Table, Container, Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    designation: "",
    date_of_joining: "",
  });

  const token = localStorage.getItem("access");

  const authAxios = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    authAxios
      .get("employees/")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("API error:", err));
  };

  const handleShow = (employee = null) => {
    if (employee) setFormData(employee);
    else
      setFormData({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        designation: "",
        date_of_joining: "",
      });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (formData.id) {
      authAxios
        .put(`employees/${formData.id}/`, formData)
        .then(() => {
          fetchEmployees();
          handleClose();
        })
        .catch((err) => console.error("Update error:", err));
    } else {
      authAxios
        .post("employees/", formData)
        .then(() => {
          fetchEmployees();
          handleClose();
        })
        .catch((err) => console.error("Create error:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      authAxios
        .delete(`employees/${id}/`)
        .then(() => fetchEmployees())
        .catch((err) => console.error("Delete error:", err));
    }
  };

  return (
    <Container fluid className="flex-column justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={12}>
          <Card className="shadow w-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Employees</h4>
              <Button variant="primary" onClick={() => handleShow()}>
                + Add Employee
              </Button>
            </Card.Header>
            <Card.Body style={{ height: "350px", overflowY: "auto", padding: 0 }}>
              <Table striped bordered hover responsive className="mb-0 w-100">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Date of Joining</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.first_name}</td>
                      <td>{emp.last_name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.date_of_joining}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() => handleShow(emp)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                name="date_of_joining"
                value={formData.date_of_joining}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {formData.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EmployeesTable;
