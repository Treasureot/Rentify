import '../Styles/App.css'
import iconLogo from '../assets/images/rentify-logoWhite.svg'
import iconLg from '../assets/images/icon-lg.png'

const LoginImg = () => {
    return (
        <>
        <div>
            <div className="login_sidebar">
              <div className="login_body">
                 <a href="/"><img src={iconLogo} alt="Rentify" /></a>

                <div className="login_left_body">
                  <img src={iconLg} alt="rentify icon" />
                  <h2>Redefining the art of property management</h2>
                  <p>Join the ecosystem of elite landlords and residents</p>
                </div>
              </div>
        </div>
      </div>
        </>
    );
}

export default LoginImg;