import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import KpiCards from "./components/KpiCards";
import TasksChart from "./components/TasksChart";
import EmployeesTable from "./components/EmployeesTable";
import AvgRatingChart from "./components/AverageRatechart";
import DepartmentChart from "./components/Departmentchart";
import LoginPage from "./components/Login";
import PerformanceForm from "./components/PerformanceForm";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
  const [showPerformanceForm, setShowPerformanceForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [performances, setPerformances] = useState([]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  const fetchPerformances = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://127.0.0.1:8000/api/performance/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPerformances();
  }, [isAuthenticated]);

  const openEditModal = (data) => {
    setEditingData(data);
    setShowPerformanceForm(true);
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      {isAuthenticated && <Header onLogout={handleLogout} />}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Home Page */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="container my-4 flex-grow-1">
                <div className="row mb-4">
                  <div className="col-12">
                    <KpiCards />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <TasksChart />
                  </div>
                  <div className="col-md-6">
                    <AvgRatingChart />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <EmployeesTable />
                  </div>
                  <div className="col-md-6">
                    <DepartmentChart />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Employees Page */}
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <div className="container my-4">
                <EmployeesTable />
              </div>
            </PrivateRoute>
          }
        />

        {/* Performance / Reports Page */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <div className="container my-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Performance Reports</h4>
                  <Button onClick={() => { setEditingData(null); setShowPerformanceForm(true); }}>
                    Add Performance
                  </Button>
                </div>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Completed Tasks</th>
                      <th>Pending Tasks</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performances.map((perf) => (
                      <tr key={perf.id}>
                        <td>{perf.employee_name}</td>
                        <td>{perf.completed_tasks}</td>
                        <td>{perf.pending_tasks}</td>
                        <td>{perf.rating}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => openEditModal(perf)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <PerformanceForm
                  show={showPerformanceForm}
                  handleClose={() => { setShowPerformanceForm(false); fetchPerformances(); }}
                  initialData={editingData}
                />
              </div>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>

      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
