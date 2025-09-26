// src/components/Home.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Feature = ({ title, text, index, observeRef }) => (
  <div
    ref={observeRef}
    className="col-md-4 mb-4 reveal-card"
    style={{ transitionDelay: `${index * 120}ms` }}
  >
    <div className="card feature-card border-0 shadow h-100 hover-scale">
      <div className="card-body text-center">
        <div className="feature-icon fs-1 mb-3">{title[0]}</div>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text text-muted">{text}</p>
      </div>
    </div>
  </div>
);

const CourseCard = ({ title, desc, color }) => (
  <div className="col-md-4 mb-4">
    <div
      className="card border-0 shadow-lg h-100 course-card"
      style={{ borderTop: `5px solid ${color}` }}
    >
      <div className="card-body">
        <h5 className="fw-bold">{title}</h5>
        <p className="text-muted">{desc}</p>
        <button className="btn btn-sm btn-primary">View Course</button>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [typed, setTyped] = useState("");
  const fullText =
    "Explore a wide range of courses, enroll easily, and start learning right away.";
  const [statsStarted, setStatsStarted] = useState(false);
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const revealRefs = useRef([]);
  revealRefs.current = [];
  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };
  const statsRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("site-theme") || "light");

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Reveal + Stats observer
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.15 }
    );
    revealRefs.current.forEach((r) => r && revealObserver.observe(r));

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsStarted) setStatsStarted(true);
        });
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      revealRefs.current.forEach((r) => r && revealObserver.unobserve(r));
      if (statsRef.current) statsObserver.unobserve(statsRef.current);
    };
  }, [statsStarted]);

  // Counters
  useEffect(() => {
    if (!statsStarted) return;
    const t1 = setInterval(() => setCoursesCount((c) => Math.min(120, c + 2)), 30);
    const t2 = setInterval(() => setStudentsCount((c) => Math.min(3000, c + 50)), 30);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [statsStarted]);

  // Scroll top button
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Theme persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  const features = [
    { title: "🎓 Enroll Easily", text: "Browse available courses and enroll with just a single click." },
    { title: "📖 Learn Anytime", text: "Access course materials anytime, anywhere, at your convenience." },
    { title: "👩‍🏫 Expert Instructors", text: "Learn from experienced professionals and subject matter experts." },
  ];

  const popularCourses = [
    { title: "React for Beginners", desc: "Build dynamic UIs using React.", color: "#3b82f6" },
    { title: "Java Spring Boot", desc: "Master backend development with Spring.", color: "#16a34a" },
    { title: "Python Data Science", desc: "Analyze data with Pandas & NumPy.", color: "#f59e0b" },
  ];

  const testimonials = [
    { name: "Aarav", feedback: "This platform made learning so easy and fun!" },
    { name: "Meera", feedback: "The instructors are amazing and supportive." },
    { name: "Rohit", feedback: "I got my first internship thanks to these courses!" },
  ];

  return (
    <div className="home-root">
      {/* Background animation */}
      <div className="bg-animate" aria-hidden="true" />

      <div className="container py-5 position-relative content-wrap" style={{ zIndex: 2 }}>
        {/* Hero Section */}
        <section className="hero p-4 p-md-5 rounded-3 shadow-lg mb-5">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="display-5 fw-bold mb-3">📚 Course Enrollment Platform</h1>
              <p className="lead" style={{ minHeight: 24 }}>
                <span className="typewriter">{typed}</span>
              </p>
              <div className="mt-4 d-flex flex-wrap gap-2 align-items-center">
                <Link to="/login" className="btn btn-primary btn-lg ripple">🔑 Login</Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg ripple">📝 Register</Link>
                <Link to="/register" className="btn btn-info btn-lg text-white ripple">🔍 Explore Courses</Link>
                {/* Dark mode toggle alongside Explore Courses */}
                <button className="btn btn-dark btn-lg" onClick={toggleTheme}>
                  {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <div className="row mb-5">
          {features.map((f, i) => <Feature key={i} title={f.title} text={f.text} index={i} observeRef={addRevealRef} />)}
        </div>

        {/* Popular Courses */}
        <h3 className="fw-bold mb-4">🔥 Popular Courses</h3>
        <div className="row mb-5">
          {popularCourses.map((c, i) => <CourseCard key={i} {...c} />)}
        </div>

        {/* Testimonials */}
        <h3 className="fw-bold mb-4">💬 What Students Say</h3>
        <div className="row mb-5">
          {testimonials.map((t, i) => (
            <div key={i} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 p-3 testimonial-card">
                <p className="fst-italic">“{t.feedback}”</p>
                <div className="fw-bold mt-3">- {t.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <section ref={statsRef} className="stats-section mb-5">
          <div className="row g-4 text-center">
            <div className="col-md-6">
              <div className="card rounded-3 shadow-sm p-4">
                <h4 className="display-6 fw-bold">{coursesCount}+</h4>
                <div className="text-muted">Courses</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card rounded-3 shadow-sm p-4">
                <h4 className="display-6 fw-bold">{studentsCount >= 1000 ? `${Math.floor(studentsCount/1000)}k+` : studentsCount}</h4>
                <div className="text-muted">Students</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to top */}
      {showTop && (
        <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      )}

      {/* Styles */}
      <style>{`
        :root {
          --accent: #0d6efd;
          --bg: #f9fafb;
          --text: #111827;
          --muted: #6b7280;
          --card-bg: #ffffff;
        }
        [data-theme="dark"] {
          --bg: #071024;
          --text: #e6eef8;
          --accent: #60a5fa;
          --muted: #cbd5e1;
          --card-bg: rgba(10,14,20,0.95);
        }
        body, .home-root { margin:0; padding:0; background:var(--bg); color:var(--text); min-height:100vh; transition: background 0.4s ease, color 0.4s ease; }

        /* Background animation - more visible */
        .bg-animate {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 15% 25%, rgba(99,102,241,0.4), transparent 25%),
            radial-gradient(circle at 85% 75%, rgba(245,158,11,0.35), transparent 25%),
            radial-gradient(circle at 50% 50%, rgba(96,165,250,0.3), transparent 20%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 40%);
          background-size: 250% 250%;
          animation: gradientMove 15s ease-in-out infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%; }
          50% { background-position: 100% 50%, 0% 50%, 80% 20%, 50% 50%; }
          100% { background-position: 50% 100%, 50% 0%, 20% 80%, 100% 100%; }
        }

        /* Card, feature, testimonial styling */
        .feature-card, .course-card, .testimonial-card { border-radius: 12px; background: var(--card-bg); color: var(--text); }
        .text-muted { color: var(--muted) !important; }
        .reveal-card { opacity:0; transform:translateY(18px); transition:all 480ms cubic-bezier(.2,.9,.3,1); }
        .reveal-card.is-visible { opacity:1; transform:translateY(0); }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: translateY(-6px) scale(1.02); }
        .feature-icon { width:64px; height:64px; display:inline-flex; align-items:center; justify-content:center; border-radius:12px; background: rgba(13,110,253,0.12); color: var(--accent); margin:auto; }

        /* Scroll-top button */
        .scroll-top { position:fixed; right:20px; bottom:24px; width:44px; height:44px; border:none; border-radius:10px; background:var(--accent); color:white; display:flex; justify-content:center; align-items:center; cursor:pointer; }
      `}</style>
    </div>
  );
};

export default Home;
