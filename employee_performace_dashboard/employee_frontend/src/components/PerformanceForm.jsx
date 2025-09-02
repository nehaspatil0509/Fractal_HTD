import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function PerformanceForm({ show, handleClose, initialData = null, onSaved }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee: "",
    completed_tasks: "",
    pending_tasks: "",
    rating: "",
  });

  useEffect(() => {
    if (!show) return;

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const empList = Array.isArray(res.data) ? res.data : [];
        setEmployees(empList);

        // Prefill form only after employees loaded
        if (initialData) {
          setFormData({
            employee: initialData.employee.id || initialData.employee,
            completed_tasks: initialData.completed_tasks,
            pending_tasks: initialData.pending_tasks,
            rating: initialData.rating,
          });
        } else {
          setFormData({ employee: "", completed_tasks: "", pending_tasks: "", rating: "" });
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [show, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      if (initialData && initialData.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/performance/${initialData.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Performance updated successfully!");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/performance/",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Performance added successfully!");
      }
      onSaved?.();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error saving performance.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Performance" : "Add Performance"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Completed Tasks</Form.Label>
              <Form.Control
                type="number"
                name="completed_tasks"
                value={formData.completed_tasks}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pending Tasks</Form.Label>
              <Form.Control
                type="number"
                name="pending_tasks"
                value={formData.pending_tasks}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              {initialData ? "Update" : "Save"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PerformanceForm;
