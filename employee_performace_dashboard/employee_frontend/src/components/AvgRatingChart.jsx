import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import axios from 'axios';

function AvgRatingChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get('http://127.0.0.1:8000/api/performance/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching rating data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (data.length === 0) return <p>No rating data available.</p>;

  const options = {
    chart: { type: 'line' },
    title: { text: 'Average Employee Rating' },
    xAxis: { categories: data.map(emp => emp.employee_name) },
    yAxis: { title: { text: 'Rating' }, max: 5 },
    series: [
      {
        name: 'Rating',
        data: data.map(emp => emp.rating),
        color: '#17a2b8'
      }
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

export default AvgRatingChart;
