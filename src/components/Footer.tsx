import iconLogo from '../assets/images/rentify-logo.png'
import { NavLink } from "react-router-dom";

const Footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="container">
                        <nav className="top_nav">
                        <div className="nav_body">
                            <div className="footer_body">
                                <a href="/"><img src={iconLogo} alt="Rentify Logo" /></a>
                                <p>© 2024 The Digital Curator. All rights reserved.</p>
                            </div>

                            <ul>
                                <li>
                                <NavLink to="/property" >
                                    Browse Property
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/contact" >
                                    Contact Us
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/" >
                                    Privacy Policy
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/" >
                                    Terms of Service
                                </NavLink>
                            </li>                            
                            </ul>
                        </div>
                        </nav>
                
            </div>
        </footer>
        </>
    );
}

export default Footer;