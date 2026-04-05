import React from 'react';
import { Monitor, Apple, Smartphone, DownloadIcon, CheckCircle, Terminal } from 'lucide-react';
import '../Download.css';

function OSCard({ icon: Icon, name, sub, tag, available, tagColor, delay }) {
  return (
    <div className={`os-card glass ${available ? 'os-active glass-hover' : 'os-dim'} anim-fade-up ${delay}`}>
      {available && <div className="os-badge">Available Now</div>}
      <div className={`os-icon ${tagColor}`}><Icon size={36} /></div>
      <h3>{name}</h3>
      <p>{sub}</p>
      {available ? (
        <a href="#download" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
          <DownloadIcon size={16} /> Download (.exe)
        </a>
      ) : (
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }} disabled>
          Coming Soon
        </button>
      )}
    </div>
  );
}

export default function Download() {
  return (
    <div className="dl-page">
      <div className="dl-header anim-fade-up d1">
        <h1 className="section-title">Get <span className="grad-text">SPDF Reader</span></h1>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          The official reader application to open, view and print DRM-protected SPDF files.
        </p>
      </div>

      <div className="os-grid">
        <OSCard icon={Monitor}    name="Windows"  sub="Windows 10 / 11 (64-bit)" tagColor="win"     available delay="d2" />
        <OSCard icon={Apple}      name="macOS"    sub="macOS 11 or later"         tagColor="mac"     delay="d3" />
        <OSCard icon={Terminal}   name="Linux"    sub="Debian, Ubuntu, Fedora"    tagColor="linux"   delay="d4" />
        <OSCard icon={Smartphone} name="Android"  sub="Android 8.0 and above"     tagColor="android" delay="d5" />
      </div>

      <div className="dl-notes glass anim-fade-up d6">
        <h3>System Requirements</h3>
        <ul>
          {[
            'Java Runtime Environment (JRE) 11+',
            'Internet connection for first-time DRM verification',
            '50 MB disk space',
            'Windows: .NET Framework 4.8 recommended',
          ].map(r => (
            <li key={r}><CheckCircle size={15} className="chk" /> {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
