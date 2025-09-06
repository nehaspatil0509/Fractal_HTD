import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import axios from "axios";

function TasksChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/performance/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data); // Show all tasks for everyone
      } catch (err) {
        console.error("Error fetching tasks data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading tasks chart...</p>;
  if (data.length === 0) return <p>No tasks data available.</p>;

  const options = {
    chart: { type: "column" },
    title: { text: "Tasks Completed / Pending" },
    xAxis: { categories: data.map((emp) => emp.employee_name) },
    yAxis: { title: { text: "Tasks" } },
    series: [
      { name: "Completed", data: data.map((emp) => emp.completed_tasks), color: "#28a745" },
      { name: "Pending", data: data.map((emp) => emp.pending_tasks), color: "#dc3545" },
    ],
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Card.Body>
    </Card>
  );
}

export default TasksChart;
