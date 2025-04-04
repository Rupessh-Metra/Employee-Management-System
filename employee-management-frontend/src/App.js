import React, { useEffect, useState } from 'react';
import './App.css'; // 👈 Add this line for custom CSS

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', department: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:8080/api/employees';

  const fetchEmployees = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: '', department: '' });
      setEditingId(null);
      fetchEmployees();
    }
  };

  const handleEdit = (employee) => {
    setForm({ name: employee.name, department: employee.department });
    setEditingId(employee.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchEmployees();
  };

  return (
    <div className="container">
      <h1>Employee Management</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h2>Employee List</h2>
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp.id}>
            <span><b>{emp.name}</b> - {emp.department}</span>
            <div className="actions">
              <button onClick={() => handleEdit(emp)}>Edit</button>
              <button onClick={() => handleDelete(emp.id)} className="delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
