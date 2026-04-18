import TopNav from '../components/TopNav'
import WebBanner from '../components/WebBanner'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import { useState } from "react";


const Property = () => {

    const [fullName, setfullName] = useState('');
    const [emailAddress, setemailAddress] = useState('');
    const [subject, setsubject] = useState('');
    const [message, setmessage] = useState('');

    const handleOnClick = () => {
        console.log('fullName: ', fullName);
        console.log('emailAddress: ', emailAddress);
        console.log('subject: ', subject);
        console.log('message: ', message);        
    };

    return (
        <>
        <section>
            <TopNav />

            <div className="container">
                <div className="browse_header">
                    <p style={{color: '#33AF7F'}}>SEND US A MESSAGE</p>
                    <h2>Contact Us</h2>
                </div>
            </div>
        </section>


       <section style={{backgroundColor: '#F7F9FB', padding: '60px', marginTop: '24px'}}>
        <div className="container">
            <div className="contact_content">
            <div className="contact_body">
            <div className="contact_group">
            <Input 
                label="Full Name"
                type="text"
                value={fullName}
                placeholder="Enter your full name"
                onChange={(e) => setfullName(e.target.value)}
                required
            />

            <Input 
                label="Email Address"
                type="email"
                value={emailAddress}
                placeholder="Enter your email address"
                onChange={(e) => setemailAddress(e.target.value)}
                required
            />        
            </div>

            <Input 
                label="Subject"
                type="text"
                value={subject}
                placeholder="Write a subject"
                onChange={(e) => setsubject(e.target.value)}
                required
            />

        <div className="contact_message">
             <Input
                label="Message"
                type="freeArea"
                value={message}
                placeholder="Write a message"
                onChange={(e) => setmessage(e.target.value)}
                required
            />        
        </div>

            
            <Button label="Send Message" onclick={handleOnClick} />                       
          </div>      
            </div>  
        </div>
      </section>

      <section style={{marginTop: '0'}}>
        <WebBanner />
        <Footer />
      </section>           
        </>
    );
}

export default Property;