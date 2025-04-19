import React, { useEffect, useRef, useState } from 'react';
import MultiCenterGradient from './gradient';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import Footer from './Footer';

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
    color: "white",
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
    fontSize: '1rem',
  },
  section: {
    padding: '4rem 0',
  },
  h2: {
    color: '#DB3B14',
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
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
    flexShrink: 0,
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
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#666',
    textDecoration: 'none',
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop";

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUser();
    fetchFashionImage();
  }, []);

  const [productImages, setProductImages] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const fetchFashionImage = async () => {
    setIsLoading(true);
    try {
      const category = 'tops';
      const queryParams = new URLSearchParams({
        lang: 'en-US',
        currency: 'USD',
        q: category,
        limit: 10,
        minPrice: 25,
        maxPrice: 500,
        siteId: 1006,
        allowOutOfStockItems: 'false',
        dept: 'WOMENS',
      });

      const response = await fetch(`https://swipebop-backend.online/swipebop/images?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Client-Id': 'Shopbop-UW-Team2-2024',
          'Client-Version': '1.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch fashion images`);
      }

      const data = await response.json();
      const images = Object.values(data);

      if (images.length > 1) {
        setProductImages(images);
        setImage1(images[0]);
        setImage2(images[1]);
      } else {
        setImage1(images[0] || fallbackImage);
        setImage2(fallbackImage);
      }

      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setImage1(fallbackImage);
      setImage2(fallbackImage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div>
        <MultiCenterGradient>
          <Navbar />
          <section style={styles.hero}>
            <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '5rem' }}>s w i p e b o p</h1>
            <p style={styles.subtitle}>
              Effortless fashion at your fingertips<br />
              — swipe, match, and style
            </p>
            <button style={styles.button} onClick={() => navigate('/swipe')}>Start Swiping</button>
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
                drained. Say, hello to finding your perfect match in seconds.
              </p>
              <p style={styles.textLarge}>
                No filters, no complicated choices, just pure style at your fingertips.
                One swipe while letting you choose to your heart's style.
              </p>
            </div>
            <div>
              {isLoading ? (
                <div style={{ ...styles.image, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Loading fashion image...
                </div>
              ) : (
                <div style={styles.image}>
                  <img
                    src={image1 || fallbackImage}
                    alt="Fashion item"
                    style={{ width: '60%', height: '30%', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>
              )}
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
              <div style={styles.image}>
                <img
                  src={image2 || fallbackImage}
                  alt="Fashion item"
                  style={{ width: '60%', height: '30%', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Visualize Your Outfits</h2>
          <p style={styles.textLarge}>SwipeBop lets you instantly visualize how pieces come together.</p>
          
        </section>
      </div>

      <div style={{ height: '180px', overflow: 'hidden' }}>
        <MultiCenterGradient style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '3rem' }}>s w i p e n o w</h1>
            <button style={{ ...styles.button }} onClick={() => navigate('/swipe')}>Start Swiping</button>
          </div>
        </MultiCenterGradient>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;