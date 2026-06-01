import "../Styles/cards.css";
import { useState, useEffect, useRef, useCallback } from "react";
import PropertyApprovalDetails from "./PropertyApprovalDetails";
import ApprovalModal from "./ApprovalModal";
import RejectModal from "./RejectModal";
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
        year: "numeric", month: "long", day: "numeric",
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

    const [properties, setProperties]     = useState<PropertyItem[]>([]);
    const [isLoading, setIsLoading]       = useState(true);
    const [error, setError]               = useState("");
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    const [detailsProperty, setDetailsProperty] = useState<PropertyItem | null>(null);
    const [approveProperty, setApproveProperty] = useState<PropertyItem | null>(null);
    const [rejectProperty, setRejectProperty]   = useState<PropertyItem | null>(null);
    const [openApproveSuccess, setOpenApproveSuccess] = useState(false);
    const [openRejectSuccess, setOpenRejectSuccess]   = useState(false);
    const [actionMsg, setActionMsg] = useState("");

    const actionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const setRef = (id: string) => (el: HTMLDivElement | null) => {
        if (el) actionRefs.current.set(id, el);
        else actionRefs.current.delete(id);
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (openActionId === null) return;
            const ref = actionRefs.current.get(openActionId);
            if (ref && !ref.contains(e.target as Node)) setOpenActionId(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [openActionId]);

    // ── Fetch pending properties
    // GET /Properties/pending
    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(
                "https://propms-api.fly.dev/api/v1/Properties/pending",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setProperties(data.data);
            } else {
                setError(data.message || "Failed to load pending properties.");
            }
        } catch {
            setError("No details found at the moment.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    // ── Approve: POST /Properties/{id}/approve
    const handleConfirmApprove = async () => {
        if (!approveProperty) return;
        const id = approveProperty.id;
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}/approve`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setProperties((prev) => prev.filter((p) => p.id !== id));
                setApproveProperty(null);
                setActionMsg("You have successfully approved this property. The landlord has been notified.");
                setOpenApproveSuccess(true);
            } else {
                setError(data.message || "Failed to approve property.");
                setApproveProperty(null);
            }
        } catch {
            setError("No details found at the moment.");
            setApproveProperty(null);
        }
    };

    // ── Reject: POST /Properties/{id}/reject 
    // RejectModal passes the reason string to onConfirm
    const handleConfirmReject = async (reason: string) => {
        if (!rejectProperty) return;
        const id = rejectProperty.id;
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}/reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ reason }),
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setProperties((prev) => prev.filter((p) => p.id !== id));
                setRejectProperty(null);
                setActionMsg("You have successfully rejected this property. The landlord has been notified.");
                setOpenRejectSuccess(true);
            } else {
                setError(data.message || "Failed to reject property.");
                setRejectProperty(null);
            }
        } catch {
            setError("No details found at the moment.");
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
                            <th>Rent / yr</th>
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
                                    Loading pending properties…
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={8}>
                                    <div style={{
                                        backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                                        borderRadius: "8px", padding: "12px 16px",
                                        display: "flex", alignItems: "center", gap: "8px",
                                    }}>
                                        <span style={{ color: "#e53e3e", fontSize: "18px" }}>⚠</span>
                                        <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>{error}</p>
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
                                                onClick={() => setOpenActionId((p) => p === property.id ? null : property.id)}
                                            >
                                                ⋮
                                            </button>

                                            {openActionId === property.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => { setDetailsProperty(property); setOpenActionId(null); }}>
                                                        View Details
                                                    </button>
                                                    <button onClick={() => { setApproveProperty(property); setOpenActionId(null); }}>
                                                        Approve
                                                    </button>
                                                    <button onClick={() => { setRejectProperty(property); setOpenActionId(null); }}>
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


            {approveProperty && (
                <div className="modal_overlay" onClick={() => setApproveProperty(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <ApprovalModal
                            title="Approve Property"
                            approvalMessage={`Approve "${approveProperty.title}"? The landlord will be notified.`}
                            label="Approve"
                            labelAlt="Cancel"
                            onClose={() => setApproveProperty(null)}
                            onConfirm={handleConfirmApprove}
                            isOpen={!!approveProperty}
                        />
                    </div>
                </div>
            )}


            <RejectModal
                title="Reject Property"
                message={rejectProperty ? `Reject "${rejectProperty.title}"?` : ""}
                label="Reject"
                isOpen={!!rejectProperty}
                onClose={() => setRejectProperty(null)}
                onConfirm={handleConfirmReject}
            />


            <SuccessModal
                title="Property Approved"
                message={actionMsg}
                label="Done"
                path=""
                isOpen={openApproveSuccess}
                onClose={() => setOpenApproveSuccess(false)}
                onDone={() => setOpenApproveSuccess(false)}
            />

            <SuccessModal
                title="Property Rejected"
                message={actionMsg}
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