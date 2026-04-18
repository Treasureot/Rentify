import '../Styles/Landlord.css';
import LandlordSidebar from '../components/LandlordSidebar';
import DashboardHeader from '../components/DashboardHeader';
import RevenueCard from '../components/RevenueCard';
import DefaultCard from '../components/DefaultCard';
import OccupancyCard from '../components/OccupancyCard';
import ManagementCard from '../components/ManagementCard'
import Activity from '../components/Activity'
import { FaArrowRight } from "react-icons/fa";

const Landlord = () => {
    return (
        <>
        <div className="landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader 
                    firstName='Tunde'
                    lastName='Omoniyi'
                     />
                </div>

                <div className="landlord_body">
                    <div className="landlord_metrics">
                        <div className="revenue_metrics">
                            <RevenueCard 
                            label='TOTAL REVENUE'
                            TotalRevenue= {4500000}
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard 
                            label= 'TOTAL PROPERTIES'
                            TotalValue= {8}
                            bgColor='#F0FFF7'
                            colorText='var(--primary)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard 
                            label= 'OVERDUE PAYMENTS'
                            TotalValue= {2}
                            bgColor='#F9F3F4'
                            colorText='#BA1A1A'
                            />
                        </div>

                        <div className="default_metrics">
                            <OccupancyCard
                            label= 'OCCUPANCY STATUS'
                            occupied={5}
                            vacant={3}
                            bgColor='#F2F4F6'
                            colorText='var(--text-h)'
                            />
                        </div> 

                        <div className="default_metrics">
                            <ManagementCard 
                            label='MANAGEMENT TOOLS'
                            bgColor='#F2F4F6'
                            colorText='var(--text-h)'
                            leaseNumber={3}
                            />
                        </div>
                        
                        <div className="default_metrics">
                            <div className="insight_card">
                                <h3>View Analytics Insights</h3>
                                <div className="insight_icon">
                                    <a href="/insight"><FaArrowRight /></a>
                                </div>
                            </div>
                        </div>                                                                            
                    </div>

                    <div className="recent_activities">
                        <div className="activities_header">
                            <h3>Recent Activity</h3>
                            <a href="">View all history</a>
                        </div>

                        <div className="activity_body">
                            <Activity 
                            title='Payment received from John Doe'
                            time='2 hours ago'
                            description='Transaction for Penthouse B, Rentify Towers completed successfully'
                            amount={450000}
                            />
                        </div>

                        <div className="activity_body">
                            <Activity 
                            title='New Tenant Assigned'
                            time='Yesterday'
                            description='Sarah Jenkins has been verified and assigned to Unit 402, Lekki Heights.'
                            />
                        </div>

                        <div className="activity_body">
                            <Activity 
                            title='Maintenance Request: Plumbing'
                            time='Oct 12'
                            description='Unit 105 reported a leak in the master bathroom. Urgent attention required.'
                            />
                        </div>                                                   
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Landlord;