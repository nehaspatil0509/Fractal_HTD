import React from 'react';
import Fruits from './components/Fruits';
import Api from './components/Api';

function App() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="container text-center p-4 shadow-sm rounded bg-white" style={{ maxWidth: "800px" }}>
        <h1 className="mb-3">Shopping Cart</h1>
        <p className="lead mb-4">Manage your items below:</p>
        <Fruits />
        <Api />
      </div>
    </div>
  );
}

export default App;

