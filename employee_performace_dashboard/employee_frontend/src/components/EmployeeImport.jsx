import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function EmployeeImport() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access");
      await axios.post("http://127.0.0.1:8000/api/employees/import/", formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMessage("Employees imported successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to import employees.");
    }
  };

  return (
    <div className="container my-4">
      <h4>Import Employees</h4>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>CSV / Excel File</Form.Label>
          <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} required />
        </Form.Group>
        <Button type="submit" variant="primary">Upload</Button>
      </Form>
    </div>
  );
}

export default EmployeeImport;
