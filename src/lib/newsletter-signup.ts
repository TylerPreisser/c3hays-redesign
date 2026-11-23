/**
 * Whether the page takes newsletter sign-ups. FALSE until a staff member sees and acts on them: today nobody at the church
 * reads signups from Studio, so a field that takes an email address would collect personal data that goes nowhere and
 * imply a subscription. While false, the footer and /news say "call the office" and show no email field and no Turnstile
 * widget. The signup route, its Turnstile contract and their tests stay in the code, unused by the page.
 * (Plain module, no imports: client components read it.)
 */
export const NEWSLETTER_SIGNUP_LIVE = false;
/** What the page says instead of a form. */
export const NEWSLETTER_CALL_LINE = "Want C3 News by email? Call the office at (785) 625-5483.";
