import React, { useState } from "react";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";
import logoBanner from "../../assets/MILTRONIX-APP-DESIGN-3.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  { icon: "💰", title: "Bulk Pricing", desc: "Special rates on orders of 10+ units across all product categories." },
  { icon: "🚚", title: "Priority Delivery", desc: "Dedicated logistics lane with guaranteed delivery timelines." },
  { icon: "🛡️", title: "Extended Warranty", desc: "3-year warranty included on all B2B orders, no extra cost." },
  { icon: "🧑‍💼", title: "Dedicated Manager", desc: "A single point of contact for quotes, orders, and after-sales." },
  { icon: "🔧", title: "On-site Support", desc: "Technical installation and setup support at your premises." },
  { icon: "📊", title: "GST Invoicing", desc: "Proper GST-compliant invoices for seamless business accounting." },
];

const sectors = [
  { icon: "🏢", name: "Corporate Offices" },
  { icon: "🏫", name: "Educational Institutions" },
  { icon: "🏥", name: "Healthcare & Clinics" },
  { icon: "🏨", name: "Hospitality & Hotels" },
  { icon: "🏭", name: "Manufacturing Units" },
  { icon: "🏪", name: "Retail Chains" },
  { icon: "🏛️", name: "Government Bodies" },
  { icon: "🎬", name: "Media & Production" },
];

const orderSizes = [
  { range: "10–50 units", discount: "Up to 8% off", color: "#616D6B" },
  { range: "51–200 units", discount: "Up to 15% off", color: "#4a5856" },
  { range: "200+ units", discount: "Custom pricing", color: "#3a4644" },
];

const enquiryTypes = [
  "Bulk Purchase Enquiry",
  "Product Demo Request",
  "Annual Maintenance Contract (AMC)",
  "Reseller / Distributor Partnership",
  "Government Tender",
  "Custom Product Requirement",
  "Other",
];

// ─── Colors ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#D5D4D3",
  bgOff: "#c8c9c7",
  dark: "#2a2e2d",
  primary: "#616D6B",
  accent: "#4a5856",
  darker: "#3a4644",
  white: "#ffffff",
  muted: "#757575",
  ink: "#1a1e1d",
  card: "rgba(255,255,255,0.32)",
};

// ─── Enquiry Form ─────────────────────────────────────────────────────────────

function EnquiryForm() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    city: "", units: "", type: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [refId] = useState("B2B-" + Math.floor(Math.random() * 900000 + 100000));

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => { if (form.name && form.company && form.email && form.type) setSent(true); };

  const inputStyle = {
    width: "100%", border: "none", borderBottom: "1.5px solid rgba(97,109,107,0.3)",
    background: "transparent", padding: "12px 0", fontSize: "14px", color: C.ink,
    outline: "none", fontFamily: "'Bricolage Grotesque', sans-serif",
    display: "block", marginBottom: "28px",
  };
  const labelStyle = {
    fontSize: "10px", fontWeight: "800", letterSpacing: "2px",
    textTransform: "uppercase", color: C.muted, marginBottom: "4px", display: "block",
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎯</div>
      <h3 style={{ color: C.accent, fontWeight: "800", fontSize: "26px", letterSpacing: "-1px", marginBottom: "8px" }}>
        Enquiry Received!
      </h3>
      <p style={{ color: C.muted, fontSize: "15px", marginBottom: "20px", lineHeight: "1.7" }}>
        Our B2B team will contact you within 24 business hours with a customised quote.
      </p>
      <div style={{ display: "inline-block", background: C.accent, color: C.white, borderRadius: "10px", padding: "14px 32px", fontWeight: "700", fontSize: "15px", letterSpacing: "1px" }}>
        Reference: {refId}
      </div>
    </div>
  );

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label style={labelStyle}>Your Name *</label>
        <input name="name" value={form.name} onChange={handle} placeholder="Full name" style={inputStyle} />
      </div>
      <div className="col-md-6">
        <label style={labelStyle}>Company / Organisation *</label>
        <input name="company" value={form.company} onChange={handle} placeholder="Company name" style={inputStyle} />
      </div>
      <div className="col-md-6">
        <label style={labelStyle}>Business Email *</label>
        <input name="email" value={form.email} onChange={handle} placeholder="you@company.com" style={inputStyle} />
      </div>
      <div className="col-md-6">
        <label style={labelStyle}>Phone Number</label>
        <input name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
      </div>
      <div className="col-md-6">
        <label style={labelStyle}>City</label>
        <input name="city" value={form.city} onChange={handle} placeholder="e.g. Mumbai" style={inputStyle} />
      </div>
      <div className="col-md-6">
        <label style={labelStyle}>Estimated Units Required</label>
        <input name="units" value={form.units} onChange={handle} placeholder="e.g. 50 units" style={inputStyle} />
      </div>
      <div className="col-12">
        <label style={labelStyle}>Enquiry Type *</label>
        <select name="type" value={form.type} onChange={handle}
          style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
          <option value="">Select enquiry type</option>
          {enquiryTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="col-12">
        <label style={labelStyle}>Additional Message</label>
        <textarea name="message" value={form.message} onChange={handle}
          placeholder="Tell us about your requirement, product preferences, timeline..."
          style={{ ...inputStyle, borderBottom: "none", border: "1.5px solid rgba(97,109,107,0.25)", borderRadius: "10px", padding: "14px 16px", resize: "vertical", minHeight: "100px" }} />
      </div>
      <div className="col-12">
        <button onClick={submit}
          style={{
            background: C.accent, color: C.white, border: "none",
            borderRadius: "10px", padding: "14px 44px", fontWeight: "700",
            fontSize: "15px", cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.darker}
          onMouseLeave={e => e.currentTarget.style.background = C.accent}
        >
          Submit Enquiry →
        </button>
        <p style={{ fontSize: "12px", color: C.muted, marginTop: "10px" }}>
          * Required fields. Our team responds within 24 business hours.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function B2BEnquiriesPage() {
  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", backgroundColor: C.bg, color: C.ink, minHeight: "100vh" }}>

      {/* Fixed Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
         <a href="/">
  <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
</a>
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={{ backgroundColor: C.bgOff, padding: "16px 0", borderBottom: "1px solid rgba(97,109,107,0.2)" }}>
          <div className="container">
            <p style={{ fontSize: "13px", color: C.muted, margin: 0 }} className="hv">
              Home &nbsp;›&nbsp; <strong style={{ color: C.accent }}>Enquiries / B2B Orders</strong>
            </p>
          </div>
        </section>

        {/* ── HERO — split dark + light ── */}
        <section style={{ backgroundColor: C.dark, position: "relative", overflow: "hidden" }}>
          {/* Background pattern */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle at 70% 50%, rgba(97,109,107,0.15) 0%, transparent 60%),
                              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "auto, 44px 44px, 44px 44px",
          }} />

          <div className="container position-relative" style={{ padding: "80px 0 70px" }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                {/* Tag */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(97,109,107,0.2)", border: "1px solid rgba(97,109,107,0.4)", borderRadius: "6px", padding: "6px 16px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: C.primary, marginBottom: "24px" }}>
                  🏢 B2B & Bulk Orders
                </div>

                <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "900", color: C.white, lineHeight: "0.88", letterSpacing: "-5px", marginBottom: "28px" }}>
                  <span style={{ display: "block" }}>Scale</span>
                  <span style={{ display: "block", color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.25)" }}>your</span>
                  <span style={{ display: "block", fontStyle: "italic", fontWeight: "300", color: C.primary, letterSpacing: "-3px" }}>business.</span>
                </h1>

                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "1.75", maxWidth: "420px", marginBottom: "36px" }}>
                  Special pricing, dedicated support, and flexible terms for businesses, institutions, and government bodies.
                </p>

                {/* Quick stats */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  {[
                    { n: "500+", l: "B2B Clients" },
                    { n: "15%", l: "Max Discount" },
                    { n: "24hr", l: "Quote Turnaround" },
                  ].map(stat => (
                    <div key={stat.l} style={{ borderLeft: `3px solid ${C.primary}`, paddingLeft: "14px" }}>
                      <div style={{ fontSize: "26px", fontWeight: "800", color: C.white, letterSpacing: "-1px", lineHeight: 1 }}>{stat.n}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — order tiers */}
              <div className="col-lg-6">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orderSizes.map((tier, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px", padding: "22px 28px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "4px" }}>Order Size</div>
                        <div style={{ fontSize: "20px", fontWeight: "700", color: C.white, letterSpacing: "-0.5px" }}>{tier.range}</div>
                      </div>
                      <div style={{ background: tier.color, color: C.white, borderRadius: "8px", padding: "8px 18px", fontSize: "13px", fontWeight: "700" }}>
                        {tier.discount}
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "4px" }}>
                    * Discounts applicable on MRP. Subject to product category.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO WE SERVE ── */}
        <section style={{ backgroundColor: C.bgOff, padding: "70px 0" }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-4">
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>Industries</div>
                <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "300", color: C.accent, letterSpacing: "-3px", lineHeight: "0.92", marginBottom: "16px" }}>
                  Who we<br /><em>serve</em>
                </h2>
                <p style={{ fontSize: "14px", color: C.muted, lineHeight: "1.75" }}>
                  We work with businesses of all sizes across every major industry vertical in India and globally.
                </p>
              </div>
              <div className="col-lg-8">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {sectors.map((s, i) => (
                    <div key={i} style={{
                      background: C.card, borderRadius: "12px", padding: "20px 16px",
                      textAlign: "center", border: "1px solid rgba(97,109,107,0.12)",
                      transition: "transform 0.2s ease",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: C.accent, lineHeight: "1.4" }}>{s.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{ backgroundColor: C.bg, padding: "80px 0" }}>
          <div className="container">
            <div className="text-center mb-5">
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>Why Choose Us</div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: "300", color: C.accent, letterSpacing: "-3px" }}>
                B2B <em>advantages</em>
              </h2>
            </div>
            <div className="row g-4">
              {benefits.map((b, i) => (
                <div className="col-md-6 col-lg-4" key={b.title}>
                  <div style={{
                    borderTop: `3px solid ${i % 2 === 0 ? C.accent : C.primary}`,
                    paddingTop: "24px", paddingRight: "20px",
                  }}>
                    <div style={{ fontSize: "32px", marginBottom: "14px" }}>{b.icon}</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: C.accent, marginBottom: "8px" }}>{b.title}</h4>
                    <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", margin: 0 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENQUIRY FORM ── */}
        <section style={{ backgroundColor: C.dark, padding: "80px 0" }}>
          <div className="container">
            <div className="row g-5 align-items-start">

              {/* Left sticky info */}
              <div className="col-lg-4">
                <div style={{ position: "sticky", top: "120px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>
                    Get a Quote
                  </div>
                  <h2 style={{ fontSize: "clamp(32px, 5vw, 50px)", fontWeight: "300", color: C.white, letterSpacing: "-3px", lineHeight: "0.92", marginBottom: "20px" }}>
                    Send your<br /><em>enquiry</em>
                  </h2>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.75", marginBottom: "32px" }}>
                    Fill in the form and our B2B specialist will reach out within 24 hours with a personalised quote.
                  </p>

                  {/* Contact direct */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { icon: "📞", label: "B2B Helpline", val: "+91 98765 00000" },
                      { icon: "✉️", label: "Email", val: "b2b@miltronix.com" },
                      { icon: "🕐", label: "Hours", val: "Mon–Fri · 9:30–6:30" },
                    ].map(item => (
                      <div key={item.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 18px" }}>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "3px" }}>{item.icon} {item.label}</div>
                        <div style={{ fontSize: "14px", color: C.white, fontWeight: "600" }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div className="col-lg-8">
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "48px 40px" }}>
                  <EnquiryForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{ background: C.primary, padding: "56px 0" }}>
          <div className="container">
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
              <div>
                <h3 style={{ fontSize: "clamp(22px, 4vw, 38px)", fontWeight: "300", color: C.white, letterSpacing: "-2px", margin: 0 }}>
                  Need a quick call instead?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>
                  Our B2B team is ready · Mon–Fri · 9:30 AM – 6:30 PM
                </p>
              </div>
              <button style={{
                background: C.white, color: C.accent, border: "none",
                borderRadius: "10px", padding: "13px 32px", fontWeight: "700",
                fontSize: "14px", cursor: "pointer",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}>
                📞 Call +91 98765 00000
              </button>
            </div>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
}