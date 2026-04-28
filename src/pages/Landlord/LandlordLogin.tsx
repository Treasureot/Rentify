import { useState } from "react";
import React from 'react';
import '../../Styles/App.css'
import LoginImg from '../../components/LoginImg'
import Button from '../../components/Button'
import { RiArrowRightLine } from 'react-icons/ri'
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";

function LandlordLogin() {
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
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const response = await request.json();
        console.log(response, "response");

        if (request.ok) {
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          window.location.href = '/landlord';

        if (response.token) {
            localStorage.setItem('accessToken', response.token);
          }
        if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          navigate('/landlord');   

        } else {
            if (request.status === 401) {
                setError('Incorrect email or password. Please try again.');
            } else if (request.status === 404) {
                setError('Account not found. Please check your email or sign up.');
            } else if (request.status === 400) {
                setError(response.message || response.errors || 'Invalid credentials. Please try again.');
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        }
          
      

    } catch (error) {
        setError('Network error. Please check your connection.');
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
          <p style={{ marginTop: '12px' }}>
            Login as a <a href="/tenant-login">Tenant <RiArrowRightLine size={24} /></a>
          </p>

          <Input
            label="Email Address"
            type="email"
            value={email}
            placeholder="Enter your email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            placeholder="*********"
            onChange={(e) => setPassword(e.target.value)}
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
            <p style={{ textAlign: 'center' }}>Don't have an account? <a href="./sign-up">Sign Up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandlordLogin;