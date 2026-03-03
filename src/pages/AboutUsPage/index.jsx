import React, { useEffect, useRef, useState } from 'react';

// --- Reusable Components ---
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SubscriptionSection from '../HomePage/components/SubscriptionSection';

// --- Data ---
const aboutUsContent = [
  {
    title: 'Our Story',
    icon: '📖',
    year: '2005',
    text: "Founded in 2005, Mitronix began as a small startup with a big vision: to revolutionize the electronics industry. Over the years, we've grown into a global leader, known for our commitment to quality, innovation, and customer satisfaction. Our journey has been marked by significant milestones, including the development of groundbreaking technologies and the expansion of our product line to meet the evolving needs of our customers.",
  },
  {
    title: 'Our Mission',
    icon: '🎯',
    year: '2010',
    text: 'Our mission is to empower individuals and businesses with innovative electronic solutions that enhance their lives and drive progress. We strive to create products that are not only technologically advanced but also user-friendly, reliable, and sustainable. By focusing on research and development, we aim to stay ahead of the curve and continue delivering exceptional value to our customers.',
  },
  {
    title: 'Our Vision',
    icon: '🔭',
    year: '2025',
    text: 'Our vision is to be the leading provider of electronic solutions worldwide, recognized for our innovation, quality, and commitment to sustainability. We envision a future where our products seamlessly integrate into everyday life, making technology accessible to everyone. By fostering a culture of creativity and collaboration, we aim to inspire the next generation of innovators and shape the future of electronics.',
  },
];

const stats = [
  { number: '20+', label: 'Years of Excellence' },
  { number: '5M+', label: 'Happy Customers' },
  { number: '150+', label: 'Countries Served' },
  { number: '500+', label: 'Products Launched' },
];

const teamMembers = [
  { name: 'Alex Chen', role: 'CEO & Co-Founder', initials: 'AC' },
  { name: 'Priya Sharma', role: 'Chief Technology Officer', initials: 'PS' },
  { name: 'Marcus Webb', role: 'Head of Innovation', initials: 'MW' },
  { name: 'Lena Fischer', role: 'Chief Design Officer', initials: 'LF' },
];

const values = [
  { icon: '⚡', title: 'Innovation', desc: 'Pushing boundaries every day' },
  { icon: '🛡️', title: 'Quality', desc: 'Zero compromise on standards' },
  { icon: '🌱', title: 'Sustainability', desc: 'Building a greener tomorrow' },
  { icon: '🤝', title: 'Trust', desc: 'Relationships built to last' },
];

const logoBanner = 'src/assets/MILTRONIX APP DESIGN 3.png';

// --- Inline Styles ---
const styles = {
  root: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    backgroundColor: '#D5D4D3',
    color: '#2a2a2a',
  },
  hero: {
    background: 'linear-gradient(135deg, #4a5856 0%, #616D6B 50%, #7a8a88 100%)',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '80px 0 60px',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)`,
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '999px',
    padding: '6px 20px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: 'clamp(52px, 9vw, 100px)',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '0.9',
    letterSpacing: '-4px',
    marginBottom: '24px',
  },
  heroDesc: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '480px',
    lineHeight: '1.7',
  },
  heroYear: {
    fontSize: 'clamp(100px, 18vw, 200px)',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.04)',
    position: 'absolute',
    right: '-20px',
    bottom: '-40px',
    lineHeight: 1,
    letterSpacing: '-8px',
    userSelect: 'none',
  },
  statsSection: {
    background: '#616D6B',
    padding: '50px 0',
  },
  statItem: {
    textAlign: 'center',
    padding: '0 20px',
  },
  statNumber: {
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-2px',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    marginTop: '6px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500',
  },
  statDivider: {
    width: '1px',
    background: 'rgba(255,255,255,0.2)',
    height: '60px',
    margin: 'auto',
  },
  sectionPad: {
    padding: '80px 0',
    backgroundColor: '#D5D4D3',
  },
  aboutCard: {
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid rgba(97,109,107,0.15)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  aboutCardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: '#616D6B',
    borderRadius: '4px 0 0 4px',
  },
  aboutCardYear: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '72px',
    fontWeight: '800',
    color: 'rgba(97,109,107,0.08)',
    lineHeight: 1,
    letterSpacing: '-3px',
  },
  aboutCardIcon: {
    width: '52px',
    height: '52px',
    background: '#616D6B',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '20px',
  },
  aboutCardTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#4a5856',
    marginBottom: '14px',
    letterSpacing: '-0.5px',
  },
  aboutCardText: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.75',
  },
  valuesSection: {
    background: '#4a5856',
    padding: '80px 0',
  },
  valueCard: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '36px 28px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, background 0.3s ease',
  },
  valueIcon: {
    fontSize: '36px',
    marginBottom: '16px',
    display: 'block',
  },
  valueTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px',
  },
  valueDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  teamCard: {
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    border: '1px solid rgba(97,109,107,0.15)',
  },
  teamAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#616D6B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 auto 16px',
    letterSpacing: '-1px',
  },
  teamName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#4a5856',
    marginBottom: '4px',
  },
  teamRole: {
    fontSize: '13px',
    color: '#777',
  },
  breadcrumbSection: {
    backgroundColor: '#bebfbe',
    padding: '20px 0',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#616D6B',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: 'clamp(38px, 5vw, 64px)',
    fontWeight: '300',
    color: '#4a5856',
    letterSpacing: '-3px',
    lineHeight: '0.95',
    marginBottom: '20px',
  },
};

// --- Animated Counter ---
function AnimatedNumber({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);
  const num = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const duration = 1400;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(progress * num));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// --- Main Component ---
const AboutUsPage = () => {
  return (
    <div style={styles.root}>
      {/* Fixed Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={styles.breadcrumbSection}>
          <div className="container">
            <p style={{ fontSize: '14px', color: '#6c6c6c', marginBottom: '4px' }} className="hv">
              Home Page &nbsp;›&nbsp; <strong style={{ color: '#4a5856' }}>About Us</strong>
            </p>
          </div>
        </section>

        {/* HERO */}
        <section style={styles.hero}>
          <div style={styles.heroBg} />
          <div style={styles.heroGrid} />
          <div className="container position-relative">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div style={styles.heroBadge}>Est. 2005 · Electronics Leader</div>
                <h1 style={styles.heroTitle}>
                  <span style={{ display: 'block' }}>We Are</span>
                  <span style={{ display: 'block', fontStyle: 'italic', fontWeight: '400' }}>Miltronix</span>
                </h1>
                <p style={styles.heroDesc}>
                  Two decades of pushing the boundaries of electronics — built on trust, driven by innovation, designed for the future.
                </p>
              </div>
            </div>
            <div style={styles.heroYear} aria-hidden="true">2005</div>
          </div>
        </section>

        {/* STATS */}
        <section style={styles.statsSection}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
              {stats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <div style={{ ...styles.statItem, flex: 1 }}>
                    <div style={styles.statNumber}>
                      <AnimatedNumber target={stat.number} />
                    </div>
                    <div style={styles.statLabel}>{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div style={styles.statDivider} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT CONTENT */}
        <section style={styles.sectionPad}>
          <div className="container">
            <div className="row">
              <div className="col-lg-4 mb-5 mb-lg-0">
                <div style={{ position: 'sticky', top: '120px' }}>
                  <p style={styles.sectionLabel}>Who We Are</p>
                  <h2 style={styles.sectionTitle}>
                    <span style={{ display: 'block' }}>Our</span>
                    <span style={{ display: 'block', fontStyle: 'italic' }}>Journey</span>
                  </h2>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.7' }}>
                    From a bold idea to a global brand — this is the story of Miltronix.
                  </p>
                  <div style={{ marginTop: '32px' }}>
                    <div style={{ width: '48px', height: '3px', background: '#616D6B', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                {aboutUsContent.map((section) => (
                  <div
                    key={section.title}
                    style={styles.aboutCard}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(97,109,107,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={styles.aboutCardAccent} />
                    <div style={styles.aboutCardYear}>{section.year}</div>
                    <div style={styles.aboutCardIcon}>{section.icon}</div>
                    <h3 style={styles.aboutCardTitle}>{section.title}</h3>
                    <p style={styles.aboutCardText}>{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section style={styles.valuesSection}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={{ ...styles.sectionLabel, color: 'rgba(255,255,255,0.5)' }}>What Drives Us</p>
              <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>
                <span>Our </span>
                <span style={{ fontStyle: 'italic' }}>Values</span>
              </h2>
            </div>
            <div className="row g-4">
              {values.map((val) => (
                <div className="col-6 col-md-3" key={val.title}>
                  <div
                    style={styles.valueCard}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    }}
                  >
                    <span style={styles.valueIcon}>{val.icon}</span>
                    <div style={styles.valueTitle}>{val.title}</div>
                    <div style={styles.valueDesc}>{val.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ ...styles.sectionPad }}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={styles.sectionLabel}>The People Behind It All</p>
              <h2 style={styles.sectionTitle}>
                <span>Meet the </span>
                <span style={{ fontStyle: 'italic' }}>Team</span>
              </h2>
            </div>
            <div className="row g-4 justify-content-center">
              {teamMembers.map((member) => (
                <div className="col-6 col-md-3" key={member.name}>
                  <div style={styles.teamCard}>
                    <div style={styles.teamAvatar}>{member.initials}</div>
                    <div style={styles.teamName}>{member.name}</div>
                    <div style={styles.teamRole}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section style={{ background: '#616D6B', padding: '60px 0' }}>
          <div className="container text-center">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '300', color: '#fff', letterSpacing: '-2px', marginBottom: '8px' }}>
              Ready to <em>explore</em>?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '32px', fontSize: '15px' }}>
              Discover our full range of innovative electronics.
            </p>
            <button style={{
              background: '#fff',
              color: '#616D6B',
              border: 'none',
              borderRadius: '999px',
              padding: '14px 40px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}>
              Shop Now →
            </button>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;