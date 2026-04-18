import Button from '../components/Button'


const WebBanner = () => {
    return (
        <>
        <div className='web_banner'>
            <div className="web_overlay">
              <div className="web_banner_content">
                <h2>Ready to Make Your Dream Home a Reality?</h2>
                <p>Explore a curated selection of homes that align with your vision and goals</p>
                <a href="/sign-up"><Button label='Get Started'/></a>
            </div>
            </div>
        </div>
        </>
    );
}

export default WebBanner;