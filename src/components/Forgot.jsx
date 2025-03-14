import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiCenterGradient from './gradient';
import InputField from "./Input";
import { confirmResetPassword, resetPassword } from "@aws-amplify/auth";
import Navbar from "./Navbar";
import "../login.css"

const styles = {
    container: {
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

const Forgot = () => {

    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Step 1: Request reset, Step 2: Enter code & new password
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleResetPassword(e) {
        e.preventDefault();
        const username = e.target.email.value;
        try {
            await resetPassword({ username });
            setStep(2);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleConfirmResetPassword(e) {
        e.preventDefault();
        const username = e.target.email.value;
        const confirmationCode = e.target.code.value;
        const newPassword = e.target.newPassword.value;
        console.log(confirmationCode);
        try {
          await confirmResetPassword({ username, confirmationCode, newPassword });
          navigate("/login");
        } catch (error) {
            setError(error.message);
          console.log(error);
        }
      }

    return (
        <div style={styles.container}>
            <div style={styles.gradientContainer}>
                <MultiCenterGradient>
                    <Navbar />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '90vh',  // Ensures it takes the full gradient height
                    }}>
                        <div className="login-container">
                            <h2 className="form-title">Forgot Password?</h2>
                            {error && <p className="error-message">{error}</p>}
                            {message && <p className="success-message">{message}</p>}

                            {step === 1 ? (
                                <form className="login-form" onSubmit={handleResetPassword}>
                                    <InputField type="text" name="email" placeholder="Email / Username" icon="mail" />
                                    <button type="submit" className="login-button">Send Reset Code</button>
                                </form>
                            ) : (
                                <form className="login-form" onSubmit={handleConfirmResetPassword}>
                                    <InputField type="text" name="email" placeholder="Email / Username" icon="mail" />
                                    <InputField type="text" name="code" placeholder="Enter code" icon="key" />
                                    <InputField type="password" name="newPassword" placeholder="Enter new password" icon="lock" />
                                    <button type="submit" className="login-button">Reset Password</button>
                                </form>
                            )}

                            <p className="signup-prompt">
                                Remembered your password? <a href="#" className="signup-link" onClick={() => navigate("/login")}>Login</a>
                            </p>
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

export default Forgot;
