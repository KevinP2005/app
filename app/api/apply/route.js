import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const focusLabels = {
  product: 'Product & Ideen',
  support: 'Support & Menschen',
  both: 'Beides – ich mag Abwechslung',
};

export async function POST(request) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 10000) {
      return NextResponse.json({ error: 'Die Nachricht ist zu lang.' }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Ungültige Formularangaben.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Ungültige Formularangaben.' }, { status: 400 });
  }
  // Honeypot: quietly discard automated spam submissions.
  if (body.website) return NextResponse.json({ ok: true });

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const focus = typeof body.focus === 'string' ? body.focus : '';
  const link = typeof body.link === 'string' ? body.link.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || name.length > 100 || !emailRE.test(email) || email.length > 200 || !focusLabels[focus] ||
      message.length < 10 || message.length > 3000 || link.length > 300) {
    return NextResponse.json({ error: 'Bitte prüfe die Pflichtfelder und versuche es erneut.' }, { status: 400 });
  }
  if (link) {
    try {
      if (!['http:', 'https:'].includes(new URL(link).protocol)) throw new Error('Invalid protocol');
    } catch {
      return NextResponse.json({ error: 'Bitte gib eine gültige http(s)-URL ein.' }, { status: 400 });
    }
  }

  const { RESEND_API_KEY, APPLICATION_TO_EMAIL, APPLICATION_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !APPLICATION_TO_EMAIL || !APPLICATION_FROM_EMAIL) {
    return NextResponse.json({ code: 'NOT_CONFIGURED', error: 'Der E-Mail-Versand ist noch nicht eingerichtet.' }, { status: 503 });
  }

  const content = [
    'Neue Vouchly-Interessensbekundung (fiktive Ausschreibung)',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Fokus: ${focusLabels[focus]}`,
    `Link: ${link || '–'}`,
    '',
    'Motivation:',
    message,
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: APPLICATION_FROM_EMAIL,
        to: [APPLICATION_TO_EMAIL],
        reply_to: email,
        subject: `Vouchly: Interessensbekundung von ${name.replace(/[\r\n]/g, ' ')}`,
        text: content,
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Vouchly application delivery failed', response.status);
      return NextResponse.json({ error: 'Die Nachricht konnte nicht versendet werden.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Vouchly application server error:', error);
    return NextResponse.json({ error: 'Der E-Mail-Dienst ist derzeit nicht erreichbar.' }, { status: 502 });
  }
}
