import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../contact.css";
import MultiCenterGradient from "./gradient";
import Navbar from "./Navbar";
import emailjs from "@emailjs/browser";
import Footer from "./Footer";

const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

const Contact = () => {
  const navigate = useNavigate();
  const form = useRef();

  // Reference code from email.JS website - https://www.emailjs.com/docs/examples/reactjs/
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_5v4fjce", "template_5sqiiyf", form.current, {
        publicKey: "5wsqh_crA7kicvpek",
      })
      .then(
        () => {
          alert("Succesfully sent message!");
          console.log("SUCCESS!");
        },
        (error) => {
          alert("Error!, please try again later.");
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    // Contact Us Design from = https://workik.com/contact-us-designs-with-html-css-and-javascript
    <div style={styles.container}>
      <div>
        <Navbar />
        <div style={styles.gradientContainer}>
          <MultiCenterGradient>
            <div className="new_home_web">
              <div className="responsive-container-block big-container">
                <div className="responsive-container-block textContainer">
                  <div className="topHead">
                    <p className="text-blk heading">
                      CONTACT-
                      <span className="orangeText">US</span>
                    </p>
                  </div>
                </div>
                <div className="responsive-container-block container">
                  <div
                    className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-7 wk-ipadp-10 line"
                    id="i69b"
                  >
                    <form className="form-box" ref={form} onSubmit={sendEmail}>
                      <div className="container-block form-wrapper">
                        <div className="responsive-container-block">
                          <div className="left4">
                            <div
                              className="responsive-cell-block wk-ipadp-6 wk-tab-12 wk-mobile-12 wk-desk-6"
                              id="i10mt-2"
                            >
                              <input
                                className="input"
                                id="ijowk-2"
                                name="first_name"
                                placeholder="First Name"
                                required
                              />
                            </div>
                            <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                              <input
                                className="input"
                                id="indfi-2"
                                name="last_name"
                                placeholder="Last Name"
                                required
                              />
                            </div>
                            <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                              <input
                                className="input"
                                id="ipmgh-2"
                                name="user_email"
                                placeholder="Email Address"
                                required
                              />
                            </div>
                            <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12 lastPhone">
                              <input
                                className="input"
                                id="imgis-2"
                                name="phone_number"
                                placeholder="Phone Number"
                                required
                              />
                            </div>
                          </div>
                          <div
                            className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12"
                            id="i634i-2"
                          >
                            <textarea
                              className="textinput"
                              id="i5vyy-2"
                              name="message"
                              placeholder="Message"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <input
                          type="submit"
                          value="Submit"
                          className="send"
                          href="#"
                          id="w-c-s-bgc_p-1-dm-id"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </MultiCenterGradient>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
