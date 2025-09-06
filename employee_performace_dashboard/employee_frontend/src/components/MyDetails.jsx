import React, { useState, useEffect } from "react";
import EmployeesTable from "./EmployeesTable";
import axios from "axios";
import { Spinner, Card } from "react-bootstrap";

function MyDetails() {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("user_id"); // get logged-in user id

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("All employees from API:", res.data);
        console.log("Current user ID:", currentUserId);

        // Filter only the logged-in employee by ID
        const empData = res.data.filter(emp => emp.id == currentUserId);

        setEmployee(empData);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUserId]);

  if (loading) return <Spinner animation="border" />;

  if (!employee || employee.length === 0)
    return <p>No details found for the logged-in user.</p>;

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>My Details</Card.Header>
      <Card.Body>
        <EmployeesTable
          employeesProp={employee}
          readOnly={false} // Allow edit
          role="employee"  // Hides Add/Delete buttons
        />
      </Card.Body>
    </Card>
  );
}

export default MyDetails;
