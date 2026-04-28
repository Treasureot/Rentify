import { useState } from "react";
import React from 'react';
import '../../Styles/App.css'
import LoginImg from '../../components/LoginImg'
import Button from '../../components/Button'
import { RiArrowRightLine } from 'react-icons/ri'
import Input from "../../components/Input";



function TenantLogin() {
    const [emailAddress, setemailAddress] = useState('');
    const [password, setpassword] = useState('');


    const handleLogin = () => {
        console.log('emailAddress: ', emailAddress);
        console.log('password: ', password);
    };

  return (
    <>
      <div>
        <div className="login_content">
          <div className="login_content_left">
              <LoginImg />
          </div>

          <div className="login_content_right">
          <form>
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access your portal.</p>
            <p style={{marginTop: '12px'}}>Login as a <a href="/landlord-login">Landlord <RiArrowRightLine size={24}/></a></p>

            <Input 
            label="Email Address"
            type="email"
            value={emailAddress}
            placeholder="Enter your email Address"
            onChange={(e) => setemailAddress(e.target.value)}
            />

            <Input 
            label="Password"
            type="password"
            value={password}
            placeholder="*********"
            onChange={(e) => setpassword(e.target.value)}
            />            

            <p style={{ color: 'var(--bodytext)', fontSize: '14px', textAlign: 'right' }}>
              <a href="#">Forgot your password?</a>
            </p>

            <Button label="Sign In" onClick={handleLogin} />

            <p style={{textAlign: 'center'}}>Don't have an account? <a href="./sign-up">Sign Up</a></p>

            
          </form>



          </div>
        </div>
      </div>








    </>
  )
}

export default TenantLogin;
