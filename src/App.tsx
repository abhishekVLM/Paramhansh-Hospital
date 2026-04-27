import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#0B3D5E",
  primaryLight: "#14567A",
  accent: "#1A8A6E",
  accentLight: "#22B890",
  gold: "#C9A84C",
  bg: "#F7F9FB",
  white: "#FFFFFF",
  text: "#1E2A3A",
  textLight: "#5A6B7E",
  border: "#E2E8F0",
  danger: "#C0392B",
  cardBg: "#FFFFFF",
  heroBg: "linear-gradient(135deg, #0B3D5E 0%, #14567A 40%, #1A6B5A 100%)",
};

const LOGO_URL = "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/PIN_LOGO__1_-removebg-preview.png/:/rs=h:90,cg:true,m/qt=q:95";

const teamMembers = [
  {
    name: "Dr. Sanjay Kumar",
    title: "Founder and Director",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-991885c.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,h:600,cg:true",
    quals: "Head of Department of Neurology, PMCH | MD (Medicine) | DM (Neurology) | MRCP (UK) | Fellowship of the Royal College of Physicians of London",
  },
  {
    name: "Dr. Ajay Kumar",
    title: "",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-79732f1.png/:/cr=t:0%25,l:0%25,w:100%25,h:77.78%25/rs=w:365,h:365,cg:true",
    quals: "MBBS | MD (Microbiology)",
  },
  {
    name: "Dr. Anshuman Kumar",
    title: "",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-e201a2e.png/:/cr=t:0%25,l:2.22%25,w:96.52%25,h:100%25/rs=w:365,h:365,cg:true",
    quals: "Director & Chief Cancer Surgeon | MBBS (Hons.) Gold Medalist – PMCH Patna | MS (Surgery) – AMU Aligarh | MRCS (Edinburgh) U.K. | M.Ch (Oncosurgery) Gold Medalist – GCRI Ahmedabad | MBA (Hospital Administration) | Post Graduation in Quality Management & AHO | LLB (Law) – CCSU Meerut | CCYP (Yoga) – BHU Varanasi",
  },
  {
    name: "Dr. Deepak Kr. Mishra",
    title: "Visiting Doctor",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-75b5252.png/:/cr=t:2.5%25,l:0%25,w:100%25,h:71.88%25/rs=w:365,h:365,cg:true",
    quals: "MBBS (JIPMER) | MS Ortho (JIPMER) | MRCSEd (UK) | M.Ch Ortho (UK) | FICS Ortho (USA) | Hip & Knee Replacement Surgeon",
  },
  {
    name: "Dr. Manish Kumar Dhiraj",
    title: "",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-eae53a8.png/:/cr=t:0%25,l:0%25,w:100%25,h:75%25/rs=w:365,h:365,cg:true",
    quals: "MBBS (Gold Medallist) | MS (Surgery) | M.Ch Neurosurgery (IPGMER Kolkata) | NSSA Fellowship in Endoscopic Spinal Surgery | Minimally Invasive Brain & Spine Surgery Fellowship | Senior Residency in Neurosurgery (GTB Hospital, Delhi) | Associate Professor of Neurosurgery (Adjunct Faculty), ESIC Medical College, Faridabad",
  },
  {
    name: "Dr. Monika Jha",
    title: "Chief of Emergency Medicine",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-e58aa71.png/:/cr=t:0%25,l:18.65%25,w:66.76%25,h:100%25/rs=w:365,h:365,cg:true",
    quals: "Faculty of Emergency Medicine, PMCH | MBBS | MD (Medicine)",
  },
  {
    name: "Dr. Rashmi Soni",
    title: "",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-752ee81.png/:/cr=t:8.66%25,l:0%25,w:100%25,h:56.25%25/rs=w:365,h:365,cg:true",
    quals: "Associate Professor, PMCH Patna | MD (Microbiology)",
  },
  {
    name: "Dr. Setubandhu Tiwary",
    title: "Head of Trauma Surgery",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-9a60ec1.png/:/cr=t:0%25,l:16.54%25,w:70.48%25,h:100%25/rs=w:365,h:365,cg:true",
    quals: "Assistant Professor and Unit Head, Department of Plastic Surgery, PMCH Patna | Fellowship in Arthroscopic Surgery New Delhi | MBBS and D. Ortho from PMCH | FIMS from New Delhi | F.MAS | MS in General Surgery from PMCH Patna | M.Ch in Plastic Surgery from PMCH Patna | Ex. Senior Resident Trauma Centre at AIIMS, New Delhi | Ex. Senior Resident at PGIMER AND DR. R.M.L HOSPITAL, NEW DELHI",
  },
];

const diagnosticTests = [
  {
    name: "Polysomnography (Sleep Study)",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/WhatsApp%20Image%202025-08-11%20at%2019.01.02.jpeg/:/rs=w:388,h:194,cg:true,m/cr=w:388,h:194",
    desc: "A special overnight test where we monitor your body while you sleep. It helps detect sleep problems like loud snoring, breathing stops during sleep (sleep apnea), restless or poor sleep, and daytime tiredness. We use sensors to record brain waves, breathing, heart rate, and body movement while you sleep. It's painless and done in a quiet, comfortable room.",
  },
  {
    name: "Urodynamics",
    img: "https://img1.wsimg.com/isteam/getty/1020849404/:/cr=t:25%25,l:0%25,w:100%25,h:50%25/rs=w:388,h:194,cg:true",
    desc: "This test checks how well your bladder and urinary system are working. It's useful if you have trouble passing urine, urinate too often or too little, leak urine (incontinence), or have nerve-related bladder issues. We use small tubes and machines to measure how your bladder fills and empties.",
  },
  {
    name: "Musculoskeletal Ultrasound (MSK USG)",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/WhatsApp%20Image%202025-08-11%20at%2019.04.21.jpeg/:/cr=t:0%25,l:5.31%25,w:89.38%25,h:100%25/rs=w:388,h:194,cg:true",
    desc: "A safe and painless scan that uses sound waves to see muscles, joints, ligaments, and nerves. Used for muscle pain or swelling, sports injuries, joint problems like arthritis, and nerve entrapment such as carpal tunnel.",
  },
  {
    name: "Echocardiography (Echo)",
    img: "https://img1.wsimg.com/isteam/getty/2151518581/:/rs=w:388,h:194,cg:true,m/cr=w:388,h:194",
    desc: "An ultrasound of your heart that shows how well your heart is pumping blood and how your valves are working. Useful for chest pain, high blood pressure, heart murmurs, and shortness of breath. Completely safe, painless, and takes about 20-30 minutes.",
  },
  {
    name: "Ultrasonography (USG)",
    img: "https://img1.wsimg.com/isteam/getty/858504534/:/rs=w:388,h:194,cg:true,m/cr=w:388,h:194",
    desc: "A general ultrasound test for viewing internal organs like liver, kidney, gallbladder, abdomen, uterus or prostate. It helps find stones, tumours, infections, or other internal problems. No radiation is used, so it's very safe.",
  },
  {
    name: "CT Scan (Brain and Body)",
    img: "https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/WhatsApp%20Image%202025-08-11%20at%2019.01.02-c689eb9.jpeg/:/cr=t:0%25,l:5.31%25,w:89.38%25,h:100%25/rs=w:388,h:194,cg:true",
    desc: "A fast, advanced scan that gives detailed pictures of your brain or other body parts. Used for stroke or head injury, tumors, brain swelling or bleeding, and abdominal pain or trauma. Provides quicker results than many other imaging tests.",
  },
  {
    name: "Nerve Conduction Study (NCS)",
    img: null,
    desc: "This test checks how fast and how strong signals are traveling in your nerves. Helpful for numbness or tingling, nerve pain, muscle weakness, and diabetic neuropathy. Small electrodes are placed on your skin, and a mild electrical signal is passed through your nerves — it's safe and tolerable.",
  },
  {
    name: "EEG / Video EEG",
    img: null,
    desc: "EEG (electroencephalogram) records brain activity through small wires placed on your scalp. Video EEG includes a camera to record your movements during the test. Used to detect seizures or epilepsy, unexplained blackouts or fainting, and brain infections or tumors. It's non-invasive and pain-free.",
  },
  {
    name: "Holter Monitoring",
    img: null,
    desc: "A small device (like a portable ECG) is attached to your chest and worn for 24-48 hours. It records your heart's activity while you go about your daily routine. Used for irregular heartbeat, palpitations, fainting spells, and monitoring pacemaker function.",
  },
  {
    name: "Vertigo & Balance Testing Panel",
    img: "https://img1.wsimg.com/isteam/getty/2191431900/:/cr=t:25%25,l:0%25,w:100%25,h:50%25/rs=w:388,h:194,cg:true",
    desc: "A group of tests that help find the cause of dizziness, vertigo (feeling like the room is spinning), and balance problems or frequent falls. Includes VNG, Audiometry, BERA, Tilt Table Test, and vHIT.",
  },
  {
    name: "Autonomic Function Test",
    img: null,
    desc: "These tests check how your body controls automatic actions like blood pressure, heart rate, sweating, and body temperature. Useful in patients who have fainting, dizziness, or nervous system problems like diabetes-related nerve damage.",
  },
  {
    name: "Fully Automated Biochemistry Lab",
    img: null,
    desc: "Our lab offers blood tests (sugar, liver, kidney, cholesterol, etc.), urine tests, and hormone and thyroid tests. All tests are done on advanced machines for fast, accurate results. 100% automation for quality you can trust.",
  },
];

function AnnouncementBar() {
  return (
    <div style={{
      background: COLORS.gold,
      color: COLORS.primary,
      textAlign: "center",
      padding: "8px 16px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.3px",
    }}>
      Dr Sanjay Kumar has been nominated for the prestigious FRCP.
    </div>
  );
}

function PhoneBar() {
  return (
    <div style={{
      background: COLORS.primary,
      color: COLORS.white,
      textAlign: "center",
      padding: "6px 16px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "13px",
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    }}>
      <a href="tel:+919304508599" style={{ color: COLORS.white, textDecoration: "none" }}>+91 9304508599</a>
      <a href="tel:06122666667" style={{ color: COLORS.white, textDecoration: "none" }}>0612-2666667</a>
    </div>
  );
}

function NavBar({ currentPage, setPage }: { currentPage: string; setPage: (page: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const navLink = (label: string, page: string) => (
    <span
      onClick={() => { setPage(page); setMenuOpen(false); setAboutOpen(false); }}
      style={{
        cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "15px",
        fontWeight: currentPage === page ? 700 : 500,
        color: currentPage === page ? COLORS.accent : COLORS.text,
        padding: "8px 0",
        borderBottom: currentPage === page ? `2px solid ${COLORS.accent}` : "2px solid transparent",
        transition: "all 0.2s",
      }}
    >
      {label}
    </span>
  );

  return (
    <nav style={{
      background: COLORS.white,
      borderBottom: `1px solid ${COLORS.border}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <img
          src={LOGO_URL}
          alt="Paramhans Institute"
          style={{ height: "90px", cursor: "pointer" }}
          onClick={() => setPage("home")}
        />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }} className="desktop-nav">
          {navLink("Home", "home")}
          <div ref={aboutRef} style={{ position: "relative" }}>
            <span
              onClick={() => setAboutOpen(!aboutOpen)}
              style={{
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                fontWeight: ["doctor", "mission", "team"].indexOf(currentPage) !== -1 ? 700 : 500,
                color: ["doctor", "mission", "team"].indexOf(currentPage) !== -1 ? COLORS.accent : COLORS.text,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              About Us
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: aboutOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            {aboutOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "8px 0",
                minWidth: "200px",
                marginTop: "8px",
              }}>
                {[["Dr. Sanjay Kumar", "doctor"], ["Mission & Vision", "mission"], ["Our Team", "team"]].map(([label, pg]) => (
                  <div
                    key={pg}
                    onClick={() => { setPage(pg); setAboutOpen(false); }}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: currentPage === pg ? 600 : 400,
                      color: currentPage === pg ? COLORS.accent : COLORS.text,
                      background: currentPage === pg ? "#f0faf7" : "transparent",
                      transition: "0.15s",
                    }}
                    onMouseEnter={e => (e.target as HTMLElement).style.background = "#f0faf7"}
                    onMouseLeave={e => (e.target as HTMLElement).style.background = currentPage === pg ? "#f0faf7" : "transparent"}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {navLink("All Tests", "tests")}
        </div>

        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ cursor: "pointer", padding: "8px", display: "none" }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {menuOpen ? (
              <path d="M6 6L18 18M6 18L18 6" stroke={COLORS.text} strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M3 7H21M3 12H21M3 17H21" stroke={COLORS.text} strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          background: COLORS.white,
          borderTop: `1px solid ${COLORS.border}`,
          padding: "16px 24px",
        }} className="mobile-menu">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {navLink("Home", "home")}
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: "1px", marginTop: "8px" }}>About Us</div>
            <div style={{ paddingLeft: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {navLink("Dr. Sanjay Kumar", "doctor")}
              {navLink("Mission & Vision", "mission")}
              {navLink("Our Team", "team")}
            </div>
            {navLink("All Tests", "tests")}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

function PaymentNotice() {
  return (
    <div style={{
      background: COLORS.danger,
      color: COLORS.white,
      padding: "12px 24px",
      textAlign: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 600,
      overflow: "hidden",
    }}>
      <div style={{
        animation: "marquee 20s linear infinite",
        whiteSpace: "nowrap",
      }}>
        Please make all payments at the hospital counter with a receipt; No phone or web payments accepted. &nbsp;&nbsp;&nbsp; Please make all payments at the hospital counter with a receipt; No phone or web payments accepted.
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

function Footer({ setPage }: { setPage: (page: string) => void }) {
  return (
    <footer style={{
      background: COLORS.primary,
      color: COLORS.white,
      padding: "48px 24px 24px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginBottom: "32px" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", marginBottom: "16px" }}>
              Paramhans Institute of Neurology
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.7, opacity: 0.85 }}>
              B 18, Besides State Bank of India (Personalised Branch), Near Kendriya Vidyalaya, Kankarbagh, Patna, BR 800020
            </p>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", opacity: 0.85 }}>
              <a href="tel:+919304508599" style={{ color: COLORS.white, textDecoration: "none" }}>+91 9304508599</a>
              <a href="tel:+919693212995" style={{ color: COLORS.white, textDecoration: "none" }}>+91 9693212995</a>
              <a href="mailto:info@pinpat.in" style={{ color: COLORS.white, textDecoration: "none" }}>info@pinpat.in</a>
            </div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Quick Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", opacity: 0.85 }}>
              <span onClick={() => { setPage("home"); window.scrollTo(0,0); }} style={{ cursor: "pointer" }}>Home</span>
              <span onClick={() => { setPage("team"); window.scrollTo(0,0); }} style={{ cursor: "pointer" }}>Our Team</span>
              <span onClick={() => { setPage("tests"); window.scrollTo(0,0); }} style={{ cursor: "pointer" }}>All Tests</span>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "13px",
          opacity: 0.6,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}>
          <div>Copyright © 2025 Paramhans Institute of Neurology - All Rights Reserved.</div>
          <div style={{ fontSize: "12px" }}>Designed by Abhishek Anand</div>
        </div>
      </div>
    </footer>
  );
}

// ====================== REVIEWS ======================

const reviews = [
  {
    name: "Saurav Kumar",
    rating: 1,
    date: "20/4/2026",
    text: "The doctor does not respect patients' time at all. They deliberately make patients wait for hours even after giving appointment times.",
    avatar: "SK",
  },
  {
    name: "Mujammil Hussain",
    rating: 1,
    date: "20/4/2026",
    text: "Extremely bad service during the follow-up appointment. The staff was unresponsive and the waiting time was unreasonable.",
    avatar: "MH",
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    date: "March 2026",
    text: "Dr. Sanjay Kumar is an outstanding neurologist. My father suffered a stroke and was treated here. The team responded immediately, the ICU care was exceptional. My father recovered fully. Forever grateful.",
    avatar: "RK",
  },
  {
    name: "Sunita Devi",
    rating: 5,
    date: "February 2026",
    text: "Best neurology hospital in Patna. I came from Muzaffarpur for epilepsy treatment. Dr. Kumar explained everything very clearly. The staff is very caring and hospital is very clean. Highly recommended.",
    avatar: "SD",
  },
  {
    name: "Amit Sharma",
    rating: 5,
    date: "January 2026",
    text: "I had severe vertigo for months. After coming here, the diagnosis was done properly using advanced tests. Within 3 weeks of treatment I was completely fine. Excellent doctors and facilities.",
    avatar: "AS",
  },
  {
    name: "Priya Singh",
    rating: 5,
    date: "December 2025",
    text: "My mother was diagnosed with neuropathy. The care she received at Paramhans Institute was world class. Dr. Kumar personally monitored her progress. The nursing staff is very attentive and kind.",
    avatar: "PS",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= count ? COLORS.gold : "#E2E8F0"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewsSection() {
  return (
    <section style={{ padding: "72px 24px", background: COLORS.bg }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: COLORS.primary,
            marginBottom: "20px",
          }}>
            Hear from Our Happy Patients!
          </h2>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            padding: "16px 28px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            marginBottom: "16px",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                color: COLORS.textLight,
                marginBottom: "4px",
              }}>Paramhans Institute of Neurology</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "28px",
                  color: COLORS.text,
                  lineHeight: 1,
                }}>4.4</span>
                <StarRating count={4} />
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  color: COLORS.textLight,
                }}>88 Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {reviews.map((r) => (
            <div key={r.name} style={{
              background: COLORS.white,
              borderRadius: "16px",
              padding: "28px",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "15px", color: COLORS.white,
                  flexShrink: 0,
                }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: "15px", color: COLORS.text,
                  }}>{r.name}</div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px", color: COLORS.textLight,
                  }}>{r.date}</div>
                </div>
              </div>
              <StarRating count={r.rating} />
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px", lineHeight: 1.7,
                color: COLORS.textLight,
                fontStyle: "italic",
              }}>"{r.text}"</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href="https://www.google.com/maps/search/Paramhans+Institute+of+Neurology+Patna"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: COLORS.white,
              border: `2px solid ${COLORS.border}`,
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              color: COLORS.primary,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A8A6E"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
            View All Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
}

// ====================== PAGES ======================

function HomePage() {
  return (
    <div>
      {/* Hero - YouTube background video with circle overlay */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "clamp(360px, 55vw, 600px)",
        overflow: "hidden",
        background: "#0B1A2A",
      }}>
        {/* YouTube Background Video */}
        <iframe
          src="https://www.youtube.com/embed/YU5nKw_qc8M?autoplay=1&mute=1&loop=1&playlist=YU5nKw_qc8M&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0"
          allow="autoplay"
          title="Paramhans Institute"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.3)",
            width: "100vw",
            height: "100vh",
            border: "none",
            pointerEvents: "none",
          }}
        />

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

        {/* Circle overlay - bottom right */}
        <div style={{
          position: "absolute",
          bottom: "32px",
          right: "clamp(16px, 6vw, 80px)",
          width: "clamp(180px, 22vw, 260px)",
          height: "clamp(180px, 22vw, 260px)",
          borderRadius: "50%",
          background: "rgba(60,60,60,0.82)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(11px, 1.5vw, 15px)",
            color: COLORS.white,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            lineHeight: 1.5,
          }}>
            Paramhans Institute<br />
            Bringing World-Class<br />
            Neurological Care to<br />
            Patna
          </div>
        </div>

        {/* Call button bottom left */}
        <div style={{
          position: "absolute",
          bottom: "32px",
          left: "clamp(16px, 5vw, 60px)",
        }}>
          <a href="tel:+919304508599" style={{
            background: COLORS.accent,
            color: COLORS.white,
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            display: "inline-block",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}>
            📞 Call Now
          </a>
        </div>
      </div>

      <PaymentNotice />

      {/* About Section */}
      <section style={{
        padding: "72px 24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 4vw, 36px)",
          color: COLORS.primary,
          textAlign: "center",
          marginBottom: "32px",
        }}>
          About Paramhans Institute
        </h2>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          lineHeight: 1.8,
          color: COLORS.textLight,
          textAlign: "center",
        }}>
          Paramhans Institute of Neurology offers specialised care in neurology, trauma, and joint replacement surgery at affordable prices. We treat stroke, epilepsy, neuropathy, and other neurological conditions with advanced diagnostics and expert care. Our trauma unit provides 24/7 emergency services for acute injuries. The orthopaedic team performs total and partial knee and hip replacements using modern techniques. With 62 centrally air-conditioned beds, including ICU, emergency, OPD, general ward, and deluxe rooms, we ensure comfort and care. Led by experienced doctors, we are committed to compassionate, personalised treatment focused on recovery and long-term wellness.
        </p>
      </section>

      {/* Stats */}
      <section style={{
        background: COLORS.primary,
        padding: "48px 24px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "32px",
        }}>
          {[
            ["62+", "Air-Conditioned Beds"],
            ["24/7", "Emergency Services"],
            ["1 Lakh+", "Patients Worldwide"],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "40px",
                color: COLORS.gold,
              }}>{num}</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.8)",
                marginTop: "4px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />
    </div>
  );
}

function DoctorPage() {
  return (
    <div>
      <div style={{
        background: COLORS.heroBg,
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 4vw, 40px)",
          color: COLORS.white,
          marginBottom: "8px",
        }}>
          Redefining Neurological Care for a Healthier Tomorrow
        </h1>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "rgba(255,255,255,0.8)",
          fontSize: "16px",
        }}>@PIN</p>
      </div>

      <section style={{
        padding: "64px 24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <img
            src="https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/blob-991885c.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,h:600,cg:true"
            alt="Dr. Sanjay Kumar"
            style={{
              width: "360px",
              height: "360px",
              borderRadius: "16px",
              objectFit: "cover",
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            }}
          />
          <div style={{ flex: "1 1 400px" }}>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "20px",
              color: COLORS.accent,
              marginBottom: "16px",
            }}>
              The Pulse of Compassion, The Mind of Medicine
            </h3>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.8,
              color: COLORS.textLight,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}>
              <p>At the foundation of our hospital is a vision of healing with humanity — a vision shaped by the remarkable journey of <strong>Dr. Sanjay Kumar</strong>, a pioneer in the field of neurology, a mentor to many, and above all, a compassionate physician.</p>
              <p><strong>Dr. Sanjay Kumar, MBBS, MD (Medicine), DM (Neurology), MRCP (UK)</strong>, Fellowship of the Royal College of Physicians of London, currently serves as the <strong>Head of Neurology at PMCH</strong>, one of the most prestigious medical institutions in India. Over the years, he has emerged as a globally respected neurologist, having attended and spoken at numerous international medical conferences and forums. His expertise has reached across borders, and he has had the honour of consulting over one lakh patients worldwide.</p>
              <p>Despite such an accomplished career, what sets Dr. Kumar apart is not just his vast knowledge, but his deep empathy. For him, each patient is not a case; they are a life, a family, a story that deserves to be heard and respected.</p>
              <p>This hospital was born from his vision: not just to treat illness, but to heal with dignity, compassion, and cutting-edge care. Under his leadership, it stands as a place where science and soul go hand in hand.</p>
              <p>Dr. Sanjay Kumar's contributions to healthcare have been widely recognized, earning him appreciation and honors from many distinguished leaders, including a special recognition by the Honorable Chief Minister of Bihar, Shri Nitish Kumar, for his extraordinary service to the people of the state.</p>
              <p>Today, our hospital carries his legacy forward, offering 24/7 care, world-class facilities, and above all, a culture of empathy that Dr Kumar lives and breathes every day.</p>
              <p style={{ fontStyle: "italic", color: COLORS.primary, fontWeight: 600, marginTop: "8px", fontSize: "16px" }}>
                "Healing begins not with medicine, but with understanding."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MissionPage() {
  return (
    <div>
      <div style={{
        background: COLORS.heroBg,
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 4vw, 40px)",
          color: COLORS.white,
        }}>
          Welcome to Paramhans Institute of Neurology Hospital!
        </h1>
      </div>

      <section style={{
        padding: "64px 24px",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        gap: "48px",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
      }}>
        <img
          src="https://img1.wsimg.com/isteam/ip/ff42b33d-2a2c-4428-a571-2c1fba72f219/WhatsApp%20Image%202025-08-07%20at%2018.04.18.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:400,cg:true"
          alt="Hospital"
          style={{
            width: "320px",
            borderRadius: "16px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
            objectFit: "cover",
          }}
        />
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "24px",
              color: COLORS.primary,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <span style={{ fontSize: "28px" }}>🎯</span> Our Mission
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.8,
              color: COLORS.textLight,
            }}>
              To deliver world-class neurological care in a compassionate and ethical environment using advanced diagnostics, technology, and evidence-based treatments, making high-quality healthcare accessible to every individual in Bihar and beyond.
            </p>
          </div>

          <div style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "24px",
              color: COLORS.primary,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <span style={{ fontSize: "28px" }}>👁️</span> Our Vision
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.8,
              color: COLORS.textLight,
            }}>
              To be the leading centre for neurological care in Eastern India, known for clinical excellence, innovation, and empathy, where every patient feels understood, valued, and well cared for.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamPage() {
  return (
    <div>
      <div style={{
        background: COLORS.heroBg,
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 4vw, 40px)",
          color: COLORS.white,
        }}>
          The Team That Treats You Like Family
        </h1>
      </div>

      <section style={{
        padding: "64px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "28px",
        }}>
          {teamMembers.map((doc, i) => (
            <div key={i} style={{
              background: COLORS.white,
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              padding: "32px 20px 24px",
              textAlign: "center",
            }}>
              <div style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 20px",
                border: `3px solid ${COLORS.border}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                background: COLORS.bg,
              }}>
                {doc.img ? (
                  <img
                    src={doc.img}
                    alt={doc.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "40px", color: COLORS.white,
                  }}>
                    {doc.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "17px",
                color: COLORS.primary,
                marginBottom: "4px",
              }}>
                {doc.name}
              </h3>
              {doc.title && (
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.accent,
                  marginBottom: "10px",
                }}>
                  {doc.title}
                </div>
              )}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                lineHeight: 1.7,
                color: COLORS.textLight,
              }}>
                {doc.quals}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TestsPage() {
  return (
    <div>
      <div style={{
        background: COLORS.heroBg,
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 4vw, 40px)",
          color: COLORS.white,
        }}>
          Diagnostic Tests at Paramhans Institute
        </h1>
      </div>

      <section style={{
        padding: "64px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "28px",
        }}>
          {diagnosticTests.map((test, i) => (
            <div key={i} style={{
              background: COLORS.white,
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
            }}>
              {test.img && (
                <div style={{
                  height: "180px",
                  background: `${COLORS.bg} url(${test.img}) center/cover no-repeat`,
                }} />
              )}
              {!test.img && (
                <div style={{
                  height: "180px",
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4V20M4 12H20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                  </svg>
                </div>
              )}
              <div style={{ padding: "20px" }}>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "18px",
                  color: COLORS.primary,
                  marginBottom: "12px",
                }}>
                  {test.name}
                </h3>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: COLORS.textLight,
                }}>
                  {test.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ====================== MAIN APP ======================

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "doctor": return <DoctorPage />;
      case "mission": return <MissionPage />;
      case "team": return <TeamPage />;
      case "tests": return <TestsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AnnouncementBar />
      <PhoneBar />
      <NavBar currentPage={page} setPage={setPage} />
      <main>
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
