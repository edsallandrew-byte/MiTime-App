/**
 * Calculates Local Mean Solar Time (MiTime) from a longitude.
 *
 * Solar noon = the moment the sun is directly overhead at the given longitude.
 * MiTime offset from UTC = longitude / 15 hours (Earth rotates 15°/hour).
 *
 * Includes the Equation of Time correction for higher accuracy (~16 min range).
 */

function equationOfMinutes(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const dayOfYear = Math.floor(diff / 86400000);
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

export function getMiTime(longitude: number, date: Date = new Date()): Date {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const longitudeOffsetMs = (longitude / 15) * 3600000;
  const eotMs = equationOfMinutes(date) * 60000;
  return new Date(utcMs + longitudeOffsetMs + eotMs);
}

export function formatMiTime(date: Date): string {
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`;
}

export function getMiTimeOffset(longitude: number): string {
  const totalMinutes = longitude * 4; // 4 min per degree
  const sign = totalMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = Math.round(abs % 60);
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
