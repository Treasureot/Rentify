import { useState, useEffect } from "react";
import { IoCheckmarkDone, IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import "../Styles/Cards.css";

type NotificationType =
    | "LeaseRequestSubmitted"
    | "LeaseRequestApproved"
    | "LeaseRequestRejected"
    | "PaymentSubmitted"
    | "PaymentConfirmed"
    | "PaymentRejected"
    | "PaymentAutoConfirmed"
    | "PropertyApproved"
    | "PropertyRejected"
    | "RentDueSoon"
    | "RentReminder"
    | string;

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdDate: string;
    readAt?: string;
    recipientId?: string;
}

interface NotificationsPageProps {
    role?: "admin" | "landlord" | "tenant";
}

const typeConfig: Record<string, { accent: string }> = {
    LeaseRequestSubmitted: { accent: "#6366f1" },
    LeaseRequestApproved:  { accent: "#22c55e" },
    LeaseRequestRejected:  { accent: "#d92d20" },
    PaymentSubmitted:      { accent: "#f59e0b" },
    PaymentConfirmed:      { accent: "#22c55e" },
    PaymentRejected:       { accent: "#d92d20" },
    PaymentAutoConfirmed:  { accent: "#2563eb" },
    PropertyApproved:      { accent: "#22c55e" },
    PropertyRejected:      { accent: "#d92d20" },
    RentDueSoon:           { accent: "#f59e0b" },
    RentReminder:          { accent: "#f59e0b" },
};

const defaultAccent = "#94A3B8";

const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now  = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60)     return "Just now";
    if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const NotificationsPage = ({ role }: NotificationsPageProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [filter, setFilter]               = useState<"all" | "unread">("all");
    const [isLoading, setIsLoading]         = useState(true);
    const [error, setError]                 = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            setError("");

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Notifications`,
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
                    setNotifications(response.data);
                } else {
                    setError(response.message || "Failed to load notifications.");
                }

            } catch {
                setError("No notification found.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [token]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(
                `https://propms-api.fly.dev/api/v1/Notifications/${id}/read`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
        } catch {
            // silent
        }

        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllRead = async () => {
        try {
            await fetch(
                `https://propms-api.fly.dev/api/v1/Notifications/read-all`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
        } catch {
            // silent
        }

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const displayed = filter === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications;

    return (
        <div className="notif_page">
            <div className="notif_header">
                <div className="notif_header_left">
                    <div>
                        <h2>Notifications</h2>
                        <p>{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button className="notif_mark_all" onClick={markAllRead}>
                        <MdOutlineMarkEmailRead size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notif_tabs">
                <button
                    className={`notif_tab ${filter === "all" ? "notif_tab--active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All
                    <span className="notif_tab_count">{notifications.length}</span>
                </button>
                <button
                    className={`notif_tab ${filter === "unread" ? "notif_tab--active" : ""}`}
                    onClick={() => setFilter("unread")}
                >
                    Unread
                    <span className="notif_tab_count notif_tab_count--unread">{unreadCount}</span>
                </button>
            </div>

            <div className="notif_list">
                {isLoading ? (
                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                        Loading notifications...
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
                ) : displayed.length === 0 ? (
                    <div className="notif_empty">
                        <IoNotificationsOutline size={40} />
                        <p>No {filter === "unread" ? "unread " : ""}notifications</p>
                    </div>
                ) : (
                    displayed.map((notif) => {
                        const accent = (typeConfig[notif.type]?.accent) ?? defaultAccent;
                        return (
                            <div
                                key={notif.id}
                                className={`notif_item ${!notif.isRead ? "notif_item--unread" : ""}`}
                                style={{ "--notif-accent": accent } as React.CSSProperties}
                            >
                                {!notif.isRead && <span className="notif_dot" />}

                                <div className="notif_content">
                                    <div className="notif_content_top">
                                        <p className="notif_title">{notif.title}</p>
                                        <span className="notif_time">{formatDate(notif.createdDate)}</span>
                                    </div>
                                    <p className="notif_message">{notif.message}</p>
                                </div>

                                {!notif.isRead && (
                                    <button
                                        className="notif_read_btn"
                                        onClick={() => markAsRead(notif.id)}
                                        aria-label="Mark as read"
                                        title="Mark as read"
                                    >
                                        <IoCheckmarkDone size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;