import { Button, Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { useState } from "react";
import logo from "../../assets/icon.png";
import style from "./Header.module.scss";
import { burgerMenuIcon } from "../../shared/svg/svgFiles";
import { useLocation, useNavigate } from "react-router-dom"; // Updated import
import { useAuth } from "../../configs/adminConfigs/AuthContext"; // Import Auth context
import EventFormModal from "../../pages/Admin/components/Modal/Modal";

const Header = () => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLogin } = useAuth(); // Get global state updater

  const handleToggle = (isOpen: boolean) => {
    setIsCollapseOpen(isOpen);
  };

  // Define routes where header should have position: relative
  const relativePaths = ["/concerts", "/about", "/media"];
  const isRelativeHeader = relativePaths.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/trio-admin"); // Ensure correct path check

  const handleLogout = () => {
    setIsLogin(false); // Update global state to logged out
    navigate("/trio-admin-login"); // Navigate to the login page
  };





  return (
    <>
      {isAdminPage ? (
        <Navbar className={style.adminHeader} variant="dark" bg="dark">
          <Container className={style.adminHeaderContainer}>
            <NavbarBrand className={style.adminBrand}>
              <img alt="logo" src={logo} className={style.logo} />
            </NavbarBrand>
            <Nav>
              <Button className={`${style.addButton} ${style.adminButtons}`} variant="success" onClick={() => setShowModal(true)}>Add</Button>
              <Button className={style.adminButtons} variant="outline-light" onClick={() => navigate("/")}>go to website</Button>
              <Button className={`${style.logOutButton} ${style.adminButtons}`} variant="outline-secondary" onClick={handleLogout}>Log out</Button>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <Navbar
          className={`${style.header} ${isCollapseOpen ? style.active : ""} ${isRelativeHeader ? style.relativeHeader : ""}`}
          expand="lg"
          expanded={isCollapseOpen}
          onToggle={handleToggle}
        >
          <Container className={style.headerContainer}>
            <NavbarBrand className={style.navBrand} onClick={() => navigate("/")}>
              <img alt="logo" src={logo} className={style.logo} />
            </NavbarBrand>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className={`${style.navToggle} ${isCollapseOpen ? style.activeToggler : ""}`}
            >
              {burgerMenuIcon}
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav" className={`${style.coll} ${isCollapseOpen ? style.active : ""}`}>
              <Nav className={style.menuBodyContainer}>
                <Nav.Link className={style.navLink} onClick={() => { navigate("/"); setIsCollapseOpen(false); }}>Home</Nav.Link>
                <Nav.Link className={style.navLink} onClick={() => { navigate("/concerts"); setIsCollapseOpen(false); }}>Concerts</Nav.Link>
                <Nav.Link className={style.navLink} onClick={() => { navigate("/about"); setIsCollapseOpen(false); }}>About Us</Nav.Link>
                <Nav.Link className={style.navLink} onClick={() => { navigate("/media"); setIsCollapseOpen(false); }}>Media</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}


      <EventFormModal setShowModal={setShowModal} showModal={showModal} />
    </>
  );
};

export default Header;
