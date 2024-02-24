import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <div className="containerFooter">
        <div className="containerInf">
          <p>Iglesia Bíblica Sublime Gracia</p>
          <p>Barrio San Antonio</p>
          <p>Cra. 15B - Calle 30</p>
          <p>Soledad, Atlántico</p>
      </div>
      <div className="containerSocial">
        <Link to={"https://www.facebook.com/IBSGSoledadAtlantico"}><FontAwesomeIcon icon={faSquareFacebook} className="iconFacebook"/></Link>
        <Link to={"https://www.youtube.com/@iglesiacristianasublimegra1100/videos"}><FontAwesomeIcon icon={faYoutube}  className="iconFacebook"/></Link>
        
      </div>
    </div>
  )
}

export default Footer