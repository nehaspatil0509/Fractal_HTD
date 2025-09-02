import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Container, Card } from "react-bootstrap";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token"); // get token after login

        const res = await axios.get("http://127.0.0.1:8000/api/attendance/", {
          headers: {
            Authorization: `Bearer ${token}`, // JWT auth
          },
        });

        setAttendance(res.data);
      } catch (err) {
        setError("Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h3 className="mb-4 text-center">My Attendance</h3>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          record.status === "Present"
                            ? "bg-success"
                            : record.status === "Absent"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>{record.check_in || "-"}</td>
                    <td>{record.check_out || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No attendance records available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Attendance;
