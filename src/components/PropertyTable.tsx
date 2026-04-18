import React, { useState, useEffect, useRef } from "react";
import "../Styles/Cards.css";

const properties = [
  {
    id: 1,
    title: "3 Bedroom Duplex",
    location: "Ajah, Lagos",
    rent: "₦2,000,000/year",
    status: "Occupied",
  },

  {
    id: 2,
    title: "3 Bedroom Duplex",
    location: "Ajah, Lagos",
    rent: "₦2,000,000/year",
    status: "Vacant",
  },

];

const PropertyTable = () => {
  const [openActionId, setOpenActionId] = useState(null);
  const actionRef = useRef(null);

  const toggleAction = (id) => {
    setOpenActionId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setOpenActionId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="table_group">
      <table className="property_table">
        <thead>
          <tr>
            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Title</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Status</th>
            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.location}</td>
              <td>{property.rent}</td>

 
              <td>
                <span
                  className={`status ${
                    property.status.toLowerCase() === "occupied"
                      ? "occupied"
                      : "vacant"
                  }`}
                >
                  {property.status}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="actions_group">
                <div className="action_body" ref={actionRef}>
                  <button
                    className="action_btn"
                    onClick={() => toggleAction(property.id)}
                  >
                    ⋮
                  </button>

                  {openActionId === property.id && (
                    <div className="dropdown_menu">
                      <button>Edit</button>
                      <button>Delete</button>
                      <button>View Details</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;