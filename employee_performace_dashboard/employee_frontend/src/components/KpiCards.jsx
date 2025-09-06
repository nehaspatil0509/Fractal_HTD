import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaUsers, FaTasks, FaCheckCircle, FaStar } from "react-icons/fa";
import axios from "axios";

function KpiCards() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole !== "employee") { // Only fetch for manager/admin
      const fetchKPIs = async () => {
        try {
          const token = localStorage.getItem("access");
          const res = await axios.get(
            "http://127.0.0.1:8000/api/performance/reports/dashboard-reports/",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const data = res.data;

          const transformedKpis = [
            { title: "Total Employees", value: data.total_employees, color: "success", icon: <FaUsers size={25} /> },
            { title: "Average Completed Tasks", value: data.avg_tasks_completed, color: "warning", icon: <FaTasks size={25} /> },
            { title: "Average Attendance", value: data.Attendance, color: "info", icon: <FaCheckCircle size={25} /> },
            { title: "Average Employee Rating", value: data.avg_employee_rating, color: "primary", icon: <FaStar size={25} /> },
          ];

          setKpis(transformedKpis);
        } catch (err) {
          console.error("Error fetching KPIs:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchKPIs();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading KPIs...</p>;
  if (role === "employee") return null; // Employees don't see KPI cards

  return (
    <Row className="g-3">
      {kpis.map((kpi, index) => (
        <Col key={index} sm={6} md={3}>
          <Card
            border={kpi.color}
            style={{ height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-2">
              <div style={{ marginBottom: "5px", color: kpi.color }}>{kpi.icon}</div>
              <Card.Title className="text-center fs-6">{kpi.title}</Card.Title>
              <Card.Text className="fs-5 fw-bold text-center mb-0">{kpi.value}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default KpiCards;
