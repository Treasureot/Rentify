import iconLogo from '../assets/images/rentify-logo.png'
import { NavLink } from "react-router-dom";

const TopNav = () => {
    return (
        <>
            <section id="headerNav">
                <div className="container">
                    <div className="top-nav">
                        <nav className="top_nav">
                        <div className="nav_body">
                            <a href="/"><img src={iconLogo} alt="Rentify Logo" /></a>
                            <ul>
                                <li>
                                <NavLink 
                                    to="/property" 
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    Browse Property
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/contact" 
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    Contact Us
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/tenant-login" 
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    Login
                                </NavLink>
                            </li>

                            <li>
                                <NavLink 
                                    to="/sign-up" 
                                    id="getStarted"
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    Get Started
                                </NavLink>
                            </li>
                            </ul>
                        </div>
                        </nav>

                    </div>
                </div>
            </section>
        </>
    );
}

export default TopNav;
