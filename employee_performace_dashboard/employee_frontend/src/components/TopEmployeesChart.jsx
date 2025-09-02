import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { Card } from "react-bootstrap";

function TopEmployeesChart() {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchTopEmployees = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/performance/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // sort by rating and take top 5
        const topEmployees = res.data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);

        setChartOptions({
          chart: { type: "column" },
          title: { text: "Top 5 Employees by Rating" },
          xAxis: {
            categories: topEmployees.map((emp) => emp.employee_name),
            title: { text: "Employees" },
          },
          yAxis: {
            min: 0,
            title: { text: "Rating" },
          },
          series: [
            {
              name: "Rating",
              data: topEmployees.map((emp) => emp.rating),
              color: "#007bff",
            },
          ],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopEmployees();
  }, []);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        {/* <Card.Title className="mb-3">Top 5 Employees</Card.Title> */}
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Card.Body>
    </Card>
  );
}

export default TopEmployeesChart;
