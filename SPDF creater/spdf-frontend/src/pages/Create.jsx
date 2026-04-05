import React, { useState } from 'react';
import { Upload, FileText, Lock, Clock, MonitorSmartphone, Printer, CheckCircle, Download, X, ShieldCheck, ArrowRight } from 'lucide-react';
import '../Create.css';

/* ─ Success Page ─────────────────────────────────────────── */
function SuccessPage({ dlUrl, onReset, fileName }) {
  return (
    <div className="success-page anim-scale-in">
      <h1 className="sp-title">Your SPDF File is Ready!</h1>
      <p className="sp-sub">Your PDF has been successfully converted &amp; secured with DRM protection.</p>

      <div className="sp-summary glass">
        <div className="sp-row"><span>Format</span><span className="sp-tag">.spdf</span></div>
        <div className="sp-row"><span>Status</span><span className="sp-tag sp-green"><CheckCircle size={13}/> DRM Protected</span></div>
        <div className="sp-row"><span>File</span><span className="sp-fname">{fileName}</span></div>
      </div>

      <a href={dlUrl} download="secure-document.spdf" className="btn btn-red btn-lg sp-dl">
        <Download size={20} /> Download SPDF File
      </a>
      <button className="btn btn-secondary" onClick={onReset}>
        <ArrowRight size={16} /> Create Another File
      </button>
    </div>
  );
}

/* ─ Create Page ──────────────────────────────────────────── */
export default function Create() {
  const getDefaultExpiry = () => {
    const d = new Date(Date.now() + 10 * 60000);
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [file, setFile]     = useState(null);
  const [drag, setDrag]     = useState(false);
  const [form, setForm]     = useState({ expiry: getDefaultExpiry(), maxOpen: 100, maxPrint: 100, password: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError]   = useState('');
  const [dlUrl, setDlUrl]   = useState(null);

  const [limitOpens, setLimitOpens]   = useState(false);
  const [limitPrints, setLimitPrints] = useState(false);

  const onDrop = e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) setFile(f);
  };

  const onInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!file) return;
    setStatus('loading'); setError('');

    const data = new FormData();
    data.append('pdfFile', file);
    data.append('expiry',   form.expiry);
    data.append('maxOpen',  form.maxOpen);
    data.append('maxPrint', form.maxPrint);
    data.append('password', form.password);

    try {
      const res = await fetch('http://localhost:3001/api/create-spdf', { method: 'POST', body: data });
      if (res.ok) {
        const blob = await res.blob();
        setDlUrl(window.URL.createObjectURL(blob));
        setStatus('success');
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(err.error || 'Generation failed');
        setStatus('error');
      }
    } catch (err) {
      setError('Could not reach the backend. Is the server running on port 3001?');
      setStatus('error');
    }
  };

  const reset = () => { setFile(null); setStatus('idle'); setDlUrl(null); setError(''); };

  if (status === 'success') {
    return <SuccessPage dlUrl={dlUrl} onReset={reset} fileName={file?.name} />;
  }

  return (
    <div className="cr-page">
      <div className="cr-header anim-fade-up d1">
        <h1 className="section-title">Create a <span className="red-text">Secure SPDF File</span></h1>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          Upload your PDF, configure protection rules, and download a DRM-secured SPDF file instantly.
        </p>
      </div>

      <div className="cr-layout">
        {/* Step 1 */}
        <div className="cr-card glass anim-fade-up d2">
          <div className="cr-step-label"><span className="step-badge">1</span> Select PDF File</div>

          <div
            className={`drop-zone ${drag ? 'drag-over' : ''} ${file ? 'file-ok' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('pdf-input').click()}
          >
            <input id="pdf-input" type="file" accept=".pdf,application/pdf" hidden onChange={e => { if(e.target.files?.[0]) setFile(e.target.files[0]); }} />
            {file ? (
              <div className="file-info">
                <div className="file-icon-wrap"><FileText size={36} /></div>
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={e => { e.stopPropagation(); setFile(null); }}>
                  <X size={13}/> Change
                </button>
              </div>
            ) : (
              <div className="drop-prompt">
                <div className="drop-icon-wrap"><Upload size={32} /></div>
                <p><strong>Click to upload</strong> or drag & drop</p>
                <p className="drop-hint">Only .pdf files accepted</p>
              </div>
            )}
          </div>
          <div className="device-lock-info" style={{ fontSize: '0.88rem', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <input type="checkbox" checked readOnly disabled style={{ marginTop: '4px', width: 'auto' }} />
            <span><strong>Device Locked:</strong> Created SPDF can't be opened in more than one device, and can't be shared with another user.</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`cr-card glass anim-fade-up d3 ${!file ? 'cr-disabled' : ''}`}>
          <div className="cr-step-label"><span className="step-badge">2</span> Configure Security Rules</div>

          <form onSubmit={submit} className="cr-form">
            <div className="form-group">
              <label><Clock size={15}/> Expiry Date & Time <span style={{color: '#ef4444', marginLeft: '2px'}}>*</span></label>
              <input type="datetime-local" name="expiry" value={form.expiry.substring(0,16)} onChange={onInput} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}><MonitorSmartphone size={15}/> Max Opens</label>
                  <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', margin: 0, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={limitOpens} onChange={e => {
                      setLimitOpens(e.target.checked);
                      if (e.target.checked) setForm({...form, maxOpen: 1}); else setForm({...form, maxOpen: 100});
                    }} />
                    Enable Limit
                  </label>
                </div>
                <input type="number" name="maxOpen" value={limitOpens ? form.maxOpen : ''} placeholder="Unlimited (100)" onChange={onInput} min="1" disabled={!limitOpens} required={limitOpens} />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}><Printer size={15}/> Max Prints</label>
                  <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', margin: 0, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={limitPrints} onChange={e => {
                      setLimitPrints(e.target.checked);
                      if (e.target.checked) setForm({...form, maxPrint: 1}); else setForm({...form, maxPrint: 100});
                    }} />
                    Enable Limit
                  </label>
                </div>
                <input type="number" name="maxPrint" value={limitPrints ? form.maxPrint : ''} placeholder="Unlimited (100)" onChange={onInput} min="0" disabled={!limitPrints} required={limitPrints} />
              </div>
            </div>

            <div className="form-group">
              <label><Lock size={15}/> Password <span style={{color: '#ef4444', marginLeft: '2px'}}>*</span></label>
              <input type="password" name="password" placeholder="Enter a secure password" value={form.password} onChange={onInput} required />
            </div>

            {status === 'error' && <div className="msg-error">{error}</div>}

            <button type="submit" className="btn btn-red" style={{ width:'100%', padding:'15px' }} disabled={!file || status==='loading'}>
              {status === 'loading'
                ? <><span className="spinner" /> Generating SPDF…</>
                : <><Lock size={16}/> Generate SPDF</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
