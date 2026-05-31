import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TenantHeader from "../../components/TenantHeader";
import "../../Styles/Tenant.css";
import "../../Styles/Cards.css";



type VerifyStatus = "verifying" | "success" | "failed" | "cancelled";

const PaystackCallback = () => {
    const [searchParams]  = useSearchParams();
    const navigate        = useNavigate();
    const token           = localStorage.getItem("accessToken") || "";
    const firstName       = localStorage.getItem("firstName") || "";
    const lastName        = localStorage.getItem("lastName")  || "";

    const [status, setStatus]   = useState<VerifyStatus>("verifying");
    const [message, setMessage] = useState("");
    const [paymentData, setPaymentData] = useState<{
        amount?: number;
        paymentDate?: string;
        transactionReference?: string;
        paidByName?: string;
    } | null>(null);

    useEffect(() => {
        const referenceFromUrl   = searchParams.get("reference");
        const referenceFromStore = localStorage.getItem("paystack_reference");

        // Paystack sends `reference` in the URL on success; nothing on cancel
        const reference = referenceFromUrl || referenceFromStore;

        if (!reference) {
            setStatus("cancelled");
            setMessage("Payment was cancelled or no reference was found.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(
                    `https://propms-api.fly.dev/api/v1/Payments/paystack/verify?reference=${encodeURIComponent(reference)}`,
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
                    setStatus("success");
                    setMessage(data.message || "Your payment has been confirmed successfully.");
                    setPaymentData({
                        amount:               data.data?.amount,
                        paymentDate:          data.data?.paymentDate,
                        transactionReference: data.data?.transactionReference,
                        paidByName:           data.data?.paidByName,
                    });
                    // Clean up stored references
                    localStorage.removeItem("paystack_reference");
                    localStorage.removeItem("paystack_payment_id");
                    localStorage.removeItem("paystack_schedule_id");
                } else {
                    setStatus("failed");
                    setMessage(data.message || "Payment verification failed. Please contact support.");
                }
            } catch {
                setStatus("failed");
                setMessage("Network error during verification. Please check your connection.");
            }
        };

        verify();
    }, []);   // run once on mount

    const formatCurrency = (n: number) =>
        `₦${new Intl.NumberFormat("en-NG").format(n)}`;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-NG", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    return (
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader firstName={firstName} lastName={lastName} />
            </div>

            <div className="tenant_bottom">
                <div className="tenant_body_right" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>

                    <div className="paystack_callback_card">

                        {/* ── Verifying ── */}
                        {status === "verifying" && (
                            <div className="paystack_callback_body paystack_callback_body--verifying">
                                <div className="paystack_spinner_lg" />
                                <h2>Verifying Payment…</h2>
                                <p>Please wait while we confirm your transaction with Paystack.</p>
                            </div>
                        )}

                        {/* ── Success ── */}
                        {status === "success" && (
                            <div className="paystack_callback_body paystack_callback_body--success">
                                <div className="paystack_icon paystack_icon--success">✓</div>
                                <h2>Payment Successful!</h2>
                                <p>{message}</p>

                                {paymentData && (
                                    <div className="paystack_receipt">
                                        {paymentData.amount !== undefined && (
                                            <div className="paystack_receipt_row">
                                                <span>Amount Paid</span>
                                                <strong>{formatCurrency(paymentData.amount)}</strong>
                                            </div>
                                        )}
                                        {paymentData.transactionReference && (
                                            <div className="paystack_receipt_row">
                                                <span>Reference</span>
                                                <strong>{paymentData.transactionReference}</strong>
                                            </div>
                                        )}
                                        {paymentData.paymentDate && (
                                            <div className="paystack_receipt_row">
                                                <span>Date</span>
                                                <strong>{formatDate(paymentData.paymentDate)}</strong>
                                            </div>
                                        )}
                                        {paymentData.paidByName && (
                                            <div className="paystack_receipt_row">
                                                <span>Paid By</span>
                                                <strong>{paymentData.paidByName}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    className="paystack_callback_btn paystack_callback_btn--primary"
                                    onClick={() => navigate("/tenant-lease")}
                                >
                                    View My Leases
                                </button>
                            </div>
                        )}

                        {/* ── Failed ── */}
                        {status === "failed" && (
                            <div className="paystack_callback_body paystack_callback_body--failed">
                                <div className="paystack_icon paystack_icon--failed">✕</div>
                                <h2>Payment Verification Failed</h2>
                                <p>{message}</p>
                                <div className="paystack_callback_actions">
                                    <button
                                        className="paystack_callback_btn paystack_callback_btn--secondary"
                                        onClick={() => navigate("/tenant-lease")}
                                    >
                                        Go to My Leases
                                    </button>
                                    <button
                                        className="paystack_callback_btn paystack_callback_btn--primary"
                                        onClick={() => window.history.back()}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Cancelled ── */}
                        {status === "cancelled" && (
                            <div className="paystack_callback_body paystack_callback_body--cancelled">
                                <div className="paystack_icon paystack_icon--cancelled">—</div>
                                <h2>Payment Cancelled</h2>
                                <p>{message}</p>
                                <button
                                    className="paystack_callback_btn paystack_callback_btn--secondary"
                                    onClick={() => navigate("/tenant-lease")}
                                >
                                    Back to My Leases
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaystackCallback;