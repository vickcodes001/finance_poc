import { useState } from "react";
import axios from "axios";

const User = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // update based on field name
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      console.log("User saved:", res.data);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col border">
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        className="h-5"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Save User</button>
    </form>
  );
}

export default User