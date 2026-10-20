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

Das Formular validiert Name, E-Mail, Schwerpunkt, optionalen Link und eine kurze Motivation und schickt die Einsendung über [Web3Forms](https://web3forms.com) direkt an das hinterlegte Postfach – ohne eigenen Server.

- **Access Key:** wird aus `NEXT_PUBLIC_WEB3FORMS_KEY` gelesen. Auf GitHub Pages kommt er aus der Repository-Variable `WEB3FORMS_ACCESS_KEY` (Settings → Secrets and variables → Actions → Variables). Lokal in `.env.local` eintragen.
- **Ohne Access Key:** Es wird nichts versendet; das Formular bietet den Entwurf als Textdatei zum Download an.

Der Access Key ist eine öffentliche Kennung und darf im ausgelieferten Code stehen.

### Vor einer echten Veröffentlichung

Diese Seite ist bewusst eine fiktive Demo. Bevor echte personenbezogene Bewerbungsdaten entgegengenommen werden, Impressum/Datenschutzhinweise und Aufbewahrungsregeln ergänzen, Spam- und Rate-Limiting einrichten, rechtliche Angaben prüfen und Texte sowie Empfänger konfigurieren. Die Seite enthält keine Zusage zu Vergütung oder Unternehmensanteilen.

## Projektstruktur

- `app/page.jsx` – One-Pager, Design und Formular
- `app/globals.css` – Responsives Styling
- `app/layout.jsx` – Metadata / Seitensprache

Zusätzlich zur Next.js-Version gibt es separat eine **standalone HTML-Datei** (ohne Server), deren Formular lokal einen `.txt`-Entwurf herunterlädt.
