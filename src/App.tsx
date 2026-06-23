import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Phone,
  Mail,
  MapPin,
  Target,
  Eye,
  Calendar,
  Building2,
  Stethoscope,
  UserRound,
  CreditCard,
  FileText,
  Clock,
  MessageCircle,
  RotateCcw,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Award,
  BedDouble,
  Siren,
  Users,
  Quote,
} from "lucide-react";

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

// 8px spacing scale. Use these everywhere instead of arbitrary pixel values.
const SP = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  7: 56,
  8: 64,
  9: 72,
  10: 80,
  12: 96,
};

const LOGO_URL = "/logo192.png";

// ====================== GLOBAL STYLES ======================
// One place for hover states, glass cards, keyframes, responsive padding,
// and reduced-motion handling. Inline styles can't do :hover or @media,
// so the reusable bits live here as classes.
function GlobalStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

      .glass-card {
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow: 0 8px 30px rgba(11, 61, 94, 0.08);
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 0.35s ease, border-color 0.35s ease;
      }
      .glass-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 46px rgba(11, 61, 94, 0.16);
        border-color: rgba(26, 138, 110, 0.45);
      }

      .lift {
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 0.35s ease, border-color 0.35s ease;
      }
      .lift:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 46px rgba(11, 61, 94, 0.16);
        border-color: rgba(26, 138, 110, 0.45);
      }

      .nav-link { transition: color 0.2s ease, border-color 0.2s ease; }
      .nav-link:hover { color: ${COLORS.accent}; }

      .btn-press { transition: transform 0.15s ease, box-shadow 0.25s ease, filter 0.2s ease; }
      .btn-press:hover { transform: translateY(-2px); filter: brightness(1.04); }
      .btn-press:active { transform: translateY(0); }

      .footer-link { transition: opacity 0.2s ease, transform 0.2s ease; }
      .footer-link:hover { opacity: 1 !important; transform: translateX(2px); }

      .carousel-arrow { transition: transform 0.2s ease, background 0.2s ease; }
      .carousel-arrow:hover { transform: translateY(-50%) scale(1.08); background: #ffffff; }

      @keyframes announceScroll {
        0% { transform: translateX(50%); }
        100% { transform: translateX(-50%); }
      }
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      /* Animated hospital name beside the logo */
      @keyframes brandIn {
        from { opacity: 0; transform: translateY(8px); filter: blur(6px); }
        to   { opacity: 1; transform: translateY(0); filter: blur(0); }
      }
      @keyframes brandShimmer {
        to { background-position: 200% center; }
      }
      .brand-name {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 800;
        font-size: clamp(15px, 4.2vw, 22px);
        line-height: 1.12;
        letter-spacing: -0.3px;
        max-width: 300px;
        background: linear-gradient(90deg,
          ${COLORS.primary} 0%, #14567A 20%, ${COLORS.accent} 38%,
          #F4DD92 50%, ${COLORS.accent} 62%, #14567A 80%, ${COLORS.primary} 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation: brandIn 0.8s cubic-bezier(0.22,1,0.36,1) both,
                   brandShimmer 4.5s linear infinite;
      }
      @media (max-width: 380px) {
        .brand-name { display: none; }
      }

      @media (max-width: 768px) {
        .desktop-nav { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .section-pad { padding-top: 56px !important; padding-bottom: 56px !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

// ====================== SCROLL REVEAL ======================
// Fades + lifts content into view once, using IntersectionObserver.
// Respects prefers-reduced-motion by showing content immediately.
function Reveal({
  children,
  delay = 0,
  y = 24,
  style,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Soft accent glow used behind card grids so the glass effect has something
// to refract. Subtle on purpose.
function AccentGlow({
  top,
  left,
  right,
  color = COLORS.accent,
  size = 460,
  opacity = 0.1,
}: {
  top?: string;
  left?: string;
  right?: string;
  color?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: "none",
        filter: "blur(8px)",
      }}
    />
  );
}

// Animates the numeric part of a stat (e.g. "60+", "24/7", "1 Lakh+") from 0
// up to its value when it scrolls into view. Keeps any prefix/suffix intact.
function CountUpStat({ value, style }: { value: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/\d[\d,]*/);
  const target = match ? parseInt(match[0].replace(/,/g, ""), 10) : null;
  const prefix = match ? value.slice(0, match.index ?? 0) : value;
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : "";
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [display, setDisplay] = useState(
    target === null || reduced ? value : prefix + "0" + suffix
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null || reduced) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          const duration = 1500;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            const current = Math.round(eased * target);
            setDisplay(prefix + current.toLocaleString("en-IN") + suffix);
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} style={style}>
      {display}
    </span>
  );
}

const teamMembers = [
  {
    name: "Dr. Sanjay Kumar",
    title: "Founder and Director",
    img: "/Image/team/dr-sanjay-kumar.jpg",
    quals: "Head of Department of Neurology, PMCH | MD (Medicine) | DM (Neurology) | MRCP (UK) | Fellowship of the Royal College of Physicians of London",
  },
  {
    name: "Dr. Ajay Kumar",
    title: "",
    img: "/Image/team/ajay.png",
    quals: "MBBS | MD (Microbiology)",
  },
  {
    name: "Dr. Anshuman Kumar",
    title: "",
    img: "/Image/team/anshu.png",
    quals: "Director & Chief Cancer Surgeon | MBBS (Hons.) Gold Medalist – PMCH Patna | MS (Surgery) – AMU Aligarh | MRCS (Edinburgh) U.K. | M.Ch (Oncosurgery) Gold Medalist – GCRI Ahmedabad | MBA (Hospital Administration) | Post Graduation in Quality Management & AHO | LLB (Law) – CCSU Meerut | CCYP (Yoga) – BHU Varanasi",
  },
  {
    name: "Dr. Deepak Kr. Mishra",
    title: "Visiting Doctor",
    img: "/Image/team/Deepak.png",
    quals: "MBBS (JIPMER) | MS Ortho (JIPMER) | MRCSEd (UK) | M.Ch Ortho (UK) | FICS Ortho (USA) | Hip & Knee Replacement Surgeon",
  },
  {
    name: "Dr. Manish Kumar Dhiraj",
    title: "",
    img: "/Image/team/manish.png",
    quals: "MBBS (Gold Medallist) | MS (Surgery) | M.Ch Neurosurgery (IPGMER Kolkata) | NSSA Fellowship in Endoscopic Spinal Surgery | Minimally Invasive Brain & Spine Surgery Fellowship | Senior Residency in Neurosurgery (GTB Hospital, Delhi) | Associate Professor of Neurosurgery (Adjunct Faculty), ESIC Medical College, Faridabad",
  },
  {
    name: "Dr. Monika Jha",
    title: "Chief of Emergency Medicine",
    img: "/Image/team/monika.png",
    quals: "Faculty of Emergency Medicine, PMCH | MBBS | MD (Medicine)",
  },
  {
    name: "Dr. Rashmi Soni",
    title: "",
    img: "/Image/team/Rashmi.png",
    quals: "Associate Professor, PMCH Patna | MD (Microbiology)",
  },
  {
    name: "Dr. Setubandhu Tiwary",
    title: "Head of Trauma Surgery",
    img: "/Image/team/tiwari.png",
    quals: "Assistant Professor and Unit Head, Department of Plastic Surgery, PMCH Patna | Fellowship in Arthroscopic Surgery New Delhi | MBBS and D. Ortho from PMCH | FIMS from New Delhi | F.MAS | MS in General Surgery from PMCH Patna | M.Ch in Plastic Surgery from PMCH Patna | Ex. Senior Resident Trauma Centre at AIIMS, New Delhi | Ex. Senior Resident at PGIMER AND DR. R.M.L HOSPITAL, NEW DELHI",
  },
];

const diagnosticTests = [
  {
    name: "Polysomnography (Sleep Study)",
    img: "/Image/tests/polysomnography.png",
    desc: "A special overnight test where we monitor your body while you sleep. It helps detect sleep problems like loud snoring, breathing stops during sleep (sleep apnea), restless or poor sleep, and daytime tiredness. We use sensors to record brain waves, breathing, heart rate, and body movement while you sleep. It's painless and done in a quiet, comfortable room.",
  },
  {
    name: "Urodynamics",
    img: "/Image/tests/urodynamics.png",
    desc: "This test checks how well your bladder and urinary system are working. It's useful if you have trouble passing urine, urinate too often or too little, leak urine (incontinence), or have nerve-related bladder issues. We use small tubes and machines to measure how your bladder fills and empties.",
  },
  {
    name: "Musculoskeletal Ultrasound (MSK USG)",
    img: "/Image/tests/msk-usg.png",
    desc: "A safe and painless scan that uses sound waves to see muscles, joints, ligaments, and nerves. Used for muscle pain or swelling, sports injuries, joint problems like arthritis, and nerve entrapment such as carpal tunnel.",
  },
  {
    name: "Echocardiography (Echo)",
    img: "/Image/tests/echo.png",
    desc: "An ultrasound of your heart that shows how well your heart is pumping blood and how your valves are working. Useful for chest pain, high blood pressure, heart murmurs, and shortness of breath. Completely safe, painless, and takes about 20-30 minutes.",
  },
  {
    name: "Ultrasonography (USG)",
    img: "/Image/tests/usg.png",
    desc: "A general ultrasound test for viewing internal organs like liver, kidney, gallbladder, abdomen, uterus or prostate. It helps find stones, tumours, infections, or other internal problems. No radiation is used, so it's very safe.",
  },
  {
    name: "CT Scan (Brain and Body)",
    img: "/Image/tests/ct-scan.png",
    desc: "A fast, advanced scan that gives detailed pictures of your brain or other body parts. Used for stroke or head injury, tumors, brain swelling or bleeding, and abdominal pain or trauma. Provides quicker results than many other imaging tests.",
  },
  {
    name: "Nerve Conduction Study (NCS)",
    img: "/Image/tests/ncs.png",
    desc: "This test checks how fast and how strong signals are traveling in your nerves. Helpful for numbness or tingling, nerve pain, muscle weakness, and diabetic neuropathy. Small electrodes are placed on your skin, and a mild electrical signal is passed through your nerves. It's safe and tolerable.",
  },
  {
    name: "EEG / Video EEG",
    img: "/Image/tests/eeg.png",
    desc: "EEG (electroencephalogram) records brain activity through small wires placed on your scalp. Video EEG includes a camera to record your movements during the test. Used to detect seizures or epilepsy, unexplained blackouts or fainting, and brain infections or tumors. It's non-invasive and pain-free.",
  },
  {
    name: "Holter Monitoring",
    img: "/Image/tests/holter.png",
    desc: "A small device (like a portable ECG) is attached to your chest and worn for 24-48 hours. It records your heart's activity while you go about your daily routine. Used for irregular heartbeat, palpitations, fainting spells, and monitoring pacemaker function.",
  },
  {
    name: "Vertigo & Balance Testing Panel",
    img: "/Image/tests/vertigo.png",
    desc: "A group of tests that help find the cause of dizziness, vertigo (feeling like the room is spinning), and balance problems or frequent falls. Includes VNG, Audiometry, BERA, Tilt Table Test, and vHIT.",
  },
  {
    name: "Autonomic Function Test",
    img: "/Image/tests/autonomic.png",
    desc: "These tests check how your body controls automatic actions like blood pressure, heart rate, sweating, and body temperature. Useful in patients who have fainting, dizziness, or nervous system problems like diabetes-related nerve damage.",
  },
  {
    name: "Fully Automated Biochemistry Lab",
    img: "/Image/tests/lab.png",
    desc: "Our lab offers blood tests (sugar, liver, kidney, cholesterol, etc.), urine tests, and hormone and thyroid tests. All tests are done on advanced machines for fast, accurate results. 100% automation for quality you can trust.",
  },
];

function AnnouncementBar() {
  const message = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: SP[1] }}>
      <Award size={15} strokeWidth={2.4} />
      Dr Sanjay Kumar is now FRCP (London). One of the highest honours a physician can receive, awarded for his dedication to world-class neurological care.
    </span>
  );
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${COLORS.gold} 0%, #D9BC6A 50%, ${COLORS.gold} 100%)`,
        color: COLORS.primary,
        padding: "9px 16px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        overflow: "hidden",
      }}
    >
      <div style={{ animation: "announceScroll 22s linear infinite", whiteSpace: "nowrap", display: "inline-flex", gap: SP[6] }}>
        {message}
        {message}
      </div>
    </div>
  );
}

function PhoneBar() {
  const linkStyle: CSSProperties = {
    color: COLORS.white,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };
  return (
    <div
      style={{
        background: COLORS.primary,
        color: COLORS.white,
        textAlign: "center",
        padding: "7px 16px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "13px",
        display: "flex",
        justifyContent: "center",
        gap: SP[3],
        flexWrap: "wrap",
      }}
    >
      <a href="tel:+919304508599" style={linkStyle}>
        <Phone size={13} /> +91 9304508599
      </a>
      <a href="tel:06122666667" style={linkStyle}>
        <Phone size={13} /> 0612-2666667
      </a>
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
      className="nav-link"
      onClick={() => {
        setPage(page);
        setMenuOpen(false);
        setAboutOpen(false);
      }}
      style={{
        cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "15px",
        fontWeight: currentPage === page ? 700 : 500,
        color: currentPage === page ? COLORS.accent : COLORS.text,
        padding: "8px 0",
        borderBottom: currentPage === page ? `2px solid ${COLORS.accent}` : "2px solid transparent",
      }}
    >
      {label}
    </span>
  );

  return (
    <nav
      style={{
        background: "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => setPage("home")}
          style={{ display: "flex", alignItems: "center", gap: SP[2], cursor: "pointer", minWidth: 0 }}
        >
          <img src={LOGO_URL} alt="" style={{ height: "90px", flexShrink: 0 }} />
          <span className="brand-name">Paramhans Institute of Neurology</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: SP[4] }} className="desktop-nav">
          {navLink("Home", "home")}
          <div ref={aboutRef} style={{ position: "relative" }}>
            <span
              onClick={() => setAboutOpen(!aboutOpen)}
              className="nav-link"
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
              <ChevronDown
                size={15}
                style={{ transform: aboutOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}
              />
            </span>
            {aboutOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "12px",
                  boxShadow: "0 12px 32px rgba(11,61,94,0.14)",
                  padding: "8px 0",
                  minWidth: "210px",
                  marginTop: "10px",
                  overflow: "hidden",
                }}
              >
                {[
                  ["Dr. Sanjay Kumar", "doctor"],
                  ["Mission & Vision", "mission"],
                  ["Our Team", "team"],
                ].map(([label, pg]) => (
                  <div
                    key={pg}
                    onClick={() => {
                      setPage(pg);
                      setAboutOpen(false);
                    }}
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
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#f0faf7")}
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = currentPage === pg ? "#f0faf7" : "transparent")
                    }
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
          style={{ cursor: "pointer", padding: "8px", display: "none", alignItems: "center" }}
          className="mobile-menu-btn"
        >
          {menuOpen ? <X size={26} color={COLORS.text} /> : <Menu size={26} color={COLORS.text} />}
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            background: COLORS.white,
            borderTop: `1px solid ${COLORS.border}`,
            padding: "16px 24px",
          }}
          className="mobile-menu"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: SP[2] }}>
            {navLink("Home", "home")}
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: COLORS.textLight,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: "8px",
              }}
            >
              About Us
            </div>
            <div style={{ paddingLeft: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {navLink("Dr. Sanjay Kumar", "doctor")}
              {navLink("Mission & Vision", "mission")}
              {navLink("Our Team", "team")}
            </div>
            {navLink("All Tests", "tests")}
          </div>
        </div>
      )}
    </nav>
  );
}

function PaymentNotice() {
  return (
    <div
      style={{
        background: COLORS.danger,
        color: COLORS.white,
        padding: "12px 24px",
        textAlign: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        overflow: "hidden",
      }}
    >
      <div style={{ animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
        Please make all payments at the hospital counter with a receipt; No phone or web payments accepted. &nbsp;&nbsp;&nbsp;
        Please make all payments at the hospital counter with a receipt; No phone or web payments accepted.
      </div>
    </div>
  );
}

function Footer({ setPage }: { setPage: (page: string) => void }) {
  const contactStyle: CSSProperties = {
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };
  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: "#0E4A6F", padding: `${SP[6]}px 24px ${SP[4]}px` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: SP[5] }}>
            <div style={{ flex: "1 1 300px" }}>
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "22px",
                  marginBottom: SP[2],
                  color: COLORS.gold,
                }}
              >
                Paramhans Institute of Neurology
              </div>
              <a
                href="https://www.google.com/maps/place/?q=place_id:ChIJjTGCTABZ7TkRkKrPlJJXHvQ"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <MapPin size={18} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span style={{ borderBottom: "1px dashed rgba(255,255,255,0.4)" }}>
                  B 18, Besides State Bank of India (Personalised Branch), Near Kendriya Vidyalaya, Kankarbagh, Patna, BR 800020
                </span>
              </a>
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: SP[2],
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: COLORS.gold,
                }}
              >
                Contact
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                <a href="tel:+919304508599" className="footer-link" style={contactStyle}>
                  <Phone size={15} /> +91 9304508599
                </a>
                <a href="tel:+919693212995" className="footer-link" style={contactStyle}>
                  <Phone size={15} /> +91 9693212995
                </a>
                <a href="mailto:info@pinpat.in" className="footer-link" style={contactStyle}>
                  <Mail size={15} /> info@pinpat.in
                </a>
              </div>
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: SP[2],
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: COLORS.gold,
                }}
              >
                Quick Links
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <span className="footer-link" onClick={() => { setPage("home"); window.scrollTo(0, 0); }} style={{ cursor: "pointer", opacity: 0.85 }}>Home</span>
                <span className="footer-link" onClick={() => { setPage("team"); window.scrollTo(0, 0); }} style={{ cursor: "pointer", opacity: 0.85 }}>Our Team</span>
                <span className="footer-link" onClick={() => { setPage("tests"); window.scrollTo(0, 0); }} style={{ cursor: "pointer", opacity: 0.85 }}>All Tests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#071E2E",
          padding: "16px 24px",
          textAlign: "center",
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div>Copyright © 2026 Paramhans Institute of Neurology - All Rights Reserved.</div>
        <div style={{ fontSize: "12px" }}>Built & Maintained by Abhishek Anand</div>
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
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= count ? COLORS.gold : "#E2E8F0"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewsSection() {
  const visibleReviews = reviews.filter((r) => r.rating >= 4);
  return (
    <section
      className="section-pad"
      style={{
        padding: `${SP[10]}px 24px`,
        background: "linear-gradient(180deg, #F7F9FB 0%, #EAF2F7 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AccentGlow top="10%" right="-6%" color={COLORS.accent} opacity={0.08} />
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: SP[6] }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4.4vw, 40px)",
                color: COLORS.primary,
                marginBottom: SP[3],
                letterSpacing: "-0.5px",
              }}
            >
              Hear from Our Happy Patients
            </h2>
            <div
              className="glass-card"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: SP[2],
                borderRadius: "16px",
                padding: "16px 28px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "13px",
                    color: COLORS.textLight,
                    marginBottom: "4px",
                  }}
                >
                  Paramhans Institute of Neurology
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: COLORS.text, lineHeight: 1 }}>4.4</span>
                  <StarRating count={4} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: COLORS.textLight }}>88 Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: SP[3],
            alignItems: "start",
          }}
        >
          {visibleReviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <div
                className="glass-card"
                style={{
                  borderRadius: "20px",
                  padding: SP[4],
                  display: "flex",
                  flexDirection: "column",
                  gap: SP[2],
                  position: "relative",
                }}
              >
                <Quote size={28} color={COLORS.accent} style={{ opacity: 0.18, position: "absolute", top: 20, right: 20 }} />
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: COLORS.white,
                      flexShrink: 0,
                    }}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: COLORS.text }}>{r.name}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", color: COLORS.textLight }}>{r.date}</div>
                  </div>
                </div>
                <StarRating count={r.rating} />
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", lineHeight: 1.7, color: COLORS.textLight, fontStyle: "italic" }}>
                  "{r.text}"
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div style={{ textAlign: "center", marginTop: SP[5] }}>
            <a
              href="https://www.google.com/maps/place/?q=place_id:ChIJjTGCTABZ7TkRkKrPlJJXHvQ"
              target="_blank"
              rel="noreferrer"
              className="btn-press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: COLORS.white,
                border: `2px solid ${COLORS.border}`,
                padding: "13px 28px",
                borderRadius: "10px",
                textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: COLORS.primary,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <MapPin size={20} color={COLORS.accent} />
              View All Google Reviews
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ====================== MEDIA CAROUSEL ======================

function MediaCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const media: Array<{ type: "image" | "video"; src?: string; id?: string; title: string }> = [
    { type: "image", src: "/Image/hospital-1.png", title: "Paramhans Institute of Neurology" },
    { type: "video", id: "X6-H1NMgC5A", title: "Dr Sanjay Kumar awarded FRCP (London)" },
    // Add more items here:
    // { type: "image", src: "/Image/hospital-2.png", title: "Our Facilities" },
    // { type: "video", id: "YOUTUBE_ID", title: "Video Title" },
  ];

  useEffect(() => {
    if (media.length <= 1) return;
    const timer = setInterval(() => {
      if (media[current].type === "video") return;
      setIsAnimating(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % media.length);
        setIsAnimating(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, media.length]);

  const goTo = (index: number) => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(true);
    }, 300);
  };

  const item = media[current];

  return (
    <div style={{ width: "100%", flex: "1 1 400px", maxWidth: "540px", margin: "0" }}>
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(11,61,94,0.18)",
          position: "relative",
          background: "#0B1A2A",
        }}
      >
        <div
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "scale(1)" : "scale(0.95)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {item.type === "image" ? (
            <img src={item.src} alt={item.title} style={{ width: "100%", height: "380px", objectFit: "cover", display: "block" }} />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${item.id}?rel=0&modestbranding=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "380px", border: "none", display: "block" }}
            />
          )}
        </div>

        {/* Title overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 16px 12px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
          }}
        >
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "white", textAlign: "center" }}>
            {item.title}
          </div>
        </div>

        {/* Arrows */}
        {media.length > 1 && (
          <>
            <div
              className="carousel-arrow"
              onClick={() => goTo((current - 1 + media.length) % media.length)}
              style={{
                position: "absolute",
                top: "50%",
                left: "8px",
                transform: "translateY(-50%)",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: COLORS.primary,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <ChevronLeft size={22} />
            </div>
            <div
              className="carousel-arrow"
              onClick={() => goTo((current + 1) % media.length)}
              style={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: COLORS.primary,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <ChevronRight size={22} />
            </div>
          </>
        )}
      </div>

      {/* Dots */}
      {media.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
          {media.map((m, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: current === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: current === i ? COLORS.gold : COLORS.border,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}

      {/* Media type indicators */}
      {media.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px" }}>
          {media.map((m, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px",
                color: current === i ? COLORS.primary : COLORS.textLight,
                cursor: "pointer",
                fontWeight: current === i ? 700 : 400,
                transition: "all 0.3s",
              }}
            >
              {m.type === "video" ? <Video size={13} /> : <ImageIcon size={13} />}
              {m.title.slice(0, 20)}
              {m.title.length > 20 ? "..." : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ====================== PAGES ======================

function HomePage() {
  const stats: Array<{ icon: LucideIcon; num: string; label: string }> = [
    { icon: BedDouble, num: "60+", label: "Air-Conditioned Beds" },
    { icon: Siren, num: "24/7", label: "Emergency Services" },
    { icon: Users, num: "1,00,000+", label: "Patients Worldwide" },
  ];

  return (
    <div>
      {/* Hero - YouTube background video with circle overlay */}
      <div style={{ position: "relative", width: "100%", height: "clamp(360px, 55vw, 600px)", overflow: "hidden", background: "#0B1A2A" }}>
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

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(11,26,42,0.45) 100%)" }} />

        {/* Circle overlay - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-17px",
            right: "clamp(0px, 6vw, 80px)",
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
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(11px, 1.5vw, 15px)",
              color: COLORS.white,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              lineHeight: 1.5,
            }}
          >
            Paramhans Institute
            <br />
            Bringing World-Class
            <br />
            Neurological Care to
            <br />
            Patna
          </div>
        </div>

        {/* Call button bottom left */}
        <div style={{ position: "absolute", bottom: "32px", left: "clamp(16px, 5vw, 60px)" }}>
          <a
            href="tel:+919304508599"
            className="btn-press"
            style={{
              background: COLORS.accent,
              color: COLORS.white,
              padding: "13px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <Phone size={18} /> Call Now
          </a>
        </div>
      </div>

      <PaymentNotice />

      {/* About Section */}
      <section className="section-pad" style={{ padding: `${SP[10]}px 24px`, background: "linear-gradient(180deg, #EDF4F8 0%, #F7F9FB 100%)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4.4vw, 40px)",
                color: COLORS.primary,
                textAlign: "center",
                marginBottom: SP[6],
                letterSpacing: "-0.5px",
              }}
            >
              About Paramhans Institute
            </h2>
          </Reveal>
          <div style={{ display: "flex", gap: SP[6], alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <Reveal y={32} style={{ flex: "1 1 400px", maxWidth: "540px" }}>
              <MediaCarousel />
            </Reveal>
            <Reveal delay={120} style={{ flex: "1 1 400px" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16.5px", lineHeight: 1.85, color: COLORS.textLight }}>
                Paramhans Institute of Neurology offers specialised care in neurology, trauma, and joint replacement surgery at affordable prices. We treat
                stroke, epilepsy, neuropathy, and other neurological conditions with advanced diagnostics and expert care. Our trauma unit provides 24/7
                emergency services for acute injuries. The orthopaedic team performs total and partial knee and hip replacements using modern techniques.
                With 62 centrally air-conditioned beds, including ICU, emergency, OPD, general ward, and deluxe rooms, we ensure comfort and care. Led by
                experienced doctors, we are committed to compassionate, personalised treatment focused on recovery and long-term wellness.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="section-pad"
        style={{
          padding: `${SP[8]}px 24px`,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0E4A6F 55%, #14567A 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AccentGlow top="-30%" left="-5%" color={COLORS.accentLight} opacity={0.18} size={420} />
        <AccentGlow top="20%" right="-8%" color={COLORS.gold} opacity={0.14} size={380} />
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: SP[5],
            position: "relative",
          }}
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 120} style={{ flex: "1 1 200px" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "16px",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(160deg, rgba(201,168,76,0.20), rgba(255,255,255,0.04))",
                      border: "1px solid rgba(201,168,76,0.38)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon size={28} color={COLORS.gold} strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "48px",
                      lineHeight: 1,
                      backgroundImage: "linear-gradient(135deg, #F4DD92 0%, #C9A84C 55%, #AD8A38 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      filter: "drop-shadow(0 2px 12px rgba(201,168,76,0.35))",
                    }}
                  >
                    <CountUpStat value={s.num} />
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.9)", marginTop: "10px", letterSpacing: "0.4px" }}>
                    {s.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />
    </div>
  );
}

function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ background: COLORS.heroBg, padding: `${SP[9]}px 24px`, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <AccentGlow top="-40%" right="-5%" color={COLORS.accentLight} opacity={0.16} size={420} />
      <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
        <Reveal y={18}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4.6vw, 42px)", color: COLORS.white, marginBottom: subtitle ? "10px" : 0, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal y={18} delay={80}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(255,255,255,0.82)", fontSize: "16px", fontWeight: 700 }}>{subtitle}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function DoctorPage() {
  return (
    <div>
      <PageHero title="Redefining Neurological Care for a Healthier Tomorrow" subtitle="@PIN" />

      <section className="section-pad" style={{ padding: `${SP[8]}px 24px`, maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: SP[6], alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
          <Reveal y={32}>
            <img
              src="/Image/drkumar.jpg"
              alt="Dr.Sanjay Kumar"
              style={{
                width: "360px",
                maxWidth: "100%",
                height: "360px",
                borderRadius: "20px",
                objectFit: "cover",
                objectPosition: "top",
                boxShadow: "0 16px 44px rgba(11,61,94,0.18)",
              }}
            />
          </Reveal>
          <Reveal delay={120} style={{ flex: "1 1 400px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: COLORS.accent, marginBottom: SP[2] }}>
              The Pulse of Compassion, The Mind of Medicine
            </h3>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15.5px", lineHeight: 1.85, color: COLORS.textLight, display: "flex", flexDirection: "column", gap: SP[2] }}>
              <p>
                At the foundation of our hospital is a vision of healing with humanity – a vision shaped by the remarkable journey of{" "}
                <strong>Dr. Sanjay Kumar</strong>, a pioneer in the field of neurology, a mentor to many, and above all, a compassionate physician.
              </p>
              <p>
                <strong>Dr. Sanjay Kumar, MBBS, MD (Medicine), DM (Neurology), MRCP (UK)</strong>, Fellowship of the Royal College of Physicians of London,
                currently serves as the <strong>Head of Neurology at PMCH</strong>, one of the most prestigious medical institutions in India. Over the years,
                he has emerged as a globally respected neurologist, having attended and spoken at numerous international medical conferences and forums. His
                expertise has reached across borders, and he has had the honour of consulting over one lakh patients worldwide.
              </p>
              <p>
                Despite such an accomplished career, what sets Dr. Kumar apart is not just his vast knowledge, but his deep empathy. For him, each patient is
                not a case; they are a life, a family, a story that deserves to be heard and respected.
              </p>
              <p>
                This hospital was born from his vision: not just to treat illness, but to heal with dignity, compassion, and cutting-edge care. Under his
                leadership, it stands as a place where science and soul go hand in hand.
              </p>
              <p>
                Dr. Sanjay Kumar's contributions to healthcare have been widely recognized, earning him appreciation and honors from many distinguished
                leaders, including a special recognition by the Honorable Chief Minister of Bihar, Shri Nitish Kumar, for his extraordinary service to the
                people of the state.
              </p>
              <p>
                Today, our hospital carries his legacy forward, offering 24/7 care, world-class facilities, and above all, a culture of empathy that Dr Kumar
                lives and breathes every day.
              </p>
              <p style={{ fontStyle: "italic", color: COLORS.primary, fontWeight: 600, marginTop: "8px", fontSize: "16px" }}>
                "Healing begins not with medicine, but with understanding."
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function MissionPage() {
  const cards: Array<{ icon: LucideIcon; title: string; body: string }> = [
    {
      icon: Target,
      title: "Our Mission",
      body: "To deliver world-class neurological care in a compassionate and ethical environment using advanced diagnostics, technology, and evidence-based treatments, making high-quality healthcare accessible to every individual in Bihar and beyond.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      body: "To be the leading centre for neurological care in Eastern India, known for clinical excellence, innovation, and empathy, where every patient feels understood, valued, and well cared for.",
    },
  ];

  return (
    <div>
      <PageHero title="Welcome to Paramhans Institute of Neurology Hospital!" />

      <section
        className="section-pad"
        style={{
          padding: `${SP[8]}px 24px`,
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          gap: SP[6],
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Reveal y={32}>
          <img
            src="/Image/hospital-building.jpg"
            alt="Paramhans Institute of Neurology building"
            style={{ width: "320px", maxWidth: "100%", borderRadius: "20px", boxShadow: "0 16px 44px rgba(11,61,94,0.14)", objectFit: "cover" }}
          />
        </Reveal>
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: SP[5] }}>
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 120}>
                <div className="glass-card" style={{ borderRadius: "20px", padding: SP[4] }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: SP[2] }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={24} color={COLORS.white} strokeWidth={2} />
                    </div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: COLORS.primary }}>{c.title}</div>
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15.5px", lineHeight: 1.8, color: COLORS.textLight }}>{c.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TeamCard({ doc, delay }: { doc: (typeof teamMembers)[number]; delay: number }) {
  const [flipped, setFlipped] = useState(false);

  const faceBase: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "20px",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    background: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 8px 30px rgba(11, 61, 94, 0.10)",
  };

  const flipHint: CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: COLORS.textLight,
    letterSpacing: "0.3px",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  };

  return (
    <Reveal delay={delay}>
      <div
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: "1400px", height: "380px", cursor: "pointer" }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT: circular photo + name, centered */}
          <div style={{ ...faceBase, alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 22px" }}>
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 18px",
                border: `3px solid ${COLORS.white}`,
                boxShadow: "0 8px 24px rgba(11,61,94,0.14)",
                background: COLORS.bg,
                flexShrink: 0,
              }}
            >
              {doc.img ? (
                <img
                  src={doc.img}
                  alt={doc.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "48px",
                    color: COLORS.white,
                  }}
                >
                  {doc.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: COLORS.primary, marginBottom: doc.title ? "2px" : "8px" }}>
              {doc.name}
            </h3>
            {doc.title && (
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: COLORS.accent, marginBottom: "8px" }}>
                {doc.title}
              </div>
            )}
            <div style={{ ...flipHint, justifyContent: "center" }}>
              <RotateCcw size={12} /> Tap for details
            </div>
          </div>

          {/* BACK: full credentials, scrolls if long so nothing is cut */}
          <div
            style={{
              ...faceBase,
              transform: "rotateY(180deg)",
              background: "linear-gradient(160deg, #ffffff 0%, #eef5f9 100%)",
              padding: "22px 20px 18px",
            }}
          >
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: COLORS.primary, marginBottom: doc.title ? "2px" : "10px", flexShrink: 0 }}>
              {doc.name}
            </h3>
            {doc.title && (
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: COLORS.accent, marginBottom: "10px", flexShrink: 0 }}>
                {doc.title}
              </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", lineHeight: 1.65, color: COLORS.text, margin: 0 }}>
                {doc.quals}
              </p>
            </div>
            <div style={{ ...flipHint, marginTop: "12px", flexShrink: 0 }}>
              <RotateCcw size={12} /> Tap to flip back
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TeamPage() {
  return (
    <div>
      <PageHero title="The Team That Treats You Like Family" />

      <section className="section-pad" style={{ padding: `${SP[8]}px 24px`, maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        <AccentGlow top="6%" left="-6%" color={COLORS.accent} opacity={0.06} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: SP[3], position: "relative" }}>
          {teamMembers.map((doc, i) => (
            <TeamCard key={i} doc={doc} delay={(i % 3) * 90} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TestsPage() {
  return (
    <div>
      <PageHero title="Diagnostic Tests at Paramhans Institute" />

      <section className="section-pad" style={{ padding: `${SP[8]}px 24px`, maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        <AccentGlow top="4%" right="-6%" color={COLORS.accent} opacity={0.06} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: SP[3], position: "relative" }}>
          {diagnosticTests.map((test, i) => (
            <Reveal key={i} delay={(i % 3) * 90}>
              <div
                className="glass-card"
                style={{ borderRadius: "20px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}
              >
                {test.img && (
                  <div style={{ height: "180px", overflow: "hidden", background: `linear-gradient(135deg, ${COLORS.bg}, #dce6f0)` }}>
                    <img
                      src={test.img}
                      alt={test.name}
                      loading="lazy"
                      onLoad={(e) => ((e.target as HTMLImageElement).style.opacity = "1")}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0, transition: "opacity 0.4s ease" }}
                    />
                  </div>
                )}
                {!test.img && (
                  <div style={{ height: "180px", background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Stethoscope size={44} color="rgba(255,255,255,0.5)" />
                  </div>
                )}
                <div style={{ padding: SP[3] }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: COLORS.primary, marginBottom: "12px" }}>{test.name}</h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", lineHeight: 1.7, color: COLORS.textLight }}>{test.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ====================== CHATBOT ======================

type FAQOption = { icon: LucideIcon; question: string; answer: string };
type FAQLang = { greeting: string; language: string; options: FAQOption[] };

const chatbotFAQ: { en: FAQLang; hi: FAQLang } = {
  en: {
    greeting: "Hello! How can I help you today?",
    language: "English",
    options: [
      {
        icon: Calendar,
        question: "Book an Appointment",
        answer: "To book an appointment, please call us directly:\n+91 9304508599\n0612-2666667\n\nOur team will help you schedule your visit.",
      },
      {
        icon: MapPin,
        question: "Hospital Location",
        answer: "We are located at:\nB 18, Besides State Bank of India (Personalised Branch), Near Kendriya Vidyalaya, Kankarbagh, Patna, BR 800020\n\nOpen 24/7",
      },
      {
        icon: Stethoscope,
        question: "What tests are available?",
        answer: "We offer: EEG, NCS, CT Scan, Echocardiography, Polysomnography, Urodynamics, MSK Ultrasound, Holter Monitoring, Vertigo Testing, Autonomic Function Test, and a Fully Automated Biochemistry Lab.\n\nCall us for test pricing: +91 9304508599",
      },
      {
        icon: UserRound,
        question: "About Dr. Sanjay Kumar",
        answer: "Dr. Sanjay Kumar is the Founder & Director.\nQualifications: MBBS, MD (Medicine), DM (Neurology), MRCP (UK), FRCP London.\nHe is the Head of Neurology at PMCH and has consulted over 1 Lakh patients worldwide.",
      },
      {
        icon: CreditCard,
        question: "Payment Information",
        answer: "Important: Please make all payments ONLY at the hospital counter with a receipt.\n\nNo phone or web payments are accepted. Do not pay through any online link or phone call.",
      },
      {
        icon: FileText,
        question: "File a Complaint",
        answer: "We're sorry to hear about your experience. Please send your complaint to:\n\ninfo@pinpat.in\n\nOur team will respond within 24-48 hours.",
      },
      {
        icon: Clock,
        question: "OPD Timings",
        answer: "Our hospital is open 24/7 for emergencies.\n\nFor OPD appointments, please call:\n+91 9304508599\n0612-2666667",
      },
    ],
  },
  hi: {
    greeting: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
    language: "हिंदी",
    options: [
      {
        icon: Calendar,
        question: "अपॉइंटमेंट बुक करें",
        answer: "अपॉइंटमेंट बुक करने के लिए, कृपया हमें सीधे कॉल करें:\n+91 9304508599\n0612-2666667\n\nहमारी टीम आपकी विजिट शेड्यूल करने में मदद करेगी।",
      },
      {
        icon: MapPin,
        question: "अस्पताल का पता",
        answer: "हमारा पता:\nB 18, भारतीय स्टेट बैंक (पर्सनलाइज्ड ब्रांच) के बगल में, केंद्रीय विद्यालय के पास, कंकड़बाग, पटना, बिहार 800020\n\n24/7 खुला है",
      },
      {
        icon: Stethoscope,
        question: "कौन-कौन से टेस्ट उपलब्ध हैं?",
        answer: "हम ये टेस्ट करते हैं: EEG, NCS, CT Scan, इकोकार्डियोग्राफी, पॉलीसोम्नोग्राफी, यूरोडायनामिक्स, MSK अल्ट्रासाउंड, होल्टर मॉनिटरिंग, वर्टिगो टेस्टिंग, ऑटोनोमिक फंक्शन टेस्ट, और बायोकेमिस्ट्री लैब।\n\nटेस्ट की कीमत के लिए कॉल करें: +91 9304508599",
      },
      {
        icon: UserRound,
        question: "डॉ. संजय कुमार के बारे में",
        answer: "डॉ. संजय कुमार संस्थापक और निदेशक हैं।\nयोग्यता: MBBS, MD (मेडिसिन), DM (न्यूरोलॉजी), MRCP (UK), FRCP लंदन।\nवे PMCH में न्यूरोलॉजी विभाग के प्रमुख हैं और दुनिया भर में 1 लाख से अधिक मरीजों को परामर्श दे चुके हैं।",
      },
      {
        icon: CreditCard,
        question: "भुगतान जानकारी",
        answer: "महत्वपूर्ण: कृपया सभी भुगतान केवल अस्पताल काउंटर पर रसीद के साथ करें।\n\nकोई फोन या वेब भुगतान स्वीकार नहीं किया जाता। किसी भी ऑनलाइन लिंक या फोन कॉल से भुगतान न करें।",
      },
      {
        icon: FileText,
        question: "शिकायत दर्ज करें",
        answer: "आपकी समस्या के लिए हमें खेद है। कृपया अपनी शिकायत भेजें:\n\ninfo@pinpat.in\n\nहमारी टीम 24-48 घंटे में जवाब देगी।",
      },
      {
        icon: Clock,
        question: "OPD समय",
        answer: "हमारा अस्पताल इमरजेंसी के लिए 24/7 खुला है।\n\nOPD अपॉइंटमेंट के लिए कॉल करें:\n+91 9304508599\n0612-2666667",
      },
    ],
  },
};

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faq = chatbotFAQ[lang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = (selectedLang: "en" | "hi") => {
    setLang(selectedLang);
    setStarted(true);
    setMessages([{ from: "bot", text: chatbotFAQ[selectedLang].greeting }]);
  };

  const handleOption = (option: FAQOption) => {
    setMessages((prev) => [...prev, { from: "user", text: option.question }, { from: "bot", text: option.answer }]);
  };

  const resetChat = () => {
    setStarted(false);
    setMessages([]);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(11,61,94,0.35)",
          zIndex: 1000,
          transition: "transform 0.2s",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
      >
        {isOpen ? <X size={26} color="white" /> : <MessageCircle size={28} color="white" />}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "clamp(300px, 90vw, 380px)",
            height: "500px",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 16px 50px rgba(11,61,94,0.28)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              padding: "16px 20px",
              color: COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "16px" }}>Paramhans Institute</div>
              <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
                {started ? (lang === "en" ? "We typically reply instantly" : "हम तुरंत जवाब देते हैं") : "Choose your language"}
              </div>
            </div>
            {started && (
              <div
                onClick={resetChat}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.2)",
                  padding: "5px 11px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={12} /> {lang === "en" ? "Restart" : "पुनः शुरू"}
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "#f8f9fb" }}>
            {!started ? (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                  }}
                >
                  <Building2 size={32} color={COLORS.white} />
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: COLORS.primary, marginBottom: "8px" }}>Welcome / स्वागत है</div>
                <div style={{ fontSize: "13px", color: COLORS.textLight, marginBottom: "24px" }}>Please choose your language / अपनी भाषा चुनें</div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    onClick={() => startChat("en")}
                    className="btn-press"
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: `2px solid ${COLORS.primary}`,
                      background: COLORS.white,
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => startChat("hi")}
                    className="btn-press"
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: `2px solid ${COLORS.accent}`,
                      background: COLORS.white,
                      color: COLORS.accent,
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                    <div
                      style={{
                        background: msg.from === "user" ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` : COLORS.white,
                        color: msg.from === "user" ? COLORS.white : COLORS.text,
                        padding: "12px 16px",
                        borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        whiteSpace: "pre-line",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {messages.length <= 1 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                    {faq.options.map((opt, i) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => handleOption(opt)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: COLORS.white,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: "12px",
                            padding: "11px 14px",
                            fontSize: "13px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: COLORS.primary,
                            cursor: "pointer",
                            textAlign: "left",
                            fontWeight: 500,
                            transition: "all 0.15s",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = COLORS.accent;
                            e.currentTarget.style.background = "#f0faf7";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = COLORS.border;
                            e.currentTarget.style.background = COLORS.white;
                          }}
                        >
                          <Icon size={17} color={COLORS.accent} style={{ flexShrink: 0 }} />
                          {opt.question}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => setMessages([{ from: "bot", text: faq.greeting }])}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: COLORS.white,
                      border: `2px solid ${COLORS.accent}`,
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: COLORS.accent,
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: 700,
                      marginTop: "4px",
                    }}
                  >
                    <MessageCircle size={16} /> {lang === "en" ? "More Questions?" : "और सवाल पूछें?"}
                  </button>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.white, display: "flex", gap: "8px", justifyContent: "center" }}>
            <a
              href="tel:+919304508599"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px",
                borderRadius: "10px",
                background: COLORS.accent,
                color: COLORS.white,
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Phone size={15} /> {lang === "en" ? "Call Now" : "कॉल करें"}
            </a>
            <a
              href="mailto:info@pinpat.in"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px",
                borderRadius: "10px",
                background: COLORS.primary,
                color: COLORS.white,
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Mail size={15} /> {lang === "en" ? "Email Us" : "ईमेल करें"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// ====================== MAIN APP ======================

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "doctor":
        return <DoctorPage />;
      case "mission":
        return <MissionPage />;
      case "team":
        return <TeamPage />;
      case "tests":
        return <TestsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <GlobalStyles />
      <AnnouncementBar />
      <PhoneBar />
      <NavBar currentPage={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
      <ChatBot />
    </div>
  );
}
