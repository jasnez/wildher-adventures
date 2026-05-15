/**
 * POST /api/newsletter
 *
 * Adds the submitted email to the configured Resend Audience.
 * No-op when RESEND_API_KEY or RESEND_AUDIENCE_ID is unset — the route
 * still returns 200 so local dev without a Resend account doesn't break
 * the form, but logs a warning server-side.
 *
 * Minimal anti-spam: rejects malformed emails. Real rate-limiting will
 * land in a follow-up (M16: Upstash Ratelimit + Turnstile) when traffic
 * justifies it.
 */
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// Loose RFC-5322 — good enough to reject typos, not a security boundary.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn(
      '[newsletter] Resend not configured — set RESEND_API_KEY and RESEND_AUDIENCE_ID. Email accepted but not stored.'
    );
    // Return success so dev/no-creds environments don't fail the form.
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error) {
      // "already_exists" is normal — don't expose the SDK shape but still 200.
      if ((error as { name?: string }).name === 'validation_error') {
        return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
      }
      console.error('[newsletter] Resend contacts.create failed:', error);
      return NextResponse.json({ ok: false, error: 'provider_error' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error('[newsletter] Resend SDK threw:', err);
    return NextResponse.json({ ok: false, error: 'provider_error' }, { status: 502 });
  }
}
