# Vouchly by EZHost – One-Pager

Modernes responsives, deutschsprachiges Recruiting-**Designkonzept** für eine **fiktive Mitgründerrolle** in Product & Support. Absichtlich humorvoll formuliert; kein offizielles Stellenangebot.

## Lokal starten

Voraussetzung: Node.js 20.9+.

```bash
npm install
npm run dev
```

Dann `http://localhost:3000` öffnen.

## Formular

Das Formular validiert Name, E-Mail, Schwerpunkt, optionalen Link und eine kurze Motivation.

- **Ohne E-Mail-Konfiguration:** Die API liefert `NOT_CONFIGURED`; das Formular zeigt transparent an, dass **nichts versendet wurde**, und bietet einen Download des Entwurfs als Textdatei an.
- **Mit E-Mail-Konfiguration:** Der Next.js-Server versendet die Interessensbekundung über die [Resend API](https://resend.com/docs/send-with-nextjs) an dein definiertes Postfach. Der API-Schlüssel bleibt serverseitig.

Dazu `.env.example` nach `.env.local` kopieren und ausfüllen:

```env
RESEND_API_KEY=re_...
APPLICATION_TO_EMAIL=deine-echte-empfangsadresse@example.com
APPLICATION_FROM_EMAIL=Vouchly <bewerbung@deine-verifizierte-domain.de>
```

`APPLICATION_FROM_EMAIL` muss eine bei Resend zugelassene Absenderadresse sein. Nach dem Setzen die Entwicklungsumgebung neu starten.

### Vor einer echten Veröffentlichung

Diese Seite ist bewusst eine fiktive Demo. Bevor echte personenbezogene Bewerbungsdaten entgegengenommen werden, Impressum/Datenschutzhinweise und Aufbewahrungsregeln ergänzen, Spam- und Rate-Limiting einrichten, rechtliche Angaben prüfen und Texte sowie Empfänger konfigurieren. Die Seite enthält keine Zusage zu Vergütung oder Unternehmensanteilen.

## Projektstruktur

- `app/page.jsx` – One-Pager, Design und Formular
- `app/globals.css` – Responsives Styling
- `app/api/apply/route.js` – Optionaler E-Mail-Versand über Resend
- `app/layout.jsx` – Metadata / Seitensprache

Zusätzlich zur Next.js-Version gibt es separat eine **standalone HTML-Datei** (ohne Server), deren Formular lokal einen `.txt`-Entwurf herunterlädt.
