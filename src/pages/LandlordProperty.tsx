import '../Styles/Landlord.css'
import LandlordSidebar from "../components/LandlordSidebar";
import DashboardHeader from "../components/DashboardHeader";
import Button from '../components/Button';
import PropertyTable from "../components/PropertyTable";
import AddPropertyModal from '../components/AddPropertyModal';
import React, { useState } from "react";


const LandlordProperty = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
        <div className= "landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader 
                    firstName='Tunde'
                    lastName='Omoniyi'
                     />
                </div>

                <div className="landlord_body">
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_right">
                            <h3>My Properties</h3>
                            <p>Manage and view all your properties</p>
                        </div>

                        <div className="landlord_property_header_left">
                            <Button 
                            label='Add New Property'
                            onclick={() => setOpenModal(true)}
                            />
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <PropertyTable />
                    </div>

                    <AddPropertyModal 
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}/>
                </div>
            </div>
        </div>
        </>
    );
}

export default LandlordProperty;