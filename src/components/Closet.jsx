import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import MultiCenterGradient from "./gradient";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Swipe.css";

const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
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
    display: "flex",
    justifyContent: "flex-end",
    padding: "1rem",
    gap: "2rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
  },
  mainContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  hero: {
    textAlign: "center",
    padding: "4rem 0",
  },
  h1: {
    fontWeight: "light-bold",
    marginBottom: "1rem",
    color: "white",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "2rem",
  },
  button: {
    background: "#DB3B14",
    color: "white",
    padding: "0.8rem 2rem",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
  },
  section: {
    padding: "4rem 0",
  },
  h2: {
    color: "#DB3B14",
    fontSize: "2.5rem",
    marginBottom: "2rem",
  },
  textLarge: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  },
  h3: {
    color: "#FFAF87",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    margin: "2rem 0",
  },
  statsBox: {
    marginBottom: "2rem",
  },
  statsTitle: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  statsIcon: {
    background: "#333",
    color: "white",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  footer: {
    background: "#f5f5f5",
    padding: "2rem 0",
    textAlign: "center",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "1rem",
  },
  footerLink: {
    color: "#666",
    textDecoration: "none",
  },
};

const Closet = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(user);
        setUserID(user.username);

        if(user.username) {
          await fetchOutfits(user.username);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  const fetchOutfits = async (userID) => {
    try {
      const response = await fetch(
        `http://18.118.186.108:5000/swipebop/outfits/${userID}`
      );
      const data = await response.json();
      setOutfits(data);
      console.log(outfits);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }

  }

  return (
    <>
      <div style={styles.container}>
        <Navbar />
        <section style={styles.hero}>
          <h1 style={{ ...styles.h1, fontStyle: "italic", fontSize: "5rem" }}>
            swipebop closet
          </h1>
          {isLoggedIn ? (
            <>
              <h1 style={{ ...styles.h1, color: "#DB3B14" }}>Outfits</h1>
              {outfits == null ? (
                <div className="loading-container">
                  <p>Loading products...</p>
                </div>
              ) : (
                <div className="loading-container">
                  <p>Products</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 style={{ ...styles.h1, color: "#DB3B14" }}>
                Login / Signup to View Liked Outfits.
              </h1>
              <br />
              <button
                style={{ ...styles.button, marginRight: "10px" }}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button style={styles.button} onClick={() => navigate("/signup")}>
                Signup
              </button>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Closet;
