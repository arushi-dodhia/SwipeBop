import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@aws-amplify/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkUserStatus();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Close drawer when resized to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const renderNavLinks = (navStyles, onClick = null) => (
    <>
      <a href="#" style={navStyles} onClick={() => onClick ? onClick("/") : navigate("/")}>HOME</a>
      <a href="#" style={navStyles} onClick={() => onClick ? onClick("/swipe") : navigate("/swipe")}>SWIPE</a>
      <a href="#" style={navStyles} onClick={() => onClick ? onClick("/about-us") : navigate("/about-us")}>ABOUT</a>
      <a href="#" style={navStyles} onClick={() => onClick ? onClick("/contact-us") : navigate("/contact-us")}>CONTACT</a>
      <a href="#" style={navStyles} onClick={() => onClick ? onClick("/closet") : navigate("/closet")}>CLOSET</a>
      {isLoggedIn ? (
        <a href="#" style={navStyles} onClick={onClick ? handleLogout : handleLogout}>LOGOUT</a>
      ) : (
        <>
          <a href="#" style={navStyles} onClick={() => onClick ? onClick("/login") : navigate("/login")}>LOGIN</a>
          <a href="#" style={navStyles} onClick={() => onClick ? onClick("/signup") : navigate("/signup")}>SIGNUP</a>
        </>
      )}
    </>
  );

  return (
    <>
      {isMobile && (
        <div style={styles.hamburgerContainer}>
          <button 
            style={styles.hamburgerButton} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <div style={styles.hamburgerIcon}>
              <span style={styles.hamburgerLine}></span>
              <span style={styles.hamburgerLine}></span>
              <span style={styles.hamburgerLine}></span>
            </div>
          </button>
        </div>
      )}

      {!isMobile && (
        <nav style={styles.nav}>
          {renderNavLinks(styles.navLink)}
        </nav>
      )}

      {isMobile && (
        <>
          {isOpen && (
            <div 
              style={styles.overlay} 
              onClick={() => setIsOpen(false)}
            />
          )}

          <nav style={{
            ...styles.drawer,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}>
            <div style={styles.drawerHeader}>
              <button 
                style={styles.closeButton} 
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <div style={styles.drawerContent}>
              {renderNavLinks(styles.drawerLink, navigateTo)}
            </div>
          </nav>
        </>
      )}
    </>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1rem',
    gap: '2rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
  },
  
  hamburgerContainer: {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 100,
  },
  hamburgerButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  hamburgerIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '20px',
  },
  hamburgerLine: {
    width: '100%',
    height: '3px',
    backgroundColor: '#333',
    borderRadius: '2px',
  },
  

  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '250px',
    backgroundColor: '#fff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#333',
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
    flex: 1,
  },
  drawerLink: {
    textDecoration: 'none',
    color: '#333',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #eee',
    fontSize: '1rem',
  },
  

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
};

export default Navbar;