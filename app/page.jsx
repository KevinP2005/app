'use client';

import { useState } from 'react';

const focusLabels = { product: 'Product & Ideen', support: 'Support & Menschen', both: 'Beides – ich mag Abwechslung' };

function draftText(data) {
  return [
    'INTERESSENSBEKUNDUNG – VOUCHLY / EZHOST',
    'Fiktive Mitgründer-Stellenausschreibung',
    '----------------------------------------',
    `Name: ${data.name || ''}`,
    `E-Mail: ${data.email || ''}`,
    `Schwerpunkt: ${focusLabels[data.focus] || data.focus || ''}`,
    `Link: ${data.link || '–'}`,
    '',
    'Warum Vouchly?',
    data.message || '',
    '',
    'Dieser Entwurf wurde nicht automatisch versendet.',
  ].join('\n');
}

function saveDraft(data) {
  const blob = new Blob([draftText(data)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vouchly-interesse.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ProductIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h10M4 17h7"/><path d="m17 15 3 3-3 3M20 18h-6"/></svg>;
}
function SupportIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2"/><rect x="2" y="11" width="4" height="7" rx="2"/><rect x="18" y="11" width="4" height="7" rx="2"/><path d="M12 20h3"/></svg>;
}
function FounderIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 2.3 6.7L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3L12 2Z"/><path d="m19 19 1.4.6L21 21l.6-1.4L23 19l-1.4-.6L21 17l-.6 1.4L19 19Z"/></svg>;
}

export default function HomePage() {
  const [status, setStatus] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    const currentForm = event.currentTarget;
    const data = Object.fromEntries(new FormData(currentForm).entries());
    setDraft(data);
    setStatus(null);
    // Static hosting (GitHub Pages) has no API route, so offer the draft download directly.
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      setStatus({ kind: 'draft', message: 'Der E-Mail-Versand ist in dieser Demo noch nicht eingerichtet. Deine Daten wurden nicht verschickt. Du kannst deinen Entwurf als Textdatei herunterladen.' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus({ kind: 'success', message: 'Deine Nachricht wurde übermittelt. Danke für dein Interesse!' });
        currentForm.reset();
      } else if (result.code === 'NOT_CONFIGURED') {
        setStatus({ kind: 'draft', message: 'Der E-Mail-Versand ist in dieser Demo noch nicht eingerichtet. Deine Daten wurden nicht verschickt. Du kannst deinen Entwurf als Textdatei herunterladen.' });
      } else {
        setStatus({ kind: 'error', message: result.error || 'Die Übermittlung hat leider nicht geklappt. Du kannst deinen Entwurf stattdessen herunterladen.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Der Server ist nicht erreichbar. Du kannst deinen Entwurf als Textdatei herunterladen.' });
    } finally {
      setLoading(false);
    }
  }

  return <>
    <div className="demo-strip"><div className="container demo-strip__inner"><span className="demo-strip__dot"/> KONZEPTSEITE · FIKTIVE STELLENAUSSCHREIBUNG MIT AUGENZWINKERN</div></div>
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="EZHost Vouchly – zurück zum Anfang">
          <span className="brand__symbol" aria-hidden="true">V</span>
          <span><span className="brand__name">vouchly<span style={{ color: 'var(--lime)' }}>.</span></span><span className="brand__division">BY EZHOST</span></span>
        </a>
        <nav className="nav" aria-label="Hauptnavigation">
          <a href="#rolle">Die Rolle</a><a href="#realitaet">Reality Check</a><a href="#kultur">Du & wir</a><a className="nav__button" href="#bewerben">Interesse zeigen ↗</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__content">
          <div>
            <div className="eyebrow hero__eyebrow"><span className="eyebrow__line"/> MITGRÜNDER:IN GESUCHT · PRODUCT & SUPPORT</div>
            <h1 id="hero-title">Nicht einfach<br/>mitarbeiten.<br/><em>Mitgründen.</em></h1>
            <p className="hero__copy">Du willst nicht nur Tickets schließen, sondern etwas Eigenes mit aufbauen? Bei <strong style={{ color: '#f0f6ec' }}>Vouchly by EZHost</strong> suchen wir jemanden mit Ideen, Tatendrang und einer gesunden Portion Chaosresistenz.</p>
            <div className="hero__actions"><a className="btn btn--lime" href="#bewerben">Ich bin dabei <span className="btn__arrow">↗</span></a><span className="hero__small"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg> Kein gewöhnlicher 9-to-5-Pitch</span></div>
            <div className="hero__tags"><span className="pill">⚡ Mitgründerrolle</span><span className="pill">✳ Product & Support</span><span className="pill pill--muted">✦ Alles noch im Aufbau</span></div>
          </div>
          <div className="art-wrap" aria-label="Illustration: Vouchly im Aufbau">
            <div className="art"><div className="art__top"><span>VOUCHLY / BUILD MODE</span><span className="art__live">IDEEN ONLINE</span></div><div className="art__big-letter" aria-hidden="true">V</div><div className="art__bottom"><span>FROM ZERO TO SOMETHING</span><strong>GOOD THINGS START HERE.</strong></div></div>
            <div className="float-card float-card--ticket"><div className="float-card__head"><span>SUPPORT / INBOX</span><span>LIVE*</span></div><div className="float-card__label">Tickets heute: ?</div><p className="float-card__sub">Von absoluter Ruhe bis „warum blinkt alles?“</p><div className="float-card__avatarrow"><span className="mini-avatar">EZ</span><span>Wir improvisieren professionell.</span></div></div>
            <div className="float-card float-card--status"><small>PROJEKTSTATUS</small><strong><span className="pulse"/> In the making</strong></div>
          </div>
        </div>
      </section>
      <div className="marquee" aria-label="Schwerpunkte"><div className="container marquee__inner"><span>BUILD THE PRODUCT</span><b>✳</b><span>HELP THE PEOPLE</span><b>✳</b><span>OWN THE PROCESS</span><b>✳</b><span>REPEAT</span></div></div>

      <section className="section" id="rolle" aria-labelledby="role-title"><div className="container">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow__line"/> 01 / DIE MISSION</div><h2 id="role-title">Du baust mit.<br/>Nicht nur Tickets ab.</h2></div><p>Drei Bereiche, eine Rolle – und ganz sicher kein Job, bei dem du nur auf Anweisungen wartest.</p></div>
        <div className="mission-grid">
          <article className="mission-card"><div className="mission-card__top"><span className="mission-card__number">/ 01</span><span className="mission-card__icon"><ProductIcon/></span></div><div className="mission-card__content"><h3>Product mitdenken.</h3><p>Features hinterfragen, Ideen entwickeln und Vouchly Schritt für Schritt besser machen.</p></div></article>
          <article className="mission-card"><div className="mission-card__top"><span className="mission-card__number">/ 02</span><span className="mission-card__icon"><SupportIcon/></span></div><div className="mission-card__content"><h3>Menschen helfen.</h3><p>Fragen beantworten, Probleme lösen und auch dann freundlich bleiben, wenn’s brennt.</p></div></article>
          <article className="mission-card"><div className="mission-card__top"><span className="mission-card__number">/ 03</span><span className="mission-card__icon"><FounderIcon/></span></div><div className="mission-card__content"><h3>Mitgründen.</h3><p>Strategie, Entscheidungen und Verantwortung mitgestalten – statt nur Aufgaben abhaken.</p></div></article>
        </div>
      </div></section>

      <section className="section section--truth" id="realitaet" aria-labelledby="truth-title"><div className="container">
        <div className="truth-heading"><div className="eyebrow"><span className="eyebrow__line"/> 02 / DER REALITY CHECK</div><h2 id="truth-title">Transparenz statt<br/><span>Buzzword-Bingo.</span></h2><p>Wir könnten dir wilde Zahlen versprechen. Tun wir aber nicht. Hier ist die herrlich ungeschönte Version.</p></div>
        <div className="truth-grid"><article className="truth-card"><div className="truth-card__label">GEHALT / VERGÜTUNG</div><div className="truth-card__big">TBD.</div><p className="truth-card__caption">Noch nicht definiert. Ob und wie Vergütung möglich ist, wäre erst zu klären.</p></article><article className="truth-card"><div className="truth-card__label">SUPPORTAUFKOMMEN</div><div className="truth-card__big">0 → ∞</div><p className="truth-card__caption">Mal Funkstille, mal digitaler Weltuntergang. Prognosen ohne Gewähr.</p></article><article className="truth-card"><div className="truth-card__label">MITGESTALTUNG</div><div className="truth-card__big">Viel.</div><p className="truth-card__caption">Deine Ideen sollen wirklich zählen. Der genaue Rahmen ist noch offen.</p></article></div>
        <div className="truth-notice"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/></svg> Ein Mitgründer-Titel allein ist keine Zusage für Unternehmensanteile oder Vergütung.</div>
      </div></section>

      <section className="section" id="kultur" aria-labelledby="culture-title"><div className="container culture"><div><div className="eyebrow"><span className="eyebrow__line"/> 03 / DEIN VIBE</div><h2 id="culture-title">Chaosresistent?<br/>Dann passt das.</h2><ul className="culture__list"><li><span className="culture__check">✓</span> Du denkst selbstständig und packst an.</li><li><span className="culture__check">✓</span> Du kannst Technik und Menschen gleichermaßen.</li><li><span className="culture__check">✓</span> Du bringst Ideen statt nur Fragen mit.</li><li><span className="culture__check">✓</span> Du nimmst Verantwortung ernst – dich selbst nicht zu sehr.</li></ul></div><aside className="quote-card"><div className="quote-card__label">DER INOFFIZIELLE LEITSATZ / 001</div><blockquote>„Wir können dir keinen langweiligen Alltag versprechen.“</blockquote><div className="quote-card__foot">— Dein vielleicht zukünftiges Vouchly-Team ✳</div></aside></div></section>

      <section className="apply-section" id="bewerben" aria-labelledby="apply-title"><div className="container"><div className="apply-panel">
        <div className="apply-panel__aside"><div><span className="apply-panel__tag">DEIN NÄCHSTER MOVE ↗</span><h2 id="apply-title">Klingt<br/>verrückt?<br/>Passt.</h2><p>Ein kurzer Text reicht. Kein fünfseitiges Motivationsschreiben und kein Buzzword-Bingo – erzähl uns einfach, was dich antreibt.</p></div><div className="apply-panel__aside-bottom"><span>i</span> KONZEPT / KEINE OFFIZIELLE AUSSCHREIBUNG</div></div>
        <div className="form-card"><h3>Say hi. 👋</h3><p className="form-card__intro">Füll das Formular aus. In der Next.js-Version klappt der Versand nach Einrichtung der E-Mail-Zugangsdaten.</p>
          <form onSubmit={handleSubmit}>
            <div className="hp-field" aria-hidden="true"><label htmlFor="site-website">Website (leer lassen)</label><input id="site-website" name="website" tabIndex={-1} autoComplete="off"/></div>
            <div className="form-grid"><div className="field"><label htmlFor="full-name">Dein Name *</label><input id="full-name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="Max Mustermann"/></div><div className="field"><label htmlFor="email">Deine E-Mail *</label><input id="email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="du@beispiel.de"/></div></div>
            <div className="form-grid"><div className="field"><label htmlFor="focus">Dein Fokus *</label><select id="focus" name="focus" required defaultValue=""><option value="" disabled>Was liegt dir mehr?</option><option value="product">Product & Ideen</option><option value="support">Support & Menschen</option><option value="both">Beides – ich mag Abwechslung</option></select></div><div className="field"><label htmlFor="link">Link (optional)</label><input id="link" name="link" type="url" maxLength={300} placeholder="https://dein-profil.de"/></div></div>
            <div className="field"><label htmlFor="message">Warum willst du Vouchly mit aufbauen? *</label><textarea id="message" name="message" required minLength={10} maxLength={3000} placeholder="Ich hab da eine Idee ..."/></div>
            <div className="form-submit"><button type="submit" disabled={loading}>{loading ? 'Wird geprüft …' : 'Interesse bekunden'} <span aria-hidden="true">↗</span></button><span className="form-hint">* Pflichtfelder · Demo ohne garantierten Versand</span></div>
            {status && <div role="status" aria-live="polite" className={`form-result ${status.kind === 'error' ? 'form-result--error' : ''}`}>{status.message}{status.kind !== 'success' && draft && <div><button type="button" onClick={() => saveDraft(draft)}>Entwurf als .txt speichern ↓</button></div>}</div>}
          </form>
        </div>
      </div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand">EZHOST <strong>×</strong> VOUCHLY<span style={{ color: 'var(--lime)' }}>.</span></div><p className="footer-note">Mit Leidenschaft gebaut, mit Humor ausgeschrieben. Diese Seite ist ein fiktives Designkonzept und keine offizielle Stellenanzeige oder verbindliche Vergütungszusage.</p></div></footer>
  </>;
}
