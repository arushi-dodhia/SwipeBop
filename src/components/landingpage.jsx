import React, { useEffect, useRef, useState } from 'react';
import MultiCenterGradient from './gradient';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { getCurrentUser, signOut } from "@aws-amplify/auth";

const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
  },
  gradientContainer: {
    position: "relative",
    background: `
      linear-gradient(135deg, 
        rgba(255, 170, 150, 1) 0%, 
        rgba(220, 170, 200, 1) 40%, 
        rgba(170, 180, 220, 1) 70%,
        rgba(150, 180, 210, 1) 100%)
    `,
    backgroundColor: "transparent",
    backgroundSize: "200% 200%",
    backgroundPosition: "center",
    height: "100vh",
    overflow: "hidden",

  },
  noiseOverlay: {
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "url('/images/noise.png')",
    opacity: 0.2,
    zIndex: 2,
  },
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
  mainContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 0',
  },
  h1: {
    fontWeight: 'light-bold',
    marginBottom: '1rem',
    color: "white"

  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
  },
  button: {
    background: '#DB3B14',
    color: 'white',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
  },
  section: {
    padding: '4rem 0',
  },
  h2: {
    color: '#DB3B14',
    fontSize: '2.5rem',
    marginBottom: '2rem',
  },
  textLarge: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  },
  h3: {
    color: "#FFAF87",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    margin: '2rem 0',
  },
  statsBox: {
    marginBottom: '2rem',
  },
  statsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  statsIcon: {
    background: '#333',
    color: 'white',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  footer: {
    background: '#f5f5f5',
    padding: '2rem 0',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '1rem',
  },
  footerLink: {
    color: '#666',
    textDecoration: 'none',
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout= async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div style={styles.container}>
      <div >
        <MultiCenterGradient>
        <Navbar />
          <section style={styles.hero}>
            <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '5rem' }}>s w i p e b o p</h1>
            <p style={styles.subtitle}>
              Effortless fashion at your fingertips<br />
              — swipe, match, and style
            </p>
            <button style={styles.button}>Start Swiping</button>
          </section>
        </MultiCenterGradient>
      </div>
      <div style={styles.mainContainer}>
        <section style={styles.section}>
          <h2 style={styles.h2}>A New Way to Shop Fashion</h2>
          <div style={styles.grid}>
            <div>
              <p style={styles.textLarge}>
                Say goodbye to endless scrolling, headaches rooms until shopping has you
                drained. Say, hello. Find your perfect match in seconds.
              </p>
              <p style={styles.textLarge}>
                No filters, no complicated choices, just pure style at your fingertips.
                One swipe while letting you choose to your heart's style.
              </p>
            </div>
            <div>
              <img src="/api/placeholder/600/400" alt="Clothing rack" style={styles.image} />
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Fashion Powered by Shopbop</h2>
          <div style={styles.grid}>
            <div style={styles.statsBox}>
              <div style={styles.statsTitle}>
                <div style={styles.statsIcon}>S</div>
                <h3 style={{ ...styles.h3 }}>1000+ Brands</h3>
              </div>
              <p>We carefully vet each brand to ensure consistent style and design sensibility.</p>
            </div>
            <div style={styles.statsBox}>
              <h3 style={{ ...styles.h3 }}>2M+ Users</h3>
              <p>Our dedicated user base enables us to deliver more accurate recommendations, which gets better each time you use it.</p>
            </div>
            <div>
              <img src="/api/placeholder/300/400" alt="Fashion model" style={styles.image} />
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Visualize Your Outfits</h2>
          <p style={styles.textLarge}>SwipeBop lets you instantly visualize how pieces come together.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris.
          </p>
        </section>
      </div>

      <div style={{ height: '250px', overflow: 'hidden' }}>
        <MultiCenterGradient style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '3rem' }}>s w i p e n o w</h1>
            <button style={{ ...styles.button }}>Start Swiping</button>
          </div>
        </MultiCenterGradient>
      </div>

      <footer style={styles.footer}>
        <div style={styles.mainContainer}>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Company</a>
            <a href="#" style={styles.footerLink}>Social Media</a>
            <a href="#" style={styles.footerLink}>Privacy</a>
            <a href="#" style={styles.footerLink}>Terms</a>
            <a href="#" style={styles.footerLink}>Contact</a>
            <a href="#" style={styles.footerLink}>Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;