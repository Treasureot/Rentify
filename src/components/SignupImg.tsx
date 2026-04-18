import '../Styles/App.css'
import iconLogo from '../assets/images/rentify-logoWhite.svg'
import iconLg from '../assets/images/icon-lg.png'

const LoginImg = () => {
    return (
        <>
        <div>
            <div className="register_sidebar">
              <div className="login_body">
                 <a href="/"><img src={iconLogo} alt="Rentify" /></a>

                <div className="login_left_body">
                  <img src={iconLg} alt="rentify icon" />
                  <h2>Your Portal to Curated Living</h2>
                  <p>Join a community of sophisticated property managers and residents 
                    who value architectural integrity and digital clarity.</p>
                </div>
              </div>
        </div>
      </div>
        </>
    );
}

export default LoginImg