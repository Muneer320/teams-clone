import React from 'react';
import './css/style.css';
import { Link } from 'react-router-dom';

// --- IMPORT YOUR IMAGES ---
import heroVideo from "../assets/hero-video-4544x2556_low (online-video-cutter.com) (1).mp4";
import videoCallIcon from '../assets/video-filled-32.svg'; // Assuming you have this icon
import hashtagIcon from '../assets/number-symbol-square-28.svg'; // Assuming you have this icon
import teamsLogo from '../assets/Teams_Logo_v2025_80x80.png';
import signInIcon from '../assets/person-20.svg'; 
import shareMeetingImg from '../assets/share-meeting-fr.webp'; 
import meetingGridImg from '../assets/meeting-fr.webp'; 
import captionsImg from '../assets/caption-fr.webp'; 
import emojiImg from '../assets/emoji-fr.webp'; 
import shareScreenImg from '../assets/share-fr.webp'; 
import backgroundsImg from '../assets/background-bg.webp'; 
import linkIcon from '../assets/link-filled-32.svg'; 
import videoIcon from '../assets/video-filled-32.svg'; 
import ccIcon from '../assets/closed-caption-filled-32.svg'; 
import laughIcon from '../assets/emoj-laugh-filled-32.svg'; 
import screenShareIcon from '../assets/screen-share-start-filled-32.svg'; 
import effectsIcon from '../assets/video-background-effect-filled-32.svg'; 
import downloadIcon from '../assets/arrow-download-filled-20.svg'; 
import helpIcon from '../assets/question-circle-filled-20.svg'; 
import privacyIcon from '../assets/privacy-options.svg'; 


//----------------------------------
// Header Component
//----------------------------------
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={teamsLogo} alt="Teams logo" width="24" height="24" />
        <span>Teams meetings</span>
      </div>
      <Link to="/login" className="signIn">
        <img src={signInIcon} alt="" width="20" height="20" />
        Sign in
      </Link>
    </header>
  );
}

//----------------------------------
// Hero Component
//----------------------------------
//----------------------------------
// Hero Component
//----------------------------------
const Hero = () => {
  return (
    <section className="hero">
      <video
        className="heroVideo"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="heroContent">
        <h1 className="heroTitle">
          Video calls with anyone, anytime
        </h1>
        <p className="heroSubtitle">
          Connect and collaborate for free in Teams
        </p>
        <div className="buttonGroup">
          <a href="#start" className="primaryButton">
            <img src={videoCallIcon} alt="" width="20" height="20" />
            Start a meeting for free
          </a>
          <a href="#join" className="secondaryButton">
            <img src={hashtagIcon} alt="" width="20" height="20" />
            Join a meeting
          </a>
        </div>
      </div>
    </section>
  );
};


//----------------------------------
// Features Component
//----------------------------------
const Card = ({ children, className, icon, title, subtitle }) => {
  return (
    <div className={`card ${className || ''}`}>
      <img src={icon} alt="" className="cardIcon" />
      <h3 className="cardTitle">{title}</h3>
      {subtitle && <p className="cardSubtitle">{subtitle}</p>}
      {children}
    </div>
  );
};

const Features = () => {
  return (
    <section className="featuresSection">
      
      {/* --- ROW 1: 50% / 25% / 25% --- */}
      <div className="featureRow">
        <Card 
          className="card1" // This will be 50%
          icon={linkIcon}
          title="Share meeting links with anyone on any device"
        >
          <img src={shareMeetingImg} alt="Two people on a video call" className="cardImage img1" />
        </Card>
        
        <Card 
          className="card2" // This will be 25%
          icon={videoIcon}
          title="Meet for free up to 60 mins"
          subtitle="Instant or schedule ahead"
        >
          <img src={meetingGridImg} alt="Grid of participant icons" className="cardImage img2" />
        </Card>
        
        <Card 
          className="card3" // This will be 25%
          icon={ccIcon}
          title="View Live captions"
          subtitle="In over 40 languages"
        >
          <img src={captionsImg} alt="Chat bubbles showing live captions" className="cardImage img3" />
        </Card>
      </div>

      {/* --- ROW 2: 25% / 25% / 50% --- */}
      <div className="featureRow">
        <Card 
          className="card4" // This will be 25%
          icon={laughIcon}
          title="Entertain the crowd"
          subtitle="With interactive emoji"
        >
          <img src={emojiImg} alt="Person reacting with an emoji" className="cardImage img4" />
        </Card>
        
        <Card 
          className="card5" // This will be 25%
          icon={screenShareIcon}
          title="Share your screen"
          subtitle="For live collab and play"
        >
          <img src={shareScreenImg} alt="Screen sharing with drawing tools" className="cardImage img5" />
        </Card>
        
        <Card 
          className="card6" // This will be 50%
          icon={effectsIcon}
          title="Choose backgrounds and views to set the scene"
        >
          {/* <img src={backgroundsImg} alt="Person in front of a virtual background" className="cardImage img6" /> */}
        </Card>
      </div>
    </section>
  );
};

//----------------------------------
// Footer Component
//----------------------------------
const Footer = () => {
  return (
    <footer className="footer">
      <div className="topFooter">
        <a href="#download">
          <img src={downloadIcon} alt="" width="20" height="20" />
          Download the Teams app
        </a>
        <a href="#help">
          <img src={helpIcon} alt="" width="20" height="20" />
          Need help?
        </a>
      </div>
      <div className="bottomFooter">
        <div className="bottomLeft">
          <a href="#privacy" className="privacyLink">
            <img src={privacyIcon} alt="Your Privacy Choices" />
            Your Privacy Choices
          </a>
          <a href="#health">Consumer Health Privacy</a>
          <a href="#cookies">Privacy & cookies</a>
        </div>
        <div className="bottomRight">
          <a href="#terms">Terms of use</a>
          <a href="#trademarks">Trademarks</a>
          <span>© Microsoft 2025</span>
        </div>
      </div>
    </footer>
  );
}

//----------------------------------
// Main App Component
//----------------------------------
function HomePage() {
  return (
    <div className="App">
      <Header />
      <Hero /> {/* <-- Hero is outside main */}
      
      {/* mainContent constrains the features and footer */}
      <main className="mainContent">
        <Features />
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;