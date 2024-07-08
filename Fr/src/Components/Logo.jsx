import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Logo.css";

function Logo() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchLatestImage();
  }, []);

  const fetchLatestImage = async () => {
    try {
      const response = await axios.get("http://localhost:3000/latest-image");
      const { filename } = response.data;
      if (filename) {
        setImage(`http://localhost:3000/uploads/${filename}`);
      } else {
        setImage(null);
      }
    } catch (error) {
      setImage(null);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setSelectedFile(null);
      fetchLatestImage();
    } catch (error) {
      setMessage("Error uploading file");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete("http://localhost:3000/delete");
      setMessage(response.data.message);
      setImage(null);
    } catch (error) {
      setMessage("Error deleting file");
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      setMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.put(
        "http://localhost:3000/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setSelectedFile(null);
      fetchLatestImage();
    } catch (error) {
      setMessage("Error updating file");
    }
  };

  return (
    <div className="chshghjcjc">
      <div className="Appcshjh">
        <h1>Image Upload and Management</h1>
        {message && <p>{message}</p>}
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleUpload}>Upload Image</button>
        {image && <img src={image} alt="Logo" className="image-preview" />}
        {image && (
          <>
            <button onClick={handleUpdate}>Update Image</button>
            <button onClick={handleDelete}>Delete Image</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Logo;
