import { useState } from "react";
import React from 'react';
import '../Styles/App.css'
import LoginImg from '../components/LoginImg'
import Button from '../components/Button'
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                const { token, user } = response.data;

                localStorage.setItem('accessToken', token);
                localStorage.setItem('expiresAt', response.data.expiresAt);
                localStorage.setItem('firstName', user.firstName);
                localStorage.setItem('lastName', user.lastName);
                localStorage.setItem('email', user.email);
                localStorage.setItem('role', user.role);
                localStorage.setItem('userId', user.id);


                if (user.role === 'Landlord') {
                    navigate('/landlord');
                } else if (user.role === 'Tenant') {
                    navigate('/tenant');
                } else {
                    setError('Unrecognized role. Please contact support.');
                }

            } else {
                if (request.status === 401 || request.status === 400) {
                    setError(response.message || 'Incorrect email or password. Please try again.');
                } else if (request.status === 404) {
                    setError('Account not found. Please check your email or sign up.');
                } else {
                    setError(response.message || 'Login failed. Please try again.');
                }
            }

        } catch (err) {
            setError('No details found at the moment.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login_content">
            <div className="login_content_left">
                <LoginImg />
            </div>

            <div className="login_content_right">
                <form onSubmit={loginUser}>
                    <h2>Welcome Back</h2>
                    <p>Please enter your credentials to access your portal.</p>

                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        placeholder="Enter your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        placeholder="*********"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div style={{
                            backgroundColor: '#fff5f5',
                            border: '1px solid #feb2b2',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                            <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>
                                {error}
                            </p>
                        </div>
                    )}

                    <p style={{ color: 'var(--bodytext)', fontSize: '14px', textAlign: 'right' }}>
                        <a href="#">Forgot your password?</a>
                    </p>

                    <div className="login_content_bottom">
                        <Button
                            label={isLoading ? 'Signing in...' : 'Sign In'}
                            type="submit"
                            disabled={isLoading}
                        />
                        <p style={{ textAlign: 'center' }}>
                            Don't have an account? <a href="./sign-up">Sign Up</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;