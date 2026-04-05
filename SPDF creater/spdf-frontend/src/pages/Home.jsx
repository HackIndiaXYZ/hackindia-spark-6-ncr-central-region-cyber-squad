import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, MonitorSmartphone, Printer, ArrowRight, Download,
  FileText, CheckCircle, Target, Users, BookOpen, GraduationCap,
  Building, ShieldCheck, Zap, Globe
} from 'lucide-react';
import '../Home.css';

/* ── Typewriter ──────────────────────────────────────────── */
const PHRASES = ['Advanced DRM', 'Zero-Trust Security', 'Total Access Control', 'Unbreakable Locks'];

function Typewriter() {
  const [idx, setIdx]       = useState(0);
  const [sub, setSub]       = useState(0);
  const [del, setDel]       = useState(false);
  const [blink, setBlink]   = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBlink(p => !p), 530);
    return () => clearTimeout(t);
  });

  useEffect(() => {
    const phrase = PHRASES[idx];
    if (!del && sub === phrase.length + 1) { setTimeout(() => setDel(true), 2400); return; }
    if (del  && sub === 0) { setDel(false); setIdx(p => (p + 1) % PHRASES.length); return; }
    const t = setTimeout(() => setSub(p => p + (del ? -1 : 1)), del ? 38 : 95);
    return () => clearTimeout(t);
  }, [sub, idx, del]);

  return (
    <span className="grad-text typewriter">
      {PHRASES[idx].substring(0, sub)}<span className="cursor">{blink ? '|' : ' '}</span>
    </span>
  );
}

/* ── Feature Card ─────────────────────────────────────────── */
function FeatCard({ icon: Icon, title, body, color, delay }) {
  return (
    <div className={`feat-card glass glass-hover anim-fade-up ${delay}`}>
      <div className="feat-icon" style={{ '--c': color }}><Icon size={22} /></div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/* ── Step Row ─────────────────────────────────────────────── */
function Step({ n, title, desc, delay }) {
  return (
    <div className={`step-row anim-slide-r ${delay}`}>
      <div className="step-num">{n}</div>
      <div>
        <div className="step-title">{title}</div>
        <div className="step-desc">{desc}</div>
      </div>
    </div>
  );
}

/* ── Use Case Card ────────────────────────────────────────── */
function UseCard({ icon: Icon, title, desc, delay }) {
  return (
    <div className={`use-card glass glass-hover anim-scale-in ${delay}`}>
      <Icon size={28} className="use-icon" />
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

/* ── Home Page ────────────────────────────────────────────── */
export default function Home() {
  const nav = useNavigate();

  return (
    <div className="home">

      {/* ─ HERO ─ */}
      <section className="hero">
        <div className="hero-inner">
          <span className="section-label anim-fade-up d1"><Zap size={12} /> New File Format · .spdf</span>
          <h1 className="anim-fade-up d2">
            Secure Your PDFs<br />with <Typewriter />
          </h1>
          <p className="hero-sub anim-fade-up d3">
            SPDF is a next-generation file extension powered by Digital Rights Management.
            Unlike regular PDFs, SPDF gives you <strong>absolute control</strong> over who opens,
            prints, and shares your files.
          </p>
          <div className="hero-ctas anim-fade-up d4">
            <button className="btn btn-primary btn-lg" onClick={() => nav('/create')}>
              Create SPDF <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => nav('/download')}>
              Download Reader <Download size={18} />
            </button>
          </div>
          <div className="hero-stats anim-fade-up d5">
            {[['DRM Protected','100%'], ['Expiry Control','⏳'], ['Device Locked','🔒'], ['Open Limits','✅'], ['Print Limits','🖨️']].map(([k,v]) => (
              <div className="stat" key={k}><span className="stat-val">{v}</span><span className="stat-label">{k}</span></div>
            ))}
          </div>
        </div>
        <div className="hero-glow" />
      </section>

      <div className="divider" />

      {/* ─ WHAT IS SPDF ─ */}
      <section className="what-section">
        <div className="what-text anim-slide-r d1">
          <span className="section-label"><FileText size={12} /> About SPDF</span>
          <h2 className="section-title">What is a <span className="grad-text">SPDF File?</span></h2>
          <p className="section-sub">
            SPDF (Secure PDF) is a custom file format built from the ground up to prevent unauthorised access, distribution, and misuse of sensitive documents.
          </p>
          <ul className="check-list">
            {['Wraps normal PDF in a DRM security layer','Works only with the official SPDF Reader','Applies real-time access restrictions on every open'].map(t => (
              <li key={t}><CheckCircle size={17} className="chk" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="what-card glass anim-scale-in d3">
          <div className="wc-row"><span className="wc-key">Format</span><span className="tag tag-purple">.spdf</span></div>
          <div className="wc-row"><span className="wc-key">Based on</span><span className="tag tag-cyan">PDF + DRM</span></div>
          <div className="wc-row"><span className="wc-key">Opens with</span><span className="tag tag-green">SPDF Reader</span></div>
          <div className="wc-row"><span className="wc-key">Platform</span><span className="wc-val">Windows (more coming)</span></div>
          <div className="wc-row"><span className="wc-key">Encryption</span><span className="wc-val">Base64 + JSON DRM</span></div>
          <div className="wc-divider" />
          <p className="wc-note">Unlike normal PDFs, SPDF files cannot be opened outside the reader and self-destruct on expiry.</p>
        </div>
      </section>

      <div className="divider" />

      {/* ─ FEATURES ─ */}
      <section className="feat-section">
        <div className="feat-header anim-fade-up d1" style={{ textAlign: 'center' }}>
          <span className="section-label"><ShieldCheck size={12} /> Protection Suite</span>
          <h2 className="section-title">Enterprise-grade <span className="grad-text">DRM Features</span></h2>
        </div>
        <div className="feat-grid">
          <FeatCard icon={Lock}            color="#ef4444" delay="d2" title="Password Protection"   body="Strong password encryption blocks all unauthorised access at file-open time." />
          <FeatCard icon={Clock}           color="#dc2626" delay="d3" title="Expiry Date Control"   body="Set an exact expiry date & time — the file silently locks itself when it expires." />
          <FeatCard icon={MonitorSmartphone} color="#f87171" delay="d4" title="Device Locking (MAC)" body="Bind the document to a device's MAC Address so it physically cannot move to another machine." />
          <FeatCard icon={FileText}        color="#b91c1c" delay="d5" title="Limited Open Count"    body="Precisely restrict how many times the document can be opened before it self-locks." />
          <FeatCard icon={Printer}         color="#7f1d1d" delay="d6" title="Limited Print Access"  body="Prevent bulk printing by setting an exact number of permitted print operations." />
          <FeatCard icon={ShieldCheck}     color="#991b1b" delay="d7" title="Dedicated SPDF Reader" body={<span>SPDF files can <strong>only be opened and read</strong> using the official <span className="red-label">SPDF Reader</span> application — they cannot be opened in any standard PDF viewer or browser.</span>} />
        </div>
      </section>

      <div className="divider" />

      {/* ─ HOW IT WORKS ─ */}
      <section className="how-section">
        <div className="anim-fade-up d1" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label"><Zap size={12} /> Quick Start</span>
          <h2 className="section-title">How It <span className="grad-text">Works</span></h2>
        </div>
        <div className="steps-grid">
          <Step n="01" title="Upload your PDF" desc="Select any valid PDF file from your device." delay="d2" />
          <Step n="02" title="Configure Security" desc="Set password, expiry, open/print limits and device lock options." delay="d3" />
          <Step n="03" title="Generate SPDF" desc="Our system wraps the PDF in a DRM-protected .spdf container." delay="d4" />
          <Step n="04" title="Open in Reader" desc="Download the SPDF Reader and open your protected file instantly." delay="d5" />
        </div>
      </section>

      <div className="divider" />

      {/* ─ USE CASES ─ */}
      <section className="use-section">
        <div className="anim-fade-up d1" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label"><Globe size={12} /> Real World</span>
          <h2 className="section-title">Built for Every <span className="grad-text">Use Case</span></h2>
        </div>
        <div className="use-grid">
          <UseCard icon={BookOpen}      title="Online Courses"      desc="Protect premium notes and e-learning content from resale." delay="d2" />
          <UseCard icon={Users}         title="E-Books"             desc="Distribute exclusive books with single-device access control." delay="d3" />
          <UseCard icon={Building}      title="Confidential Docs"   desc="Share sensitive corporate files with strict read/print limits." delay="d4" />
          <UseCard icon={GraduationCap} title="Exam Papers"         desc="Issue timed question papers that expire automatically after use." delay="d5" />
        </div>
      </section>

      <div className="divider" />

      {/* ─ CTA BANNER ─ */}
      <section className="cta-section glass anim-scale-in d1">
        <div className="cta-glow" />
        <ShieldCheck size={40} className="cta-icon" />
        <h2>Ready to <span className="grad-text">Secure Your Files?</span></h2>
        <p>Convert your PDF into a DRM-protected SPDF file in under 30 seconds.</p>
        <div className="cta-btns">
          <button className="btn btn-primary btn-lg" onClick={() => nav('/create')}>Create SPDF Now <ArrowRight size={18} /></button>
          <button className="btn btn-secondary btn-lg" onClick={() => nav('/download')}>Download Reader</button>
        </div>
      </section>

    </div>
  );
}
