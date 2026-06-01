import { useState, useCallback } from "react";
import "../../Styles/Landlord.css";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import Button from "../../components/Button";
import PropertyTable from "../../components/PropertyTable";
import AddPropertyModal from "../../components/AddPropertyModal";
import ApprovalModal from "../../components/ApprovalModal";
import SuccessModal from "../../components/SuccessModal";

export type Property = {
    id: string;
    title: string;
    description: string;
    location: string;
    address: string;
    rentAmount: number;
    propertyType: string;
    status: string;
    occupancyStatus: string;
    rejectionReason: string;
    primaryImageUrl: string;
    createdDate: string;
    landlord: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    images: {
        id: string;
        imageUrl: string;
        fileName: string;
        isPrimary: boolean;
    }[];
};

const LandlordProperty = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const token     = localStorage.getItem("accessToken") || "";

    const [openModal, setOpenModal]               = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    // Delete confirmation
    const [deleteTargetId, setDeleteTargetId]   = useState<string | null>(null);
    const [isDeleting, setIsDeleting]           = useState(false);
    const [deleteError, setDeleteError]         = useState("");
    const [deleteSuccess, setDeleteSuccess]     = useState(false);

    
    const [tableKey, setTableKey] = useState(0);
    const refreshTable = useCallback(() => setTableKey((k) => k + 1), []);

    // ── Save (add or edit) 
    const handleSaveProperty = (_property: Property) => {
        setOpenModal(false);
        setSelectedProperty(null);
        refreshTable();
    };

    // ── Delete 
    // PropertyTable calls this, we open a confirmation modal 
    const handleDeleteRequest = (id: string) => {
        setDeleteError("");
        setDeleteTargetId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTargetId) return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${deleteTargetId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setDeleteTargetId(null);
                setDeleteSuccess(true);
                refreshTable();
            } else {
                setDeleteError(data.message || "Failed to delete property.");
            }
        } catch {
            setDeleteError("No details found at the moment.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (property: Property) => {
        setSelectedProperty(property);
        setOpenModal(true);
    };

    return (
        <div className="landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader firstName={firstName} lastName={lastName} />
                </div>

                <div className="landlord_body">
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_left">
                            <h3>My Properties</h3>
                            <p>Manage and view all your properties.</p>
                        </div>
                        <div className="landlord_property_header_right">
                            <Button
                                label="Add New Property"
                                onClick={() => { setSelectedProperty(null); setOpenModal(true); }}
                            />
                        </div>
                    </div>

                    {/* Delete error banner */}
                    {deleteError && (
                        <div style={{
                            backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                            borderRadius: "8px", padding: "10px 14px", marginBottom: "12px",
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            <span style={{ color: "#e53e3e" }}>⚠</span>
                            <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>{deleteError}</p>
                        </div>
                    )}

                    <div className="landlord_property_content">

                        <PropertyTable
                            key={tableKey}
                            onDelete={handleDeleteRequest}
                            onEdit={handleEdit}
                        />
                    </div>


                    <AddPropertyModal
                        isOpen={openModal}
                        onClose={() => { setOpenModal(false); setSelectedProperty(null); }}
                        property={selectedProperty}
                        onAdd={handleSaveProperty}
                        onRefresh={refreshTable}
                    />

 
                    <ApprovalModal
                        title="Delete Property"
                        approvalMessage="Are you sure you want to permanently delete this property? This cannot be undone."
                        isOpen={!!deleteTargetId}
                        onClose={() => { setDeleteTargetId(null); setDeleteError(""); }}
                        onConfirm={handleConfirmDelete}
                        label={isDeleting ? "Deleting…" : "Delete"}
                        labelAlt="Cancel"
                    />


                    <SuccessModal
                        title="Property Deleted"
                        message="The property has been successfully removed."
                        label="Done"
                        path=""
                        isOpen={deleteSuccess}
                        onClose={() => setDeleteSuccess(false)}
                        onDone={() => setDeleteSuccess(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandlordProperty;