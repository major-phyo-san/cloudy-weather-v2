const CONSENT_COOKIE = 'cloudy_weather_consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export function readConsent() {
  if (typeof document === 'undefined') return {};
  const entry = document.cookie.split('; ').find(cookie => cookie.startsWith(`${CONSENT_COOKIE}=`));
  if (!entry) return {};
  try {
    return JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)));
  } catch {
    return {};
  }
}

export function saveConsent(changes) {
  if (typeof document === 'undefined') return;
  const consent = { ...readConsent(), ...changes, updatedAt: new Date().toISOString() };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function hasStorageConsent() {
  return readConsent().storage === 'granted';
}

export function hasLocationConsent() {
  return readConsent().location === 'granted';
}

export function markLocationChoiceForSession() {
  locationChoiceMadeThisSession = true;
}

export function hasLocationChoiceBeenMadeThisSession() {
  return locationChoiceMadeThisSession;
}

let locationChoiceMadeThisSession = false;
