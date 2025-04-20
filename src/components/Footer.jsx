import React from "react";
import "./Footer.css";

const styles = {
    mainContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
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

const Footer = () => {
  return (
    <footer style={styles.footer} className="hide-on-mobile">
      <div style={styles.mainContainer}>
        <div style={styles.footerLinks}>
          <a href="https://www.shopbop.com/" style={styles.footerLink}>
            Company
          </a>
          <a href="https://www.instagram.com/shopbop/" style={styles.footerLink}>
            Social Media
          </a>
          <a href="https://www.shopbop.com/ci/v2/privacy_notice.html?ref_=SB_D_GBP_FTR_LGL_PP#cs=ov=253114392730,os=1742074395084,link=footerPrivacyPolicyEN" style={styles.footerLink}>
            Privacy
          </a>
          <a href="https://www.shopbop.com/ci/v2/conditions_of_use.html?ref_=SB_D_GBP_FTR_LGL_CON#cs=ov=253114392730,os=1742073966428,link=footerCopyrightEN" style={styles.footerLink}>
            Conditions
          </a>
          <a href="/contact-us" style={styles.footerLink}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
