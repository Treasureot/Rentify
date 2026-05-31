import TopNav from '../components/TopNav'
import WebBanner from '../components/WebBanner'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import { useState } from "react";

const Contact = () => {
    const [fullName, setFullName]         = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [subject, setSubject]           = useState('');
    const [message, setMessage]           = useState('');
    const [isLoading, setIsLoading]       = useState(false);
    const [success, setSuccess]           = useState('');
    const [error, setError]               = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            console.log('Contact form submitted:', { fullName, emailAddress, subject, message });
            setSuccess('Your message has been sent. We will get back to you shortly.');
            setFullName('');
            setEmailAddress('');
            setSubject('');
            setMessage('');
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section>
                <TopNav />

                <div className="container">
                    <div className="browse_header">
                        <p style={{ color: '#33AF7F' }}>SEND US A MESSAGE</p>
                        <h2>Contact Us</h2>
                    </div>
                </div>
            </section>

            <section style={{ backgroundColor: '#F7F9FB', padding: '60px', marginTop: '24px' }}>
                <div className="container">
                    <div className="contact_content">
                        <div className="contact_body">
                            <form onSubmit={handleSubmit}>
                                <div className="contact_group">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        value={fullName}
                                        placeholder="Enter your full name"
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={emailAddress}
                                        placeholder="Enter your email address"
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Subject"
                                    type="text"
                                    value={subject}
                                    placeholder="Write a subject"
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />

                                <div className="input_group" style={{ marginBottom: 20 }}>
                                    <label>Message</label>
                                    <textarea
                                        placeholder="Write a message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            fontSize: '16px',
                                            minHeight: '120px',
                                            resize: 'vertical',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {error && (
                                    <p style={{ color: '#e53e3e', fontSize: '14px', marginBottom: '8px' }}>
                                        ⚠ {error}
                                    </p>
                                )}
                                {success && (
                                    <p style={{ color: 'var(--primary)', fontSize: '14px', marginBottom: '8px' }}>
                                        ✓ {success}
                                    </p>
                                )}

                                <Button
                                    label={isLoading ? "Sending..." : "Send Message"}
                                    type="submit"
                                    disabled={isLoading}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ marginTop: '0' }}>
                <WebBanner />
                <Footer />
            </section>
        </>
    );
}

export default Contact;