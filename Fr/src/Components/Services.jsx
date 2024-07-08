import React, { useState, useEffect } from "react";
import axios from "axios";
import './Style.css'


const Services = () => {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({ heading: "", description: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get("http://localhost:3000/services");
    setServices(res.data);
  };

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("heading", service.heading);
    formData.append("description", service.description);
    formData.append("image", file);

    await axios.post("http://localhost:3000/services", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    fetchServices();
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("heading", service.heading);
    formData.append("description", service.description);
    if (file) {
      formData.append("image", file);
    }

    await axios.put(`http://localhost:3000/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    fetchServices();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/services/${id}`);
    fetchServices();
  };

  return (
    <div id="cbshjj">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="heading"
          value={service.heading}
          onChange={handleChange}
          placeholder="Heading"
        />
        <input
          type="text"
          name="description"
          value={service.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Add Service</button>
      </form>
      <ul className="chjssvhvchgb">
        {services.map((service) => (
          <li key={service._id} className="cbshjvhcv">
            <h3>{service.heading}</h3>
            <p>{service.description}</p>
            <img className="chshjvchgvshjvh" src={`http://localhost:3000/uploads/${service.image}`} alt="Service" width="100" />
            <button onClick={() => handleUpdate(service._id)}>Update</button>
            <button onClick={() => handleDelete(service._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
