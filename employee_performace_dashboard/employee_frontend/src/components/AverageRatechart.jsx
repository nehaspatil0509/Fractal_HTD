import React from 'react';
import { Card, Button } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useState, useEffect } from 'react';
import axios from 'axios';

function AvgRatingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access"); // Get JWT access token

    axios
      .get('http://127.0.0.1:8000/api/performance/', {
        headers: {
          Authorization: `Bearer ${token}`, // attach token here
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
    chart: { type: 'line' },
    title: { text: 'Avg Rating' },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { title: { text: 'Rating' }, max: 5 },
    series: [
      { 
        name: 'Rating', 
        data: data.map(emp => emp.rating), 
        color: '#17a2b8' 
      }
    ],
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Avg Rating</Card.Title>
          <Button variant="outline-secondary" size="sm">Filter</Button>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Card.Body>
    </Card>
  );
}

export default AvgRatingChart;
