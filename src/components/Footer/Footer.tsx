import style from "./Footer.module.scss"
import footerSVG from "../../shared/svg/footerSVG.svg"
import { Container, Nav, Navbar } from "react-bootstrap"
import { facebookIcon, vkIcon, youtubeIcon } from "../../shared/svg/svgFiles"
import { useNavigate } from "react-router"

const Footer = () => {

const navigate = useNavigate()



  return (
    <div className={style.imageContainer}>
      <img alt="footer" src={footerSVG} className={style.image} />
      <Navbar className={style.footer}>
      <Container className={style.footerContainer}>
        <div className={style.footerHeader}>
          <div className={style.logoPart} onClick={() => navigate("/")}>
            <h5>Khachaturian Trio</h5>
          </div>
          <Nav className={style.menuPart}>
            <Nav.Link className={style.link} onClick={() => navigate("/concerts")}>Concerts</Nav.Link>
            <Nav.Link className={style.link} onClick={() => navigate("/about")}>About us</Nav.Link>
            <Nav.Link className={style.link} onClick={() => navigate("/media")}>Media</Nav.Link>
          </Nav>
          <div className={style.socialPart}>
                <Nav.Link>{facebookIcon}</Nav.Link>
                <Nav.Link>{youtubeIcon}</Nav.Link>
                <Nav.Link>{vkIcon}</Nav.Link>
          </div>
        </div>
        <div className={style.footerMidline}></div>
        <div className={style.footerFooter}>
          <p>© 2024 Khachaturian Trio</p>
        </div>
      </Container>
      </Navbar>
    </div>
  )
}

export default Footer
