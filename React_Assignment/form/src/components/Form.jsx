import React, { useState } from "react";

function Form() {
  const [fields, setFields] = useState([{ id: Date.now(), value: "" }]);
  const [submittedValues, setSubmittedValues] = useState([]);

  // Handle field value change
  const handleChange = (id, value) => {
    setFields(fields.map(f => (f.id === id ? { ...f, value } : f)));
  };

  // Add new field
  const AddField = (e) => {
    e.preventDefault();
    setFields([...fields, { id: Date.now(), value: "" }]);
  };

  // Remove a specific field
  const RemoveField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    setSubmittedValues(submittedValues.filter((_, idx) => fields[idx]?.id !== id));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const values = fields.map(f => f.value).filter(v => v !== "");
    setSubmittedValues(values);
  };

  return (
    <div>
      <div className="card ">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <div className="d-flex align-items-center mb-2" key={field.id}>
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder={`Enter your name ${index + 1}`}
                  value={field.value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => RemoveField(field.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button type="button" className="btn btn-success ms-2" onClick={AddField}>
               Add Field
            </button>
          </form>

          <h3 className="mt-3">Submitted values are:</h3>
          <ul className="list-group mt-2">
            {submittedValues.map((val, idx) => (
              <li key={idx} className="list-group-item">
                {val}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Form;
