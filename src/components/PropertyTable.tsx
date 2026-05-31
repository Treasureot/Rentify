import { useState, useEffect, useRef } from "react";
import "../Styles/Cards.css";
import { type Property } from "../pages/Landlord/LandlordProperty";
import PropertyDetails from "../components/PropertyDetails";

interface PropertyTableProps {
    properties: Property[];
    onDelete: (id: string) => void;
    onEdit: (property: Property) => void;
}

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const PropertyTable = ({ properties, onDelete, onEdit }: PropertyTableProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [allProperties, setAllProperties] = useState<Property[]>(properties);
    const [openActionId, setOpenActionId]   = useState<string | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading]         = useState(false);
    const [error, setError]                 = useState("");

    // Pagination state
    const [page, setPage]           = useState(1);
    const [pageSize]                = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage]     = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const actionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const setRef = (id: string) => (el: HTMLDivElement | null) => {
        if (el) actionRefs.current.set(id, el);
        else actionRefs.current.delete(id);
    };

    const toggleAction = (id: string) => {
        setOpenActionId((prev) => (prev === id ? null : id));
    };

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

    // Fetch paginated properties
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setError("");

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Properties?page=${page}&pageSize=${pageSize}`,
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
                    const { items, totalPages, totalCount, hasNextPage, hasPreviousPage } = response.data;
                    setAllProperties(items);
                    setTotalPages(totalPages);
                    setTotalCount(totalCount);
                    setHasNextPage(hasNextPage);
                    setHasPreviousPage(hasPreviousPage);
                } else {
                    setError(response.message || "Failed to load properties.");
                }

            } catch {
                setError("Network error. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [page, token]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Approved":         return "approved";
            case "Pending Approval": return "pending_approval";
            case "Pending":          return "pending";
            case "Rejected":         return "rejected";
            default:                 return "";
        }
    };

    const getOccupancyClass = (occupancy: string) => {
        switch (occupancy) {
            case "Occupied":  return "occupied";
            case "Vacant":    return "vacant";
            case "Available": return "occupied"; 
            default:          return "";
        }
    };

    return (
        <>
            <div className="table_group">
                <table className="property_table">
                    <thead>
                        <tr>
                            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Title</th>
                            <th>Location</th>
                            <th>Occupancy Status</th>
                            <th>Property Type</th>
                            <th>Rent Amount</th>
                            <th>Status</th>
                            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    Loading properties...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7}>
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
                        ) : allProperties.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    No properties yet. Click "Add New Property" to get started.
                                </td>
                            </tr>
                        ) : (
                            allProperties.map((property) => (
                                <tr key={property.id}>
                                    <td>{property.title}</td>
                                    <td>{property.location}</td>
                                    <td>
                                        <span className={`status ${getOccupancyClass(property.occupancyStatus)}`}>
                                            {property.occupancyStatus ?? "—"}
                                        </span>
                                    </td>
                                    <td>{property.propertyType ?? "—"}</td>
                                    <td>{formatCurrency(property.rentAmount)}</td>
                                    <td>
                                        <span className={`status ${getStatusClass(property.status)}`}>
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
                                                        onEdit(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        onDelete(property.id);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Delete
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

            {/* Pagination controls */}
            {!isLoading && !error && totalPages > 1 && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 4px",
                    fontSize: "14px",
                    color: "var(--bodytext)",
                }}>
                    <p>
                        Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} properties
                    </p>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={!hasPreviousPage}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: hasPreviousPage ? "var(--primary)" : "#f1f5f9",
                                color: hasPreviousPage ? "#fff" : "#94A3B8",
                                cursor: hasPreviousPage ? "pointer" : "not-allowed",
                            }}
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                    background: p === page ? "var(--primary)" : "#fff",
                                    color: p === page ? "#fff" : "var(--text-h)",
                                    cursor: "pointer",
                                    fontWeight: p === page ? 600 : 400,
                                }}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNextPage}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: hasNextPage ? "var(--primary)" : "#f1f5f9",
                                color: hasNextPage ? "#fff" : "#94A3B8",
                                cursor: hasNextPage ? "pointer" : "not-allowed",
                            }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {detailsProperty && (
                <div className="modal_overlay" onClick={() => setDetailsProperty(null)}>
                    <div className="property_details_modal" onClick={(e) => e.stopPropagation()}>
                        <PropertyDetails
                            id={detailsProperty.id}
                            onEdit={() => {
                                onEdit(detailsProperty);
                                setDetailsProperty(null);
                            }}
                            onDelete={(id) => {
                                onDelete(id);
                                setDetailsProperty(null);
                            }}
                            onClose={() => setDetailsProperty(null)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyTable;