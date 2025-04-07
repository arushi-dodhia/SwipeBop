import React from "react";
import { useNavigate } from "react-router-dom";
import MultiCenterGradient from "./gradient";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    color: "black",
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

const About = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.gradientContainer}>
        <MultiCenterGradient>
          <Navbar />
          <section style={styles.hero}>
            <h1 style={{ ...styles.h1, fontStyle: "italic", fontSize: "5rem" }}>
              s w i p e b o p
            </h1>
            <p style={styles.subtitle}>
              {" "}
              Swipebop is a fashion e-commerce platform that allows you to
              explore and find outfits at the click of a button.{" "}
            </p>
            <p style={styles.textLarge}>
              {" "}
              It is the one destination for all things fashion, offering a a
              curated selection of ready-to-wear & accessories from over 1,000
              established and emerging designers. Debuting new arrivals,
              compelling editorial content, and style guidance daily, Swipebop
              provides best-in-class customer service, fast, free shipping
              worldwide and free returns in the U.S. and Canada. Swipebop is run
              by Shopbop, part of the Amazon.com Inc. group of companies.
            </p>
            <h2 style={styles.h2}>Ready to start swiping?</h2>
            <button style={styles.button} onClick={() => navigate('/swipe')}>Find Outfits</button>
          </section>
        </MultiCenterGradient>
      </div>
      <Footer />
    </div>
  );
};

export default About;
