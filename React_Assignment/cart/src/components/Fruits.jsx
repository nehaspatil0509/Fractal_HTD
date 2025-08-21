import React, { useState } from "react";

function Fruits() {
  const [cart, setCart] = useState([
    { id: 1, fruit: "Apple", price: 100, quantity: 1 },
    { id: 2, fruit: "Banana", price: 50, quantity: 1 },
    { id: 3, fruit: "Orange", price: 80, quantity: 1 },
  ]);

  const handleIncrement = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // total cart value
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container d-flex flex-column align-items-center">
      {cart.map((fruit) => (
        <div
          key={fruit.id}
          className="card shadow-sm mb-4 w-50"
          style={{ maxWidth: "400px" }}
        >
          <div className="card-body text-center">
            <h4 className="card-title">{fruit.fruit}</h4>
            <p className="card-text">Unit Price: ₹{fruit.price}</p>

            <div className="d-flex justify-content-center align-items-center mb-3">
              <button
                className="btn btn-danger"
                onClick={() => handleDecrement(fruit.id)}
              >
                -
              </button>
              <p className="card-text px-3 mb-0">{fruit.quantity}</p>
              <button
                className="btn btn-success"
                onClick={() => handleIncrement(fruit.id)}
              >
                +
              </button>
            </div>

            <h5>Total: ₹{fruit.price * fruit.quantity}</h5>
          </div>
        </div>
      ))}

      <div className="mt-4 text-center">
        <h3>Cart Total: ₹{total}</h3>
      </div>
    </div>
  );
}

export default Fruits;
