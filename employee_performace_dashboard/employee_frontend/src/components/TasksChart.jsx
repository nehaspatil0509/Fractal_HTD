import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from 'axios';

function TasksChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access"); // Get JWT access token

    axios
      .get('http://127.0.0.1:8000/api/performance/', {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach token here
        },
      })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      });
  }, []);

  const options = {
    chart: { type: 'column' },
    title: { text: 'Tasks Completed' },
    xAxis: { categories: data.map(emp => emp.employee_name) },
    yAxis: { title: { text: 'Tasks' } },
    series: [
      { name: 'Completed', data: data.map(emp => emp.completed_tasks), color: '#28a745' },
      { name: 'Pending', data: data.map(emp => emp.pending_tasks), color: '#dc3545' },
    ]
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
