import React, { useState } from 'react';

// --- Reusable Components ---
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SubscriptionSection from '../HomePage/components/SubscriptionSection';

const logoBanner = 'src/assets/MILTRONIX-APP-DESIGN-3.png';

// ─── Data ────────────────────────────────────────────────────────────────────

const helpCategories = [
  {
    icon: '📦',
    title: 'Orders & Delivery',
    desc: 'Track orders, delivery issues, cancellations',
    articles: 12,
    color: '#4a7c6f',
    topics: [
      'How to track my order',
      'Cancel or modify an order',
      'Delivery time estimates',
      'Missing or delayed package',
      'Change delivery address',
    ],
  },
  {
    icon: '🔄',
    title: 'Returns & Refunds',
    desc: 'Return requests, refund status, exchange policy',
    articles: 9,
    color: '#5a6e7c',
    topics: [
      'How to initiate a return',
      'Refund processing time',
      'Exchange a product',
      'Non-returnable items',
      'Damaged item received',
    ],
  },
  {
    icon: '🛡️',
    title: 'Warranty & Repairs',
    desc: 'Warranty claims, service centres, repair status',
    articles: 8,
    color: '#616D6B',
    topics: [
      'How to claim warranty',
      'Find a service centre',
      'Check repair status',
      'Extended warranty plans',
      'Out-of-warranty repairs',
    ],
  },
  {
    icon: '💳',
    title: 'Payments & Offers',
    desc: 'Payment methods, failed payments, EMI, coupons',
    articles: 11,
    color: '#6b5e4a',
    topics: [
      'Accepted payment methods',
      'Payment declined / failed',
      'No-cost EMI options',
      'Apply coupon code',
      'Cashback & rewards',
    ],
  },
  {
    icon: '👤',
    title: 'Account & Security',
    desc: 'Profile, password reset, login issues',
    articles: 7,
    color: '#4a5870',
    topics: [
      'Reset password',
      'Update profile details',
      'Delete my account',
      'Two-factor authentication',
      'Linked devices',
    ],
  },
  {
    icon: '⚙️',
    title: 'Product Setup & Usage',
    desc: 'Setup guides, user manuals, troubleshooting',
    articles: 15,
    color: '#5c4a6e',
    topics: [
      'Product setup guides',
      'Download user manual',
      'Firmware / software updates',
      'Troubleshooting tips',
      'Compatible accessories',
    ],
  },
];

const popularArticles = [
  { icon: '📍', title: 'How to track my Miltronix order in real time', views: '48K', time: '2 min read', tag: 'Orders' },
  { icon: '↩️', title: 'Step-by-step guide to returning a product', views: '36K', time: '3 min read', tag: 'Returns' },
  { icon: '🔑', title: "I forgot my password — here's how to reset it", views: '29K', time: '1 min read', tag: 'Account' },
  { icon: '💳', title: 'Why did my payment fail? Common reasons & fixes', views: '27K', time: '2 min read', tag: 'Payments' },
  { icon: '📋', title: 'How to register your product for warranty', views: '22K', time: '2 min read', tag: 'Warranty' },
  { icon: '🔧', title: 'TV not turning on? Try these troubleshooting steps', views: '19K', time: '4 min read', tag: 'Setup' },
];

const announcements = [
  { date: 'Mar 2025', title: 'Extended return window: Now 15 days for all orders', type: 'Policy Update' },
  { date: 'Feb 2025', title: 'New service centres opened in Pune, Surat & Kochi', type: 'Service' },
  { date: 'Jan 2025', title: 'MiltronixCare extended warranty now available at checkout', type: 'New Feature' },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const C = {
  bg: '#D5D4D3',
  bgDark: '#bebfbe',
  bgDeep: '#b5b6b5',
  card: 'rgba(255,255,255,0.32)',
  primary: '#616D6B',
  dark: '#4a5856',
  darker: '#3a4644',
  text: '#2a2a2a',
  muted: '#6c757d',
  white: '#ffffff',
};

const s = {
  page: { fontFamily: "'Bricolage Grotesque', sans-serif", backgroundColor: C.bg, color: C.text, minHeight: '100vh' },

  // Hero
  hero: {
    background: `linear-gradient(150deg, ${C.darker} 0%, ${C.primary} 60%, #7a8a88 100%)`,
    padding: '80px 0 60px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
  },
  heroCircle: {
    position: 'absolute', right: '-80px', top: '-80px',
    width: '400px', height: '400px',
    border: '60px solid rgba(255,255,255,0.04)',
    borderRadius: '50%',
  },
  heroCircle2: {
    position: 'absolute', right: '80px', bottom: '-120px',
    width: '280px', height: '280px',
    border: '40px solid rgba(255,255,255,0.03)',
    borderRadius: '50%',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
    color: C.white, borderRadius: '999px', padding: '5px 18px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
    marginBottom: '18px',
  },
  heroTitle: {
    fontSize: 'clamp(42px, 8vw, 86px)', fontWeight: '300', color: C.white,
    lineHeight: '0.9', letterSpacing: '-4px', marginBottom: '18px',
  },
  heroSub: { fontSize: '15px', color: 'rgba(255,255,255,0.7)', maxWidth: '420px', lineHeight: '1.7', marginBottom: '32px' },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: C.white, borderRadius: '14px',
    padding: '6px 6px 6px 20px', maxWidth: '540px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', fontSize: '14px',
    background: 'transparent', color: C.text,
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  searchBtn: {
    background: C.primary, color: C.white, border: 'none',
    borderRadius: '10px', padding: '10px 22px', fontWeight: '700',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  heroTags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' },
  heroTag: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.75)', borderRadius: '999px',
    padding: '4px 14px', fontSize: '12px', cursor: 'pointer',
  },

  // Section
  sectionLabel: { fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: C.primary, marginBottom: '10px' },
  sectionTitle: { fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: '300', color: C.dark, letterSpacing: '-3px', lineHeight: '0.92', marginBottom: '14px' },

  // Category cards
  catSection: { background: C.bg, padding: '80px 0 60px' },
  catCard: {
    background: C.card, borderRadius: '18px', padding: '32px 28px',
    border: '1px solid rgba(97,109,107,0.12)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    height: '100%', cursor: 'pointer',
  },
  catIcon: (color) => ({
    width: '56px', height: '56px', background: color,
    borderRadius: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '26px', marginBottom: '16px',
  }),
  catTitle: { fontSize: '18px', fontWeight: '700', color: C.dark, marginBottom: '6px' },
  catDesc: { fontSize: '13px', color: C.muted, marginBottom: '16px', lineHeight: '1.6' },
  catTopics: { listStyle: 'none', padding: 0, margin: 0 },
  catTopic: {
    fontSize: '13px', color: C.primary, padding: '6px 0',
    borderBottom: '1px solid rgba(97,109,107,0.1)',
    display: 'flex', alignItems: 'center', gap: '6px',
    cursor: 'pointer',
  },

  // Popular
  popularSection: { background: C.bgDark, padding: '70px 0' },
  articleCard: {
    background: C.card, borderRadius: '14px', padding: '22px 24px',
    border: '1px solid rgba(97,109,107,0.12)',
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer', marginBottom: '12px',
  },
  articleIcon: {
    width: '44px', height: '44px', background: C.primary,
    borderRadius: '10px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '20px', flexShrink: 0,
  },
  articleTitle: { fontSize: '15px', fontWeight: '600', color: C.dark, marginBottom: '6px', lineHeight: '1.4' },
  articleMeta: { display: 'flex', alignItems: 'center', gap: '10px' },
  articleTag: {
    fontSize: '10px', fontWeight: '700', background: C.primary,
    color: C.white, borderRadius: '999px', padding: '2px 10px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  articleViews: { fontSize: '12px', color: C.muted },

  // Announcements
  announcSection: { background: C.bg, padding: '70px 0' },
  announcCard: {
    background: C.card, borderRadius: '14px', padding: '24px 28px',
    border: '1px solid rgba(97,109,107,0.12)', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '20px',
  },
  announcDate: {
    fontSize: '11px', fontWeight: '700', color: C.white,
    background: C.primary, borderRadius: '8px', padding: '6px 12px',
    textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0,
    textAlign: 'center', minWidth: '60px',
  },
  announcType: {
    fontSize: '10px', fontWeight: '700', color: C.primary,
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px',
  },
  announcTitle: { fontSize: '15px', fontWeight: '600', color: C.dark },

  // Contact strip
  contactStrip: { background: C.dark, padding: '56px 0' },
  stripCard: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px', padding: '28px 24px', textAlign: 'center',
    transition: 'background 0.2s ease',
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={s.page}>

      {/* ── FIXED BANNER ── */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={{ backgroundColor: '#bebfbe', padding: '20px 0' }}>
          <div className="container">
            <p style={{ fontSize: '14px', color: '#6c6c6c', marginBottom: '4px' }} className="hv">
              Home Page &nbsp;›&nbsp; <strong style={{ color: '#4a5856' }}>Help Center</strong>
            </p>
          </div>
        </section>

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div style={s.heroGrid} />
          <div style={s.heroCircle} />
          <div style={s.heroCircle2} />
          <div className="container position-relative">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div style={s.badge}><span>📚</span> Help Center</div>
                <h1 style={s.heroTitle}>
                  <span style={{ display: 'block' }}>Find your</span>
                  <span style={{ display: 'block', fontStyle: 'italic', fontWeight: '400' }}>answer fast</span>
                </h1>
                <p style={s.heroSub}>
                  Browse guides, articles, and how-tos across all Miltronix products and services.
                </p>

                {/* Search */}
                <div style={s.searchWrap}>
                  <span style={{ fontSize: '18px', marginRight: '8px', opacity: 0.4 }}>🔍</span>
                  <input
                    style={s.searchInput}
                    placeholder="e.g. 'how to return a product', 'reset password'..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button style={s.searchBtn}>Search</button>
                </div>

                {/* Suggested tags */}
                <div style={s.heroTags}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', alignSelf: 'center' }}>Popular:</span>
                  {['Track Order', 'Return Policy', 'Warranty Claim', 'EMI Options', 'Password Reset'].map(tag => (
                    <span key={tag} style={s.heroTag} onClick={() => setSearch(tag)}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Right side stats */}
              <div className="col-lg-5 d-none d-lg-flex justify-content-end">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '320px' }}>
                  {[
                    { n: '62+', l: 'Help Articles' },
                    { n: '6', l: 'Categories' },
                    { n: '24/7', l: 'Self-Service' },
                    { n: '98%', l: 'Issues Resolved' },
                  ].map(item => (
                    <div key={item.l} style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '14px', padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '26px', fontWeight: '800', color: C.white, letterSpacing: '-1px', lineHeight: 1 }}>{item.n}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section style={s.catSection}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={s.sectionLabel}>Browse by Topic</p>
              <h2 style={s.sectionTitle}>
                Help <span style={{ fontStyle: 'italic' }}>Categories</span>
              </h2>
              <p style={{ color: C.muted, fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
                Click any category to explore articles and step-by-step guides.
              </p>
            </div>

            <div className="row g-4">
              {helpCategories.map((cat, i) => (
                <div className="col-md-6 col-lg-4" key={cat.title}>
                  <div
                    style={s.catCard}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(97,109,107,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={s.catIcon(cat.color)}>{cat.icon}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={s.catTitle}>{cat.title}</div>
                      <span style={{ fontSize: '11px', background: 'rgba(97,109,107,0.12)', color: C.primary, borderRadius: '999px', padding: '3px 10px', fontWeight: '700' }}>
                        {cat.articles} articles
                      </span>
                    </div>
                    <p style={s.catDesc}>{cat.desc}</p>
                    <ul style={s.catTopics}>
                      {cat.topics.map(topic => (
                        <li key={topic} style={s.catTopic}>
                          <span style={{ fontSize: '10px', opacity: 0.6 }}>›</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POPULAR ARTICLES ── */}
        <section style={s.popularSection}>
          <div className="container">
            <div className="row align-items-end mb-5">
              <div className="col-lg-6">
                <p style={s.sectionLabel}>Most Read</p>
                <h2 style={s.sectionTitle}>
                  Popular <span style={{ fontStyle: 'italic' }}>Articles</span>
                </h2>
              </div>
              <div className="col-lg-6 text-lg-end">
                <span style={{ fontSize: '13px', color: C.primary, fontWeight: '700', cursor: 'pointer' }}>
                  View all articles →
                </span>
              </div>
            </div>

            <div className="row g-0">
              <div className="col-lg-8">
                {popularArticles.map((article, i) => (
                  <div
                    key={i}
                    style={s.articleCard}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(97,109,107,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={s.articleIcon}>{article.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={s.articleTitle}>{article.title}</div>
                      <div style={s.articleMeta}>
                        <span style={s.articleTag}>{article.tag}</span>
                        <span style={s.articleViews}>👁 {article.views} views</span>
                        <span style={s.articleViews}>⏱ {article.time}</span>
                      </div>
                    </div>
                    <span style={{ color: C.primary, fontSize: '20px', alignSelf: 'center' }}>›</span>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 ps-lg-4">
                <div style={{ background: C.card, borderRadius: '18px', padding: '28px', border: '1px solid rgba(97,109,107,0.12)', position: 'sticky', top: '120px' }}>
                  <h5 style={{ fontWeight: '700', color: C.dark, fontSize: '18px', marginBottom: '6px' }}>Can't find your answer?</h5>
                  <p style={{ fontSize: '13px', color: C.muted, marginBottom: '24px', lineHeight: '1.6' }}>
                    Our support team is ready to help you with any question.
                  </p>
                  {[
                    { icon: '💬', label: 'Start Live Chat', bg: C.primary },
                    { icon: '🎟️', label: 'Raise a Ticket', bg: C.dark },
                    { icon: '📞', label: 'Call 1800-MILTRONIX', bg: C.darker },
                  ].map(btn => (
                    <button key={btn.label} style={{
                      width: '100%', background: btn.bg, color: C.white,
                      border: 'none', borderRadius: '10px', padding: '12px 0',
                      fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      marginBottom: '10px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                    }}>
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                  <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(97,109,107,0.07)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: C.muted, marginBottom: '6px' }}>Business Hours</div>
                    <div style={{ fontSize: '13px', color: C.dark, fontWeight: '500' }}>Mon – Sat: 9 AM – 9 PM</div>
                    <div style={{ fontSize: '13px', color: C.muted }}>Sunday: 10 AM – 6 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ANNOUNCEMENTS ── */}
        <section style={s.announcSection}>
          <div className="container">
            <div className="row align-items-end mb-4">
              <div className="col-lg-6">
                <p style={s.sectionLabel}>What's New</p>
                <h2 style={s.sectionTitle}>
                  Help Center <span style={{ fontStyle: 'italic' }}>Updates</span>
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                {announcements.map((item, i) => (
                  <div key={i} style={s.announcCard}>
                    <div style={s.announcDate}>{item.date}</div>
                    <div>
                      <div style={s.announcType}>{item.type}</div>
                      <div style={s.announcTitle}>{item.title}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: C.primary, fontSize: '20px', flexShrink: 0 }}>›</span>
                  </div>
                ))}
              </div>
              <div className="col-lg-4 ps-lg-4 mt-3 mt-lg-0">
                <div style={{ background: C.card, borderRadius: '16px', padding: '28px', border: '1px solid rgba(97,109,107,0.12)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
                  <h5 style={{ fontWeight: '700', color: C.dark, marginBottom: '6px', fontSize: '17px' }}>Stay Informed</h5>
                  <p style={{ fontSize: '13px', color: C.muted, marginBottom: '16px', lineHeight: '1.6' }}>
                    Get policy updates and important notices directly to your inbox.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input placeholder="your@email.com" style={{
                      flex: 1, border: '1px solid rgba(97,109,107,0.25)', borderRadius: '8px',
                      padding: '9px 14px', fontSize: '13px', background: 'transparent',
                      outline: 'none', fontFamily: "'Bricolage Grotesque', sans-serif", color: C.text,
                    }} />
                    <button style={{
                      background: C.primary, color: C.white, border: 'none',
                      borderRadius: '8px', padding: '9px 16px', fontWeight: '700',
                      fontSize: '13px', cursor: 'pointer',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}>Go</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT STRIP ── */}
        <section style={s.contactStrip}>
          <div className="container">
            <div className="text-center mb-5">
              <p style={{ ...s.sectionLabel, color: 'rgba(255,255,255,0.4)' }}>Still Need Help?</p>
              <h2 style={{ ...s.sectionTitle, color: C.white }}>
                We're always <span style={{ fontStyle: 'italic' }}>here</span>
              </h2>
            </div>
            <div className="row g-4 justify-content-center">
              {[
                { icon: '💬', title: 'Live Chat', desc: 'Instant help from our agents', meta: 'Online Now · Avg 2 min', action: 'Chat Now' },
                { icon: '📞', title: 'Phone Support', desc: 'Speak to a specialist directly', meta: 'Mon–Sat · 9 AM–7 PM', action: '1800-MILTRONIX' },
                { icon: '✉️', title: 'Email Us', desc: 'For detailed or complex queries', meta: 'Reply in 4–6 hours', action: 'Send Email' },
              ].map(ch => (
                <div className="col-md-4" key={ch.title}>
                  <div
                    style={s.stripCard}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{ch.icon}</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: C.white, marginBottom: '6px' }}>{ch.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>{ch.desc}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{ch.meta}</div>
                    <button style={{
                      background: C.white, color: C.dark, border: 'none',
                      borderRadius: '999px', padding: '10px 28px',
                      fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}>{ch.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
}
