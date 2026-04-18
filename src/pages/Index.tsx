import '../Styles/App.css'
import '../Styles/index.css'
import TopNav from '../components/TopNav'
import Button from '../components/Button'
import ButtonAlt from '../components/ButtonAlt'
import PropertyCard from '../components/PropertyCard'
import WebBanner from '../components/WebBanner'
import Footer from '../components/Footer'
import heroBg from '../assets/images/hero-bg.png'
import iconLg from '../assets/images/icon-lg.png'
import aboutImg from '../assets/images/about-bg.png'
import cardImg from '../assets/images/card-1.png'
import paymentImg from '../assets/images/paymentImg.svg'
import { RiSearchLine, RiBuildingLine, RiArrowRightLine, RiShieldCheckLine, RiMessage2Line } from 'react-icons/ri'
import { MdCreditCard, MdOutlineSecurity } from 'react-icons/md'
import { FaRegMoneyBillAlt } from 'react-icons/fa'



function Index() {

  return (
    <>
      <section
        style={{
          backgroundImage: `url(${heroBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          marginTop: '0px'
            }}>

            <TopNav />

            <div className="container">
              <div className="hero_body">
                <div className="hero_body_left">
                  <h1>Find Your Next Home with <span style={{ color: 'var(--primary)' }}>Ease</span></h1>
                  <p>Browse verified properties, connect with landlords, and manage your rent—all in one place.</p>

                  <div className="hero_button">
                    <Button label='Browse Properties' />
                    <ButtonAlt label='List Your Property' />
                  </div>
                </div>

                <div className="hero_body_right">
                  <img src={iconLg} alt="icon" />
                </div>
              </div>
            </div>

        
      </section>

      <section>
        <div className="container">
          <div className="about">
            <h2><span style={{ color: 'var(--primary)' }}>Your primary home</span> might begin to feel left out</h2>

            <div className="about_body">
              <div className="about_body_left">
                <img src={aboutImg} alt="about" />
              </div>

              <div className="about_body_right">
                <div className="about_card">
                  <div className="about_icon">
                    <RiSearchLine size={24} />
                  </div>
                  <h3>Browse Verified Properties</h3>
                  <p>Explore thousands of verified rental listings across Nigeria.</p>
                </div>

                <div className="about_card">
                  <div className="about_icon">
                    <RiBuildingLine size={24}  />
                  </div>                  
                  
                  <h3>List & Manage</h3>
                  <p>Landlords can list properties and manage tenants effortlessly.</p>
                </div>

                <div className="about_card">
                  <div className="about_icon">
                    <MdCreditCard size={24}  />
                  </div> 

                  <h3>Pay Rent Online</h3>
                  <p>Secure, hassle-free rent payment from anywhere.</p>
                </div>

                <div className="about_card">
                  <div className="about_icon">
                    <MdOutlineSecurity size={24} />
                  </div> 

                  <h3>Trusted & Secure</h3>
                  <p>All properties verified. Your data stays safe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{backgroundColor: '#F7F9FB', paddingTop: '40px'}}>
        <div className="container">
        <div className="property_header">
            <div className="property_header_left">
                  <p style={{color: 'var(--primary)', fontSize: '14px', fontWeight: '600'}}>CURATION</p>
                  <h2>Featured Listing</h2>               
            </div>

            <div className="property_header_right">
              <a href="/property"><p>See All <RiArrowRightLine size={24}/></p></a>
            </div>
        </div>

          <div className="property_body">
              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />

              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />

              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />

              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />

              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />

              <PropertyCard 
                    image={cardImg}
                    price="₦1,200,000"
                    title="2-Bedroom Apartment in Lekki"
                    location="Lekki Phase 1, Lagos"
                    beds={2}
                    baths={2}
                    onViewDetails={() => console.log("View Details")}
                    onRentNow={() => console.log("Rent Now")}
                />                              
          </div>        
        </div>
      </section>

      <section>
        <div className="container">
          <div className="resource">
            <div className="resource_header">
              <h2>Reimagining the Trust Protocol</h2>
              <p>We remove the friction from property management, ensuring every 
                step of your journey is backed by verification and security.</p>
            </div>

            <div className="resource_body">
              <div className="resource_card_left">
                  <div className="verify_icon">
                  <RiShieldCheckLine size={24} />                    
                  </div>

                  <h3>Verified Listings</h3>
                  <p>Every property on our platform undergoes a rigorous multi-point verification 
                    process to ensure authenticity and peace of mind.
                  </p>

                  <a href="/property"><p>List Your Property <RiArrowRightLine size={24}/></p></a>
              </div>

              <div className="resource_card_right">
                <div className="comm-icon">
                  <RiMessage2Line size={24} />
                </div>
                  <h3>Direct Communication</h3>
                  <p>Connect directly with verified landlords and property managers 
                    without intermediary delays.
                  </p>
              </div>
            </div>

              <div className="resource_card_bottom">
                <div className="resource_payment_left">
                  <div className="payment-icon">
                     <FaRegMoneyBillAlt size={24} />                 
                  </div>
                  <h3>Secure Payments</h3>
                  <p>Our integrated payment gateway ensures your rent and security 
                    deposits are handled with bank-grade encryption and transparent tracking.
                  </p>                  
                </div>
                <div className="resource_payment_right">
                    <img src={paymentImg} alt="Payment Card" />
                </div>
              </div>            
          </div>
        </div>
      </section>

      <section>
        <WebBanner />
        <Footer />
      </section>
    </>
  )
}

export default Index;
