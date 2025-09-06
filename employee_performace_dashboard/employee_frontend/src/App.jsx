import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Button, Table, Modal } from "react-bootstrap";
import axios from "axios";

import Header from "./components/Header";
import Footer from "./components/Footer";
import KpiCards from "./components/KpiCards";
import TasksChart from "./components/TasksChart";
import EmployeesTable from "./components/EmployeesTable";
import AvgRatingChart from "./components/AvgRatingChart";
import DepartmentChart from "./components/Departmentchart";
import TopEmployeesChart from "./components/TopEmployeesChart";
import LoginPage from "./components/Login";
import PerformanceForm from "./components/PerformanceForm";
import EmployeeImport from "./components/EmployeeImport";

// 🔹 Private Route Wrapper
const PrivateRoute = ({ isAuthenticated, children }) =>
  isAuthenticated ? children : <Navigate to="/login" replace />;

// 🔹 Employee Import Modal
function EmployeeImportModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="success" onClick={() => setShow(true)}>
        Import Employees
      </Button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Import Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeImport />
        </Modal.Body>
      </Modal>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [showPerformanceForm, setShowPerformanceForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // For Add Employee button

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem("role"));
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setRole("");
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

  return (
    <Router>
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Home / Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container my-4 flex-grow-1">
                {role !== "employee" && (
                  <div className="mb-4">
                    <KpiCards />
                  </div>
                )}

                <div className="row mb-4">
                  {role !== "employee" && (
                    <div className="col-md-6">
                      <TopEmployeesChart />
                    </div>
                  )}
                  {role !== "employee" && (
                    <div className="col-md-6">
                      <DepartmentChart />
                    </div>
                  )}
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <TasksChart role={role} />
                  </div>
                  <div className="col-md-6">
                    <AvgRatingChart role={role} />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Employees (manager/admin) */}
        <Route
          path="/employees"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container my-4">
                <h3>Employees</h3>
                {role !== "employee" && (
                  <div className="d-flex justify-content-end mb-3">
                    <EmployeeImportModal />
                  </div>
                )}
                <EmployeesTable
                  role={role}
                  showAddModal={showAddModal}
                  setShowAddModal={setShowAddModal}
                />
              </div>
            </PrivateRoute>
          }
        />

        {/* My Details (employee) */}
        <Route
          path="/my-details"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container my-4">
                <h3>My Details</h3>
                <EmployeesTable role="employee" />
              </div>
            </PrivateRoute>
          }
        />

        {/* Performance / Reports */}
        <Route
          path="/reports"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="container my-4">
                {role !== "employee" && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Performance Reports</h4>
                    <Button
                      onClick={() => {
                        setEditingData(null);
                        setShowPerformanceForm(true);
                      }}
                    >
                      Add Performance
                    </Button>
                  </div>
                )}

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
                          {role !== "employee" && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => openEditModal(perf)}
                            >
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <PerformanceForm
                  show={showPerformanceForm}
                  handleClose={() => {
                    setShowPerformanceForm(false);
                    fetchPerformances();
                  }}
                  initialData={editingData}
                  role={role}
                />
              </div>
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default App;
