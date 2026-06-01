import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar";
import PropertyCard from "../../components/PropertyCard";
import "../../Styles/Tenant.css";

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

type PropertyItem = {
    id: string;
    title: string;
    description: string;
    location: string;
    address: string;
    rentAmount: number;
    propertyType: string;
    status: string;
    occupancyStatus: string;
    rejectionReason: string | null;
    primaryImageUrl: string;
    createdDate: string;
    landlord: PropertyLandlord;
    images: PropertyImage[];
};

const PAGE_SIZE = 10;

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;


const parseDetail = (description: string, key: string): number => {
    const match = description?.match(new RegExp(`${key}:(\\d+)`));
    return match ? parseInt(match[1]) : 0;
};

const Tenant = () => {
    const navigate  = useNavigate();
    const token     = localStorage.getItem("accessToken") || "";
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    const [properties, setProperties]   = useState<PropertyItem[]>([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages]   = useState(1);
    const [totalCount, setTotalCount]   = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setError("");

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Properties?page=${currentPage}&pageSize=${PAGE_SIZE}`,
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
                    setProperties(items);
                    setTotalPages(totalPages);
                    setTotalCount(totalCount);
                    setHasNextPage(hasNextPage);
                    setHasPreviousPage(hasPreviousPage);
                } else {
                    setError(response.message || "Failed to load properties.");
                }

            } catch {
                setError("No details found at the moment.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [currentPage, token]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
    const endIndex   = Math.min(currentPage * PAGE_SIZE, totalCount);

    return (
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader firstName={firstName} lastName={lastName} />
            </div>

            <div className="tenant_bottom">
                <div className="tenant_sidebar">
                    <TenantSidebar />
                </div>

                <div className="tenant_body_right">
                    <div className="tenant_header">
                        <h2>Find Your Next Home</h2>
                        <p>Browse verified apartments, duplexes, and self-contained units across your preferred locations.</p>
                    </div>

                    <div className="tenant_body_listings">
                        {isLoading ? (
                            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                Loading properties...
                            </p>
                        ) : error ? (
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
                        ) : properties.length === 0 ? (
                            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                No properties available.
                            </p>
                        ) : (
                            <>
                                <div className="tenant_property">
                                    {properties.map((property) => (
                                        <PropertyCard
                                            key={property.id}
                                            image={property.primaryImageUrl || "/default-property.png"}
                                            price={formatCurrency(property.rentAmount)}
                                            title={property.title}
                                            location={property.location}
                                            beds={parseDetail(property.description, "Beds")}
                                            baths={parseDetail(property.description, "Baths")}
                                            onViewDetails={() => navigate(`/tenant/property/${property.id}`)}
                                            onRentNow={() => navigate(`/tenant/property/${property.id}`)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="tenant__pagination">
                                        <span className="tenant__pagination-info">
                                            Showing {startIndex}–{endIndex} of {totalCount} properties
                                        </span>

                                        <div className="tenant__pagination-controls">
                                            <button
                                                className="tenant__pagination-btn tenant__pagination-btn--nav"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={!hasPreviousPage}
                                                aria-label="Previous page"
                                            >
                                                &#8249;
                                            </button>

                                            {getPageNumbers().map((page, index) =>
                                                page === "..." ? (
                                                    <span key={`ellipsis-${index}`} className="tenant__pagination-ellipsis">…</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        className={`tenant__pagination-btn ${currentPage === page ? "tenant__pagination-btn--active" : ""}`}
                                                        onClick={() => handlePageChange(page as number)}
                                                        aria-label={`Page ${page}`}
                                                        aria-current={currentPage === page ? "page" : undefined}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            )}

                                            <button
                                                className="tenant__pagination-btn tenant__pagination-btn--nav"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={!hasNextPage}
                                                aria-label="Next page"
                                            >
                                                &#8250;
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenant;