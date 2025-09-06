import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from 'axios';

function DepartmentChart() {
  const [chartData, setChartData] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "manager" || storedRole === "admin") {
      const token = localStorage.getItem("access");

      axios
        .get('http://127.0.0.1:8000/api/employees/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const deptCounts = {};
          res.data.forEach((emp) => {
            const dept = emp.department || "Unknown";
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
          });

          const data = Object.entries(deptCounts).map(([name, y]) => ({ name, y }));
          setChartData(data);
        })
        .catch((err) => console.error("Error fetching employees:", err.response ? err.response.data : err.message));
    }
  }, []);

  if (role === "employee") return null; // Employees can't see department chart

  const options = {
    chart: { type: 'pie' },
    title: { text: 'Employees by Department' },
    plotOptions: { pie: { innerSize: '60%' } },
    series: [
      {
        name: 'Employees',
        colorByPoint: true,
        data: chartData,
      },
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

export default DepartmentChart;
