import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/landingpage.css";
import logo from "../assets/logo.png";

/*
NexHire ATS Landing Page
Improved Full JSX Code
Responsive + Animated + FAQ Updated
*/

function LandingPage() {
    const [activeFAQ, setActiveFAQ] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const scrollHandler = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", scrollHandler);

        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    const workflowSteps = [
        {
            id: "01",
            title: "Vendor Registration",
            desc: "Easily onboard recruitment vendors with profiles, agreements and contact details."
        },
        {
            id: "02",
            title: "Job Creation",
            desc: "Create new job openings with skills, budget, priority and hiring deadlines."
        },
        {
            id: "03",
            title: "Candidate Submission",
            desc: "Vendors upload candidate resumes with duplicate profile detection."
        },
        {
            id: "04",
            title: "Interview Tracking",
            desc: "Track screening rounds, technical interviews and HR feedback."
        },
        {
            id: "05",
            title: "Hiring Analytics",
            desc: "Monitor vendor performance, submission ratio and time-to-fill metrics."
        }
    ];

    const teamMembers = [
        {
            name: "Het Limbani",
            role: "Team Lead / Full Stack Developer"
        },
        {
            name: "Sahil Dobaria",
            role: "Frontend Developer"
        },
        {
            name: "Rohan Upadhyay",
            role: "Backend Developer"
        }
    ];

    const faqs = [
        {
            q: "What is NexHire ATS?",
            a: "NexHire ATS is an internal hiring platform designed to manage vendors, job openings, candidate submissions and recruitment workflows in one place."
        },
        {
            q: "Who can use this system?",
            a: "Admins, HR teams, hiring managers and recruitment vendors can securely access the system based on their assigned role."
        },
        {
            q: "Can vendors track submitted candidates?",
            a: "Yes. Vendors can view candidate progress such as screening, interview, selected or rejected stages."
        },
        {
            q: "Is candidate data secure?",
            a: "Yes. Sensitive candidate and vendor information is protected using secure authentication and encrypted storage practices."
        },
        {
            q: "Can this platform scale for large companies?",
            a: "Yes. NexHire ATS is designed with scalable architecture using React, Node.js and PostgreSQL."
        }
    ];

    return (
        <div className={`landing-wrapper ${scrolled ? "is-scrolled" : ""}`}>
            {/* Animated Background */}
            <div className="landing-bg-shape one"></div>
            <div className="landing-bg-shape two"></div>
            <div className="landing-bg-shape three"></div>

            <section className="landing-card">

                {/* Navbar */}
                <nav className="landing-nav">

                    <div className="brand-box">
                        <img src={logo} alt="logo" className="brand-logo" />
                        <h2>NexHire</h2>
                    </div>

                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#workflow">Workflow</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#faq">FAQ</a></li>
                    </ul>

                    <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>

                </nav>

                {/* Hero Section */}
                <section className="hero-section" id="home">

                    <div className="hero-left">

                        <span className="tag-line">
                            Smart Hiring & Vendor Management
                        </span>

                        <h1>
                            DISCOVER <br />
                            TALENT WORLDWIDE
                        </h1>

                        <p>
                            NexHire ATS helps companies streamline vendor onboarding,
                            job requisitions, candidate submissions, interview workflow
                            and hiring analytics with one centralized intelligent platform.
                        </p>

                        <div className="hero-actions">
                            <button className="primary-btn" onClick={() => navigate("/login")}>
                                Get Started
                            </button>
                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    window.open(
                                        "https://github.com/HetLimbani-learnerboy/NexHire",
                                        "_blank"
                                    )
                                }
                            >
                                View Repository
                            </button>
                        </div>

                    </div>

                    {/* Hero Right */}
                    <div className="hero-right">

                        <div className="dashboard-box floating-card card-one">
                            <h3>Open Jobs</h3>
                            <span>24</span>
                        </div>

                        <div className="dashboard-box floating-card card-two">
                            <h3>Vendors</h3>
                            <span>52</span>
                        </div>

                        <div className="dashboard-main">
                            <img src={logo} alt="logo" className="hero-logo" />
                            <h2>NexHire ATS</h2>
                            <p>Smarter Hiring. Faster Growth.</p>
                        </div>

                        <div className="dashboard-box floating-card card-three">
                            <h3>Candidates</h3>
                            <span>1286</span>
                        </div>

                    </div>

                </section>

                {/* Stats Strip */}
                <section className="bottom-strip">

                    <div className="offer-box">
                        <h2>100%</h2>
                        <p>Workflow Visibility</p>
                    </div>

                    <div className="mini-box">
                        <h3>Vendor Ratings</h3>
                        <p>
                            Score vendors by quality, closures and turnaround time.
                        </p>
                    </div>

                    <div className="mini-box">
                        <h3>Fast Hiring</h3>
                        <p>
                            Reduce manual delays with automated hiring pipelines.
                        </p>
                    </div>

                    <div className="book-now">
                        <h3>Book Demo</h3>
                        <p>
                            Experience enterprise ATS workflow today.
                        </p>
                    </div>

                </section>

                {/* Workflow */}
                <section className="workflow-section" id="workflow">

                    <div className="section-header">
                        <span className="section-tag">How It Works</span>
                        <h2 className="section-title">
                            NexHire Recruitment Pipeline
                        </h2>
                    </div>

                    <div className="workflow-grid">

                        {workflowSteps.map((step) => (
                            <div className="workflow-card" key={step.id}>

                                <div className="step-num">
                                    {step.id}
                                </div>

                                <h4>{step.title}</h4>

                                <p>{step.desc}</p>

                            </div>
                        ))}

                    </div>

                </section>

                {/* About */}
                <section className="about-section" id="about">

                    <div className="about-left">

                        <span className="section-tag">
                            About Project
                        </span>

                        <h2>
                            Internal ATS for Vendor Management
                        </h2>

                        <p>
                            NexHire ATS was designed to solve vendor based hiring
                            challenges for enterprises. It centralizes vendors,
                            candidates and hiring teams under one modern system.
                        </p>
                        <span className="section-tag" style={{ marginTop: "20px", fontSize: "14px", background: "#eee", color: "#333" }}>
                            College: Adani University
                        </span>

                    </div>

                    <div className="about-right">

                        {teamMembers.map((member, index) => (
                            <div className="team-card" key={index}>

                                <div className="member-avatar">
                                    {member.name.charAt(0)}
                                </div>

                                <div className="member-info">
                                    <h4>{member.name}</h4>
                                    <p>{member.role}</p>
                                </div>

                            </div>
                        ))}

                    </div>

                </section>

                {/* FAQ */}
                <section className="faq-section" id="faq">

                    <div className="section-header">
                        <span className="section-tag">Support</span>
                        <h2 className="section-title">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="faq-container">

                        {faqs.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeFAQ === index ? "active" : ""
                                    }`}
                            >

                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h4>{item.q}</h4>
                                    <span>
                                        {activeFAQ === index ? "-" : "+"}
                                    </span>
                                </div>

                                {activeFAQ === index && (
                                    <div className="faq-answer">
                                        <p>{item.a}</p>
                                    </div>
                                )}

                            </div>
                        ))}

                    </div>

                </section>

                {/* Footer */}
                <footer className="footer-section">

                    <div className="footer-brand">
                        <img src={logo} alt="logo" className="footer-logo" />
                        <h3>NexHire ATS</h3>
                    </div>

                    <p>
                        © 2026 NexHire ATS. Built for smarter enterprise hiring.
                    </p>

                </footer>

            </section>
        </div>
    );
}

export default LandingPage;