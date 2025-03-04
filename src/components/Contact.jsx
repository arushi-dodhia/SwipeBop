import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./landingpage";
import "./contact.css"
import MultiCenterGradient from './gradient';
import emailjs from '@emailjs/browser';


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


const Contact = () => {
    const navigate = useNavigate();
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
        // Contact Us Design from = https://workik.com/contact-us-designs-with-html-css-and-javascript
        <div style={styles.container}>
            <div >
                <nav style={styles.nav}>
                    <a href="#" style={styles.navLink} onClick={() => navigate("/")}>HOME</a>
                    <a href="#" style={styles.navLink} onClick={() => navigate("/swipe")}>SWIPING</a>
                    <a href="#" style={styles.navLink} onClick={() => navigate("/about-us")}>ABOUT</a>
                    <a href="#" style={styles.navLink} onClick={() => navigate("/outfits")}>CART</a>
                    <a href="https://us-east-28cr6iby3m.auth.us-east-2.amazoncognito.com/login?client_id=85q1ulv7t8ivq7g9p7ioivdqs&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F" style={styles.navLink}>LOGIN / REGISTER</a>
                    <a href="https://us-east-28cr6iby3m.auth.us-east-2.amazoncognito.com/logout?client_id=85q1ulv7t8ivq7g9p7ioivdqs&logout_uri=http%3A%2F%2Flocalhost%3A3000%2F" style={styles.navLink}>LOGOUT</a>
                </nav>
                <div class="new_home_web">
                    <div class="responsive-container-block big-container">
                        <div class="responsive-container-block textContainer">
                            <div class="topHead">
                                <p class="text-blk heading">
                                    CONTACT-
                                    <span class="orangeText">
                                        SWIPEBOP-TEAM
                                    </span>
                                </p>
                                <div class="orangeLine" id="w-c-s-bgc_p-2-dm-id">
                                </div>
                            </div>
                        </div>
                        <div class="responsive-container-block container">
                            <div class="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-7 wk-ipadp-10 line" id="i69b">
                                <form class="form-box" ref={form} onSubmit={sendEmail}>
                                    <div class="container-block form-wrapper">
                                        <div class="responsive-container-block">
                                            <div class="left4">
                                                <div class="responsive-cell-block wk-ipadp-6 wk-tab-12 wk-mobile-12 wk-desk-6" id="i10mt-2">
                                                    <input class="input" id="ijowk-2" name="first_name" placeholder="First Name" required/>
                                                </div>
                                                <div class="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                                                    <input class="input" id="indfi-2" name="last_name" placeholder="Last Name" required/>
                                                </div>
                                                <div class="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                                                    <input class="input" id="ipmgh-2" name="user_email" placeholder="Email Address" required/>
                                                </div>
                                                <div class="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12 lastPhone">
                                                    <input class="input" id="imgis-2" name="phone_number" placeholder="Phone Number" required/>
                                                </div>
                                            </div>
                                            <div class="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12" id="i634i-2">
                                                <textarea class="textinput" id="i5vyy-2" name="message" placeholder="Message" required></textarea>
                                            </div>
                                        </div>
                                        <input type="submit" value="Submit" class='send' href="#" id="w-c-s-bgc_p-1-dm-id" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
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