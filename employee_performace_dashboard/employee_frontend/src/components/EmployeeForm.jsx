import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function EmployeeForm({ initialData = null, onSaved, role }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    designation: "",
    date_of_joining: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUserId = localStorage.getItem("user_id"); // to restrict employee edits

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        email: initialData.email || "",
        department: initialData.department || "",
        designation: initialData.designation || "",
        date_of_joining: initialData.date_of_joining || "",
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        designation: "",
        date_of_joining: "",
      });
    }
    setError("");
    setSuccess("");
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔹 Validate required fields
    for (const key in formData) {
      if (!formData[key]) {
        setError(`${key.replace("_", " ")} is required`);
        return;
      }
    }

    // 🔹 If role is employee, ensure editing own record
    if (role === "employee" && initialData && currentUserId != initialData.id) {
      setError("You can only edit your own record");
      return;
    }

    try {
      const token = localStorage.getItem("access");

      if (initialData) {
        // Edit
        await axios.put(
          `http://127.0.0.1:8000/api/employees/${initialData.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Employee updated successfully!");
      } else {
        // Add (only manager/admin)
        await axios.post(
          `http://127.0.0.1:8000/api/employees/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Employee added successfully!");
      }

      onSaved?.();
    } catch (err) {
      if (err.response && err.response.data?.email) {
        setError("Email already exists");
      } else {
        setError("Failed to save employee");
      }
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {role !== "employee" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Joining</Form.Label>
            <Form.Control
              type="date"
              name="date_of_joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </>
      )}

      <Button type="submit" variant="primary">
        {initialData ? "Update" : "Save"}
      </Button>
    </Form>
  );
}

export default EmployeeForm;
