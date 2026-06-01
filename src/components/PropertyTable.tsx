import { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/cards.css";
import { type Property } from "../pages/Landlord/LandlordProperty";
import PropertyDetails from "../components/PropertyDetails";

interface PropertyTableProps {
    onDelete: (id: string) => void;
    onEdit: (property: Property) => void;
    /** Called after add/edit */
    onRefresh?: () => void;
}

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const PropertyTable = ({ onDelete, onEdit, onRefresh }: PropertyTableProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [openActionId, setOpenActionId]   = useState<string | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading]         = useState(true);
    const [error, setError]                 = useState("");

    // Pagination
    const [page, setPage]                 = useState(1);
    const pageSize                        = 10;
    const [totalPages, setTotalPages]     = useState(1);
    const [totalCount, setTotalCount]     = useState(0);
    const [hasNextPage, setHasNextPage]   = useState(false);
    const [hasPrevPage, setHasPrevPage]   = useState(false);

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

    // ── Fetch landlord's own properties (paginated) 
    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/my-properties?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();

            if (res.ok && data.success) {
                // API may return a plain array OR a paginated object
                if (Array.isArray(data.data)) {
                    setAllProperties(data.data);
                    setTotalPages(1);
                    setTotalCount(data.data.length);
                    setHasNextPage(false);
                    setHasPrevPage(false);
                } else {
                    const { items, totalPages: tp, totalCount: tc, hasNextPage: hn, hasPreviousPage: hp } = data.data;
                    setAllProperties(items ?? []);
                    setTotalPages(tp ?? 1);
                    setTotalCount(tc ?? 0);
                    setHasNextPage(hn ?? false);
                    setHasPrevPage(hp ?? false);
                }
            } else {
                setError(data.message || "Failed to load properties.");
            }
        } catch {
            setError("No details found at the moment.");
        } finally {
            setIsLoading(false);
        }
    }, [page, token]);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    // ── Status / occupancy 
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
            case "Occupied":
            case "Available": return "occupied";
            case "Vacant":    return "vacant";
            default:          return "";
        }
    };

    // ── After set-primary: refresh the property row 
    const handlePrimarySet = (propertyId: string, newPrimaryUrl: string) => {
        setAllProperties((prev) =>
            prev.map((p) =>
                p.id === propertyId ? { ...p, primaryImageUrl: newPrimaryUrl } : p
            )
        );
    };

    return (
        <>
            <div className="table_group">
                <table className="property_table">
                    <thead>
                        <tr>
                            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Title</th>
                            <th>Location</th>
                            <th>Occupancy</th>
                            <th>Type</th>
                            <th>Rent / yr</th>
                            <th>Status</th>
                            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    Loading properties…
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7}>
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
                                                onClick={() => setOpenActionId((p) => p === property.id ? null : property.id)}
                                            >
                                                ⋮
                                            </button>

                                            {openActionId === property.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => { setDetailsProperty(property); setOpenActionId(null); }}>
                                                        View Details
                                                    </button>
                                                    <button onClick={() => { onEdit(property); setOpenActionId(null); }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => { onDelete(property.id); setOpenActionId(null); }}>
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

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 4px", fontSize: "14px", color: "var(--bodytext)",
                }}>
                    <p>
                        Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} properties
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={!hasPrevPage}
                            style={{
                                padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0",
                                background: hasPrevPage ? "var(--primary)" : "#f1f5f9",
                                color: hasPrevPage ? "#fff" : "#94A3B8",
                                cursor: hasPrevPage ? "pointer" : "not-allowed",
                            }}
                        >← Prev</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0",
                                background: p === page ? "var(--primary)" : "#fff",
                                color: p === page ? "#fff" : "var(--text-h)",
                                cursor: "pointer", fontWeight: p === page ? 600 : 400,
                            }}>{p}</button>
                        ))}

                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNextPage}
                            style={{
                                padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0",
                                background: hasNextPage ? "var(--primary)" : "#f1f5f9",
                                color: hasNextPage ? "#fff" : "#94A3B8",
                                cursor: hasNextPage ? "pointer" : "not-allowed",
                            }}
                        >Next →</button>
                    </div>
                </div>
            )}


            {detailsProperty && (
                <div className="modal_overlay" onClick={() => setDetailsProperty(null)}>
                    <div className="property_details_modal" onClick={(e) => e.stopPropagation()}>
                        <PropertyDetails
                            id={detailsProperty.id}
                            onEdit={() => { onEdit(detailsProperty); setDetailsProperty(null); }}
                            onDelete={(id) => { onDelete(id); setDetailsProperty(null); }}
                            onPrimarySet={handlePrimarySet}
                            onClose={() => setDetailsProperty(null)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyTable;