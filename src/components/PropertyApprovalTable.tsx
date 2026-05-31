import "../Styles/Cards.css";
import { useState, useEffect, useRef } from "react";
import PropertyApprovalDetails from "./PropertyApprovalDetails";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";

type PropertyImage = {
    id: string;
    imageUrl: string;
    fileName: string;
    isPrimary: boolean;
};

type PropertyLandlord = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
};

export type PropertyItem = {
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
    landlord: PropertyLandlord;
    images: PropertyImage[];
};

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year:  "numeric",
        month: "long",
        day:   "numeric",
    });

const getStatusClass = (status: string) => {
    switch (status) {
        case "Pending":  return "property_status property_status--pending";
        case "Approved": return "property_status property_status--approved";
        case "Rejected": return "property_status property_status--rejected";
        default:         return "";
    }
};

const PropertyApprovalTable = () => {
    const token = localStorage.getItem("accessToken") || "";

    const [properties, setProperties]   = useState<PropertyItem[]>([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState("");
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<PropertyItem | null>(null);
    const [approveProperty, setApproveProperty] = useState<PropertyItem | null>(null);
    const [rejectProperty, setRejectProperty]   = useState<PropertyItem | null>(null);
    const [openApproveSuccess, setOpenApproveSuccess] = useState(false);
    const [openRejectSuccess, setOpenRejectSuccess]   = useState(false);

    const actionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const setRef = (id: string) => (el: HTMLDivElement | null) => {
        if (el) actionRefs.current.set(id, el);
        else actionRefs.current.delete(id);
    };

    const toggleAction = (id: string) => {
        setOpenActionId((prev) => (prev === id ? null : id));
    };

    // Fetch pending properties
    const fetchProperties = async () => {
        setIsLoading(true);
        setError("");

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/pending`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setProperties(response.data);
            } else {
                setError(response.message || "Failed to load pending properties.");
            }

        } catch {
            setError("No Pending Property Approval.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openActionId === null) return;
            const activeRef = actionRefs.current.get(openActionId);
            if (activeRef && !activeRef.contains(event.target as Node)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openActionId]);

    const handleConfirmApprove = async () => {
        if (!approveProperty) return;
        const id = approveProperty.id;

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setProperties((prev) => prev.filter((p) => p.id !== id));
                setApproveProperty(null);
                setOpenApproveSuccess(true);
            } else {
                setError(response.message || "Failed to approve property.");
                setApproveProperty(null);
            }

        } catch {
            setError("No pending property approval.");
            setApproveProperty(null);
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectProperty) return;
        const id = rejectProperty.id;

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}/reject`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setProperties((prev) => prev.filter((p) => p.id !== id));
                setRejectProperty(null);
                setOpenRejectSuccess(true);
            } else {
                setError(response.message || "Failed to reject property.");
                setRejectProperty(null);
            }

        } catch {
            setError("Network error. Please check your connection.");
            setRejectProperty(null);
        }
    };

    return (
        <>
            <div className="table_group">
                <table className="approval_table">
                    <thead>
                        <tr>
                            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Title</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th>Rent Amount/yr</th>
                            <th>Submitted By</th>
                            <th>Date Submitted</th>
                            <th>Status</th>
                            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    Loading pending properties...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={8}>
                                    <div style={{
                                        backgroundColor: '#fff5f5',
                                        border: '1px solid #feb2b2',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                                        <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : properties.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    No pending properties.
                                </td>
                            </tr>
                        ) : (
                            properties.map((property) => (
                                <tr key={property.id}>
                                    <td>{property.title}</td>
                                    <td>{property.location}</td>
                                    <td>{property.address}</td>
                                    <td>{formatCurrency(property.rentAmount)}</td>
                                    <td>{property.landlord.fullName}</td>
                                    <td>{formatDate(property.createdDate)}</td>
                                    <td>
                                        <span className={getStatusClass(property.status)}>
                                            {property.status}
                                        </span>
                                    </td>

                                    <td className="actions_group">
                                        <div className="action_body" ref={setRef(property.id)}>
                                            <button
                                                className="action_btn"
                                                onClick={() => toggleAction(property.id)}
                                            >
                                                ⋮
                                            </button>

                                            {openActionId === property.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => {
                                                        setDetailsProperty(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        View Details
                                                    </button>
                                                    <button onClick={() => {
                                                        setApproveProperty(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Approve
                                                    </button>
                                                    <button onClick={() => {
                                                        setRejectProperty(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {detailsProperty && (
                <div className="modal_overlay" onClick={() => setDetailsProperty(null)}>
                    <div className="property_details_modal" onClick={(e) => e.stopPropagation()}>
                        <PropertyApprovalDetails
                            property={detailsProperty}
                            onClose={() => setDetailsProperty(null)}
                            onApprove={(id) => {
                                setDetailsProperty(null);
                                const p = properties.find((p) => p.id === id);
                                if (p) setApproveProperty(p);
                            }}
                            onReject={(id) => {
                                setDetailsProperty(null);
                                const p = properties.find((p) => p.id === id);
                                if (p) setRejectProperty(p);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Approve confirmation modal */}
            {approveProperty && (
                <div className="modal_overlay" onClick={() => setApproveProperty(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <ApprovalModal
                            title="Approve Property"
                            approvalMessage={`Do you want to approve "${approveProperty.title}"?`}
                            label="Approve"
                            labelAlt="Cancel"
                            onClose={() => setApproveProperty(null)}
                            onConfirm={handleConfirmApprove}
                            isOpen={!!approveProperty}
                        />
                    </div>
                </div>
            )}

            {/* Reject confirmation modal */}
            {rejectProperty && (
                <div className="modal_overlay" onClick={() => setRejectProperty(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <ApprovalModal
                            title="Reject Property"
                            approvalMessage={`Do you want to reject "${rejectProperty.title}"?`}
                            label="Reject"
                            labelAlt="Cancel"
                            onClose={() => setRejectProperty(null)}
                            onConfirm={handleConfirmReject}
                            isOpen={!!rejectProperty}
                        />
                    </div>
                </div>
            )}

            <SuccessModal
                title="Property Approved"
                message="You have successfully approved this property. The landlord has been notified."
                label="Done"
                path=""
                isOpen={openApproveSuccess}
                onClose={() => setOpenApproveSuccess(false)}
                onDone={() => setOpenApproveSuccess(false)}
            />

            <SuccessModal
                title="Property Rejected"
                message="You have successfully rejected this property. The landlord has been notified."
                label="Done"
                path=""
                isOpen={openRejectSuccess}
                onClose={() => setOpenRejectSuccess(false)}
                onDone={() => setOpenRejectSuccess(false)}
            />
        </>
    );
};

export default PropertyApprovalTable;