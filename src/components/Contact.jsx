import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./landingpage";
import MultiCenterGradient from './gradient';
import emailjs from '@emailjs/browser';

const styles = {
    container: {
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6,
    },
    container2: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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
    global: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box'
    },
    htmlBody: {
        height: '100vh',
        background: '#666666',
        fontFamily: "'Balsamiq Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    // Additional style inspiration - https://codepen.io/batuhanbas/pen/VwezONv
    card: {
        width: "90%",
        maxWidth: "900px",
        padding: "50px",
        border: "6px solid rgba(0, 0, 0, 0.5)",
        boxShadow: "20px 20px 0 rgba(0, 0, 0, 0.3)",
        borderRadius: "50px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
    cardTitle: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: '60px',
        textTransform: 'uppercase'
    },
    form: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px", // Keeps proper spacing between fields
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
    },
    label: {
        fontSize: "28px",
        color: "#ffffff",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        height: "50px",
        fontSize: "18px",
        padding: "10px",
        border: "3px solid rgba(0, 0, 0, 0.3)",
        boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.3)",
        borderRadius: "25px",
        background: "rgba(255, 255, 255, 0.3)",
        color: "#000",
        outline: "none",
    },
    msgTxtarea: {
        width: "100%",
        height: "150px", // Larger message box
        fontSize: "18px",
        padding: "10px",
        border: "3px solid rgba(0, 0, 0, 0.3)",
        boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.3)",
        borderRadius: "25px",
        background: "rgba(255, 255, 255, 0.3)",
        color: "#000",
        outline: "none",
        resize: "none",
    },
    submitButtonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
    },
    submitButton: {
        width: "50%",
        padding: "12px",
        fontSize: "18px",
        textTransform: "uppercase",
        background: "#DB3B14",
        color: "white",
        border: "none",
        borderRadius: "40px",
        cursor: "pointer",
        transition: "all 0.3s",
    },
};


const Contact = () => {
    const navigate = useNavigate()
    const form = useRef();

    // Reference code from email.JS website - https://www.emailjs.com/docs/examples/reactjs/
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_5v4fjce', 'template_5sqiiyf', form.current, {
                publicKey: '5wsqh_crA7kicvpek',
            })
            .then(
                () => {
                    alert('Succesfully sent message!');
                    console.log('SUCCESS!');
                },
                (error) => {
                    alert('Error!, please try again later.')
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (
        <div style={styles.container}>
            <div >
                <MultiCenterGradient>
                    <nav style={styles.nav}>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/")}>HOME</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/swipe")}>SWIPING</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/about-us")}>ABOUT</a>
                        <a href="#" style={styles.navLink} onClick={() => navigate("/outfits")}>CART</a>
                        <a href="https://us-east-28cr6iby3m.auth.us-east-2.amazoncognito.com/login?client_id=85q1ulv7t8ivq7g9p7ioivdqs&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F" style={styles.navLink}>LOGIN / REGISTER</a>
                        <a href="https://us-east-28cr6iby3m.auth.us-east-2.amazoncognito.com/logout?client_id=85q1ulv7t8ivq7g9p7ioivdqs&logout_uri=http%3A%2F%2Flocalhost%3A3000%2F" style={styles.navLink}>LOGOUT</a>
                    </nav>
                    <div style={styles.container2}>
                        <div style={styles.card}>
                            <h2 style={styles.cardTitle}>Contact Us</h2>
                            <form ref={form} style={styles.form} onSubmit={sendEmail}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Name</label>
                                    <input type="text" name="user_name" style={styles.input} required />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input type="email" name="user_email" style={styles.input} required />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Message</label>
                                    <textarea name="message" style={styles.msgTxtarea} required></textarea>
                                </div>
                                <div style={styles.submitButtonContainer}>
                                    <input type="submit" value="Submit" style={styles.submitButton} />
                                </div>
                            </form>
                        </div>
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

export default Contact;