import React, { useState } from "react";
import Footer from "../../components/layout/Footer";
import SubscriptionSection from "../HomePage/components/SubscriptionSection";
import logoBanner from "../../assets/MILTRONIX-APP-DESIGN-3.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const policies = [
  {
    id: "01",
    title: "10-Day Return Window",
    short: "Return within 10 days of delivery",
    detail: "You can return most Miltronix products within 10 days of delivery. The product must be unused, in its original packaging, and accompanied by the original invoice and all accessories.",
    icon: "📅",
  },
  {
    id: "02",
    title: "Free Pickup",
    short: "We come to your door",
    detail: "Once your return request is approved, we schedule a free doorstep pickup within 48 hours. No need to visit any store or service centre — our logistics partner handles everything.",
    icon: "🚐",
  },
  {
    id: "03",
    title: "Refund in 5–7 Days",
    short: "Money back, fast",
    detail: "After we receive and inspect the returned item, your refund is processed within 5–7 business days to the original payment method. UPI and wallet refunds may arrive sooner.",
    icon: "💸",
  },
  {
    id: "04",
    title: "Exchange Option",
    short: "Swap for a different model",
    detail: "Don't want a refund? No problem. You can exchange your product for a different model or variant. Exchanges are subject to availability and price difference adjustments.",
    icon: "🔁",
  },
];

const conditions = [
  { ok: true,  text: "Product is unused and in original condition" },
  { ok: true,  text: "All original accessories are included" },
  { ok: true,  text: "Original packaging is intact" },
  { ok: true,  text: "Invoice / purchase proof is available" },
  { ok: false, text: "Product has been physically damaged" },
  { ok: false, text: "Serial number / IMEI has been tampered" },
  { ok: false, text: "Product is marked Non-Returnable on listing" },
  { ok: false, text: "Return request raised after 10 days" },
];

const nonReturnable = [
  "Consumables & accessories opened out of box",
  "Software licenses & digital downloads",
  "Earphones & in-ear headphones (hygiene)",
  "Items marked 'Non-Returnable' on product page",
  "Customised or personalised products",
];

const timeline = [
  { day: "Day 0", event: "Return request raised via My Orders" },
  { day: "Day 1–2", event: "Request approved & pickup scheduled" },
  { day: "Day 2–4", event: "Item picked up from your address" },
  { day: "Day 4–6", event: "Item received & quality check done" },
  { day: "Day 5–7", event: "Refund credited to original payment method" },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#D5D4D3",
  bgOff: "#c8c9c7",
  dark: "#2a2e2d",
  primary: "#616D6B",
  accent: "#4a5856",
  white: "#ffffff",
  muted: "#757575",
  ink: "#1a1e1d",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReturnPolicyPage() {
  const [activePolicy, setActivePolicy] = useState(0);

  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", backgroundColor: C.bg, color: C.ink, minHeight: "100vh" }}>

      {/* Fixed Banner */}
      <div className="fixed-top">
        <section className="miltronix-banner d-flex justify-content-center align-items-center">
          <img src={logoBanner} alt="Miltronix Logo" className="img-fluid miltronix-logo" />
        </section>
      </div>

      <main className="main-content-padding">

        {/* Breadcrumb */}
        <section style={{ backgroundColor: C.bgOff, padding: "16px 0", borderBottom: `1px solid rgba(97,109,107,0.2)` }}>
          <div className="container">
            <p style={{ fontSize: "13px", color: C.muted, margin: 0 }} className="hv">
              Home &nbsp;›&nbsp; <strong style={{ color: C.accent }}>Return Policy</strong>
            </p>
          </div>
        </section>

        {/* ── EDITORIAL HERO — full width, asymmetric ── */}
        <section style={{ backgroundColor: C.dark, minHeight: "85vh", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden" }}>

          {/* Left content */}
          <div style={{ flex: "0 0 55%", padding: "80px 60px 80px 80px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "24px" }}>
              Miltronix · Return Policy
            </div>

            <h1 style={{ fontSize: "clamp(56px, 9vw, 110px)", fontWeight: "800", color: C.white, lineHeight: "0.88", letterSpacing: "-5px", marginBottom: "0" }}>
              <span style={{ display: "block" }}>Easy</span>
              <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px rgba(255,255,255,0.3)` }}>Returns</span>
              <span style={{ display: "block", fontStyle: "italic", fontWeight: "300", color: "rgba(255,255,255,0.5)", fontSize: "0.65em", letterSpacing: "-2px" }}>guaranteed.</span>
            </h1>

            <div style={{ width: "60px", height: "3px", background: C.primary, borderRadius: "2px", margin: "32px 0" }} />

            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "1.75", maxWidth: "400px", marginBottom: "40px" }}>
              Not happy with your purchase? We make returns simple, free, and fast — because your satisfaction comes first.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {["10-Day Window", "Free Pickup", "5–7 Day Refund"].map(tag => (
                <div key={tag} style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", borderRadius: "6px", padding: "8px 18px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Right — large number + pattern */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Grid pattern */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* Big number */}
            <div style={{ fontSize: "clamp(120px, 20vw, 220px)", fontWeight: "900", color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "-10px", userSelect: "none", position: "relative", zIndex: 1 }}>10</div>
            {/* Label */}
            <div style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 2 }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "3px", textTransform: "uppercase" }}>days to return</div>
            </div>
          </div>

          {/* Diagonal divider */}
          <div style={{ position: "absolute", top: 0, left: "53%", width: "4px", height: "100%", background: "rgba(255,255,255,0.05)", transform: "skewX(-2deg)" }} />
        </section>

        {/* ── POLICY CARDS — horizontal tab layout ── */}
        <section style={{ backgroundColor: C.bg, padding: "80px 0" }}>
          <div className="container">
            <div style={{ display: "flex", gap: "0", marginBottom: "0", overflowX: "auto", borderBottom: `2px solid rgba(97,109,107,0.15)` }}>
              {policies.map((p, i) => (
                <button key={p.id} onClick={() => setActivePolicy(i)} style={{
                  padding: "16px 28px", border: "none", background: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: "700", fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: activePolicy === i ? C.accent : C.muted,
                  borderBottom: activePolicy === i ? `3px solid ${C.accent}` : "3px solid transparent",
                  marginBottom: "-2px", whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{ marginRight: "8px" }}>{p.icon}</span>{p.title}
                </button>
              ))}
            </div>

            {/* Active panel */}
            <div style={{ display: "flex", gap: "60px", padding: "56px 0", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 auto" }}>
                <div style={{ fontSize: "clamp(80px, 12vw, 140px)", fontWeight: "900", color: "rgba(97,109,107,0.1)", lineHeight: 1, letterSpacing: "-6px" }}>
                  {policies[activePolicy].id}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>
                  Policy {policies[activePolicy].id}
                </div>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700", color: C.accent, letterSpacing: "-2px", marginBottom: "16px", lineHeight: "1" }}>
                  {policies[activePolicy].title}
                </h2>
                <p style={{ fontSize: "16px", color: C.muted, lineHeight: "1.8", maxWidth: "520px" }}>
                  {policies[activePolicy].detail}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RETURN TIMELINE — horizontal scroll ── */}
        <section style={{ backgroundColor: C.dark, padding: "70px 0", overflow: "hidden" }}>
          <div className="container">
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>
              From Request to Refund
            </div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "300", color: C.white, letterSpacing: "-3px", marginBottom: "48px" }}>
              The <em>timeline</em>
            </h2>

            <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "16px" }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0", minWidth: "180px", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    {/* Dot + line */}
                    <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "16px" }}>
                      <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: i === 4 ? "#22c55e" : C.primary, flexShrink: 0 }} />
                      {i < timeline.length - 1 && <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.1)" }} />}
                    </div>
                    <div style={{ paddingRight: "24px", width: "100%" }}>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: C.primary, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{t.day}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>{t.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONDITIONS — two column checklist ── */}
        <section style={{ backgroundColor: C.bgOff, padding: "80px 0" }}>
          <div className="container">
            <div className="row align-items-start g-5">
              <div className="col-lg-4">
                <div style={{ position: "sticky", top: "120px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>
                    Eligibility
                  </div>
                  <h2 style={{ fontSize: "clamp(34px, 5vw, 54px)", fontWeight: "300", color: C.accent, letterSpacing: "-3px", lineHeight: "0.92", marginBottom: "20px" }}>
                    Return<br /><em>conditions</em>
                  </h2>
                  <p style={{ fontSize: "14px", color: C.muted, lineHeight: "1.75" }}>
                    Make sure your product meets these conditions before raising a return request to ensure smooth processing.
                  </p>
                </div>
              </div>

              <div className="col-lg-8">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {conditions.map((c, i) => (
                    <div key={i} style={{
                      background: c.ok ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                      border: `1px solid ${c.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"}`,
                      borderRadius: "12px", padding: "18px 20px",
                      display: "flex", alignItems: "flex-start", gap: "12px",
                    }}>
                      <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{c.ok ? "✅" : "❌"}</span>
                      <span style={{ fontSize: "13px", color: C.ink, lineHeight: "1.5", fontWeight: "500" }}>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NON-RETURNABLE — dark accent strip ── */}
        <section style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 100%)`, padding: "70px 0" }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-5">
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
                  Exceptions
                </div>
                <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: "300", color: C.white, letterSpacing: "-2.5px", marginBottom: "16px" }}>
                  Non-returnable<br /><em>items</em>
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7" }}>
                  Certain product categories cannot be returned due to hygiene, licensing, or customisation reasons.
                </p>
              </div>
              <div className="col-lg-7">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {nonReturnable.map((item, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: "14px",
                    }}>
                      <span style={{ fontSize: "18px" }}>⚠️</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW TO RETURN — numbered editorial ── */}
        <section style={{ backgroundColor: C.bg, padding: "80px 0" }}>
          <div className="container">
            <div className="text-center mb-5">
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: C.primary, marginBottom: "12px" }}>
                Step by Step
              </div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "300", color: C.accent, letterSpacing: "-3px" }}>
                How to <em>return</em>
              </h2>
            </div>

            <div className="row g-4">
              {[
                { n: "1", title: "Go to My Orders", desc: 'Log in to your account, go to "My Orders" and find the item you want to return.' },
                { n: "2", title: "Click Return", desc: 'Select "Request Return" next to the product. Choose your reason and preferred resolution (refund or exchange).' },
                { n: "3", title: "Schedule Pickup", desc: "Our logistics team will call/message to confirm your pickup slot within 24–48 hours." },
                { n: "4", title: "Get Your Refund", desc: "Once we receive and verify the product, your refund is credited within 5–7 business days." },
              ].map((step, i) => (
                <div className="col-md-6 col-lg-3" key={step.n}>
                  <div style={{
                    borderTop: `3px solid ${i % 2 === 0 ? C.accent : C.primary}`,
                    paddingTop: "24px",
                  }}>
                    <div style={{ fontSize: "52px", fontWeight: "900", color: "rgba(97,109,107,0.12)", lineHeight: 1, letterSpacing: "-3px", marginBottom: "12px" }}>
                      {step.n}
                    </div>
                    <h4 style={{ fontSize: "17px", fontWeight: "700", color: C.accent, marginBottom: "10px" }}>{step.title}</h4>
                    <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section style={{ backgroundColor: C.dark, padding: "56px 0" }}>
          <div className="container">
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
              <div>
                <h3 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "300", color: C.white, letterSpacing: "-2px", margin: 0 }}>
                  Ready to raise a <em>return?</em>
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>
                  Go to My Orders → Select item → Click Return Request
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button style={{
                  background: C.white, color: C.dark, border: "none",
                  borderRadius: "10px", padding: "13px 32px", fontWeight: "700",
                  fontSize: "14px", cursor: "pointer",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}>
                  📦 Go to My Orders
                </button>
                <button style={{
                  background: "transparent", color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "10px", padding: "13px 32px", fontWeight: "600",
                  fontSize: "14px", cursor: "pointer",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}>
                  💬 Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>

        <SubscriptionSection />
      </main>

      <Footer />
    </div>
  );
}