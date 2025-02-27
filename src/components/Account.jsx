import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiCenterGradient from './gradient';

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

const Account = () => {
    const navigate = useNavigate()

    return (
        <div style={styles.container}>
            <div >
                <MultiCenterGradient>
                    <nav style={styles.nav}>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/swipe")}>SWIPING</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/about-us")}>ABOUT</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/contact-us")}>CONTACT</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/outfits")}>CART</a>
                    </nav>
                    <section style={styles.hero}>
                        <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '3rem' }}>Already have an account?</h1>
                        <button style={styles.button} onClick={() => navigate("/login")}>Login</button>
                        <p>
                        <br />
                        <br />
                        <br />
                        </p>
                        <h1 style={{ ...styles.h1, fontStyle: 'italic', fontSize: '3rem' }}>Need a new account?</h1>
                        <button style={styles.button} onClick={() => navigate("/signup")}>Register</button>
                    </section>
                </MultiCenterGradient>
            </div>
        </div>
    );
};

export default Account;