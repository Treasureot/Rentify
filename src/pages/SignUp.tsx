import { useState } from "react";
import '../Styles/App.css'
import SignupImg from '../components/SignupImg'
import Button from '../components/Button'
import Input from '../components/Input'



function SignUp() {
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [emailAddress, setemailAddress] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setpassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');


    const handleOnClick = () => {
        console.log('firstName: ', firstName);
        console.log('lastName: ', lastName);
        console.log('emailAddress: ', emailAddress);
        console.log('phoneNumber: ', phoneNumber);
        console.log('role: ', role);
        console.log('password: ', password);
        console.log('confirmPassword: ', confirmPassword);
    };

  return (
    <>
      <div>
        <div className="register_content">
          <div className="login_content_left">
              <SignupImg />
          </div>

          <div className="login_content_right">
          <form>
            <h2>Create an acccount</h2>
            <p>Experience the new standard in property management.</p>

            <div className="input_body">
                    <Input 
                      label="First Name"
                      type="text"
                      value={firstName}
                      placeholder="Enter your first name"
                      onChange={(e) => setfirstName(e.target.value)}
                      required
                    />

                    <Input 
                      label="Last Name"
                      type="text"
                      value={lastName}
                      placeholder="Enter your last name"
                      onChange={(e) => setlastName(e.target.value)}
                      required
                    />                    
            </div>
       
                    <Input 
                      label="Email Address"
                      type="email"
                      value={emailAddress}
                      placeholder="Enter your email address"
                      onChange={(e) => setemailAddress(e.target.value)}
                      required
                    />

            <div className="input_body">
                    <Input 
                      label="Phone Number"
                      type="number"
                      value={phoneNumber}
                      placeholder="e.g 090 *** ****"
                      onChange={(e) => setphoneNumber(e.target.value)}
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
                      onChange={(e) => setpassword(e.target.value)}
                    />

                    <Input 
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      placeholder="*******"
                      onChange={(e) => setconfirmPassword(e.target.value)}
                    />                    

            <Button label="Create Account" onclick={handleOnClick} />

            <p style={{textAlign: 'center'}}>Already have an account? <a href="/tenant-login">Login</a></p>

            
          </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp;
