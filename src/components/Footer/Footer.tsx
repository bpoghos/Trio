import style from "./Footer.module.scss"
import footerSVG from "../../shared/svg/footerSVG.svg"
import { Container, Nav, Navbar } from "react-bootstrap"
import { facebookIcon, vkIcon, youtubeIcon } from "../../shared/svg/svgFiles"
import { useNavigate } from "react-router"
import { FooterContent } from "../../shared/enum/enum"

const Footer = () => {

  const navigate = useNavigate()



  return (
    <div className={style.imageContainer}>
      <img alt="footer" src={footerSVG} className={style.image} />
      <Navbar className={style.footer}>
        <Container className={style.footerContainer}>
          <div className={style.footerHeader}>
            <div className={style.logoPart} >
              <h5 onClick={() => navigate("/")}>Khachaturian Trio</h5>
              <div className={style.websiteByContainer}>
                <span className={style.websiteBy}>{FooterContent.WebsiteBy}</span>
                <Nav.Link
                  className={style.skillsUp}
                  href="https://www.skillsup.tech/"
                  target="_blank"
                  rel="noopener noreferrer">{FooterContent.SkillsUp}</Nav.Link>
              </div>
            </div>
            <Nav className={style.menuPart}>
              <Nav.Link className={style.link} onClick={() => navigate("/concerts")}>Concerts</Nav.Link>
              <Nav.Link className={style.link} onClick={() => navigate("/about")}>About us</Nav.Link>
              <Nav.Link className={style.link} onClick={() => navigate("/media")}>Media</Nav.Link>
            </Nav>
            <div className={style.socialPart}>
              <Nav.Link href="https://www.facebook.com/khachaturiantrio" target="_blank" rel="noopener noreferrer">{facebookIcon}</Nav.Link>
              <Nav.Link href='https://www.youtube.com/@khachaturyantrio' target="_blank" rel="noopener noreferrer">{youtubeIcon}</Nav.Link>
              <Nav.Link href="https://vk.com/khachaturiantrio" target="_blank" rel="noopener noreferrer">{vkIcon}</Nav.Link>
            </div>
          </div>
          <div className={style.footerMidline}></div>
          <div className={style.footerFooter}>
            <p>{FooterContent.Copyright}</p>
          </div>
        </Container>
      </Navbar>
    </div>
  )
}

export default Footer
