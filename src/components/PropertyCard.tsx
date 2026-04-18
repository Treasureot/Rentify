import React from "react";
import "../Styles/PropertyCard.css";
import { FaBed, FaBath } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

type PropertyCardProps = {
  image: string;
  status?: string;
  price: string;
  period?: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  onViewDetails?: () => void;
  onRentNow?: () => void;
};

const PropertyCard = ({
  image,
  status = "AVAILABLE",
  price,
  period = "year",
  title,
  location,
  beds,
  baths,
  onViewDetails,
  onRentNow,
}: PropertyCardProps) => {
  return (
    <div className="property-card">

      <div className="property-image-wrapper">
        <img src={image} alt={title} className="property-image" />
        <span className="property-status">● {status}</span>
      </div>

  
      <div className="property-content">
        
        <div className="property-price">
          {price} <span className="property-period">/ {period}</span>
        </div>

        <div className="property-title">{title}</div>

        <div className="property-location">
          <MdLocationOn size={14} />
          {location}
        </div>

        <div className="property-row">
          <div className="property-features">
            <span><FaBed size={16} /> {beds}</span>
            <span><FaBath size={16} /> {baths}</span>
          </div>

          <div className="property-link" onClick={onViewDetails}>
           <a href="./login">View Details <FiArrowRight size={16} /></a> 
          </div>
        </div>

        <a href="/login"><button className="property-button" onClick={onRentNow}>Rent Now</button></a>

      </div>
    </div>
  );
};

export default PropertyCard;