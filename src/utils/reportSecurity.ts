/**
 * Utility functions for securing and encrypting access to the personal Salary Report.
 * Uses the standard Web Crypto API (SHA-256) to ensure private credentials are never
 * stored in plain text and only accessible to the authorized user.
 */

const STORAGE_KEY = 'tcdd_salary_report_pin_hash_v1';
const SALT = 'tcdd_personal_report_salt_2026_ilyas';

// Kullanıcının talep ettiği varsayılan şifre: 1510
export const DEFAULT_PIN = '1510';

export async function hashPassword(password: string): Promise<string> {
  const trimmed = password.trim();
  if (!trimmed) return '';

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(SALT + trimmed);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback if subtle crypto throws
    }
  }

  // Fallback hashing algorithm if SubtleCrypto is unavailable
  let hash = 0x811c9dc5;
  const str = SALT + trimmed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ('0000000' + (hash >>> 0).toString(16)).substr(-8);
}

export function isPinConfigured(): boolean {
  return true;
}

export function getStoredPinHash(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export async function setStoredPin(password: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const hash = await hashPassword(password);
  if (!hash) return false;
  localStorage.setItem(STORAGE_KEY, hash);
  return true;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const trimmed = password.trim();
  if (!trimmed) return false;

  const stored = getStoredPinHash();
  if (!stored) {
    // Kullanıcı henüz özel şifre kaydetmemişse varsayılan 1510 geçerlidir
    return trimmed === DEFAULT_PIN;
  }
  // Kullanıcı şifresini değiştirdiyse hash kontrolü yapılır
  const hash = await hashPassword(trimmed);
  return hash === stored;
}

/**
 * Şifre değiştirme işlemi: Yalnızca mevcut şifreyi doğru giren kullanıcı
 * yeni şifre belirleyebilir. Güvenlik açığı oluşmaması için mevcut şifre şarttır.
 */
export async function changePasswordWithCurrent(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const isCurrentValid = await verifyPassword(currentPassword);
  if (!isCurrentValid) {
    return { success: false, error: 'Mevcut şifrenizi hatalı girdiniz! Güvenlik nedeniyle şifre değiştirilemedi.' };
  }

  const cleanNew = newPassword.trim();
  if (cleanNew.length < 4) {
    return { success: false, error: 'Yeni şifreniz en az 4 karakterden oluşmalıdır.' };
  }

  const ok = await setStoredPin(cleanNew);
  if (!ok) {
    return { success: false, error: 'Şifre kaydedilirken bir hata oluştu.' };
  }

  return { success: true };
}

export function clearStoredPin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

