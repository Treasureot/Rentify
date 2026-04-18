import TopNav from '../components/TopNav'
import WebBanner from '../components/WebBanner'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import cardImg from '../assets/images/card-1.png'


const Property = () => {
    return (
        <>
        <section>
            <TopNav />

            <div className="container">
                <div className="browse_header">
                    <p style={{color: '#33AF7F'}}>CURATION</p>
                    <h2>Browse Properties</h2>
                </div>
            </div>
        </section>


       <section style={{backgroundColor: '#F7F9FB', paddingTop: '40px', marginTop: '24px'}}>
        <div className="container">
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

      <section style={{marginTop: '0'}}>
        <WebBanner />
        <Footer />
      </section>           
        </>
    );
}

export default Property;