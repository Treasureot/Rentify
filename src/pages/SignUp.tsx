import { useState } from "react";
import '../Styles/App.css'
import SignupImg from '../components/SignupImg'
import Button from '../components/Button'
import Input from '../components/Input'
import SuccessModal from '../components/SuccessModal'
import React from "react"

function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
 
const passwordCriteria = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
    { label: 'At least one special character (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
];

const allCriteriaMet = passwordCriteria.every(c => c.met);


const createUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

    if (!allCriteriaMet) {
        setError('Please meet all password requirements.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    setIsLoading(true);

    try {
        const request = await fetch(
            `https://propms-api.fly.dev/api/v1/Auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    role,
                    password,
                }),
            }
        );

        const response = await request.json();
        console.log(response, "response");

        if (request.ok) {
            setShowSuccessModal(true);
        } else {
            setError(response.message || 'Sign up failed. Please try again.');
        }

    } catch (error) {
        setError('Network error. Please check your connection.');
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="register_content">
            <div className="login_content_left">
                <SignupImg />
            </div>

            <div className="login_content_right">
                <form onSubmit={createUser}>  
                    <h2>Create an account</h2>  
                    <p>Experience the new standard in property management.</p>

                    <div className="input_body">
                        <Input
                            label="First Name"
                            type="text"
                            value={firstName}
                            placeholder="Enter your first name"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            value={lastName}
                            placeholder="Enter your last name"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        placeholder="Enter your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="input_body">
                        <Input
                            label="Phone Number"
                            type="tel"  
                            value={phoneNumber}
                            placeholder="e.g 090 *** ****"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <div className="input_group">
                            <label>Select Role:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select</option>
                                <option value="landlord">Landlord</option>
                                <option value="tenant">Tenant</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        placeholder="*******"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {password.length > 0 && (
                    <div className="password_criteria">
                      {passwordCriteria.map((criteria, index) => (
                        <p key={index} className={criteria.met ? 'criteria_met' : 'criteria_unmet'}>
                          {criteria.met ? '✓' : '✗'} {criteria.label}
                        </p>
                    ))}
                    </div>
                    )}

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        placeholder="*******"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {confirmPassword.length > 0 && password !== confirmPassword && (
                        <p style={{ color: 'red', fontSize: '13px', marginTop: '-16px' }}>
                        !Passwords do not match
                    </p>
                    )}

                    {error && (
                      <p style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
                          {error}
                      </p>
                    )}

                    <Button 
                    label={isLoading ? "Creating Account..." : "Create Account"} 
                    type="submit"
                    disabled={isLoading} 
                    />  

                    <p style={{ textAlign: 'center' }}>
                        Already have an account? <a href="/tenant-login">Login</a>
                    </p>
                </form>
            </div>

            <SuccessModal
             title="Sign Up Successful"
             message="Your account has been created successfully. Login to access your dashboard"
             path="/landlord-login"
             label="Go to Login"
             onClose={() => setShowSuccessModal(false)}
             isOpen={showSuccessModal}
            />
        </div>
    );
}

export default SignUp;