import "../Styles/Cards.css";
import Input from "../components/Input";
import Button from "../components/Button";
import ButtonAlt from "../components/ButtonAlt";
import React, { useState, useEffect } from "react";

function AddPropertyModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("title:", title);
    console.log("description:", description);
    console.log("location:", location);
    console.log("rent:", rent);
    console.log("type:", type);
    console.log("images:", images);
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="add_modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal_header">
          <h3>Add Property</h3>
        </div>

        <div className="modal_body">
          <form className="modal_form" onSubmit={handleSubmit}>
            
            <Input
              label="Property Title"
              type="text"
              placeholder="e.g Mini Flat in Yaba"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="input_group">
              <label>Description</label>
              <textarea
                placeholder="Write here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
        <div className="input_body">
            <Input
              label="Location"
              type="text"
              placeholder="e.g Yaba, Lagos"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <Input
              label="Rent"
              type="text"
              value={rent}
              placeholder=""
              onChange={(e) => setRent(e.target.value)}
              required
            />
        </div>


            <div className="input_group">
              <label>Property Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Shop">Shop</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div className="input_group">
              <label>Upload Images</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            <div className="modal_actions">
              <ButtonAlt
                label="Cancel"
                type="button"
                onClick={onClose}
              />       
              <Button label="Submit for Approval" type="submit" />
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddPropertyModal;