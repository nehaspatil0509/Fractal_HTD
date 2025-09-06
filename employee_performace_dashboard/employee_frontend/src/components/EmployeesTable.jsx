import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import EmployeeForm from "./EmployeeForm";

function EmployeesTable({ role }) {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const currentUserId = localStorage.getItem("user_id"); // assuming backend sends user id after login

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openEditModal = (emp) => {
    setEditingData(emp);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingData(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const token = localStorage.getItem("access");
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    }
  };

  return (
    <div>
      {role !== "employee" && (
        <div className="mb-3 d-flex gap-2">
          <Button variant="primary" onClick={openAddModal}>Add Employee</Button>
        </div>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                {/* Employees can only edit themselves */}
                {role === "employee" && currentUserId == emp.id && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openEditModal(emp)}
                  >
                    Edit
                  </Button>
                )}

                {/* Manager/HR can edit or delete anyone */}
                {role !== "employee" && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => openEditModal(emp)}
                      className="me-2"
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
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingData ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm
            initialData={editingData}
            onSaved={() => {
              setShowModal(false);
              fetchEmployees();
            }}
            role={role}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EmployeesTable;
