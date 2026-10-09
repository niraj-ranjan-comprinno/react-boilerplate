/** Hides the middle of the local part: alex@example.com → a**x@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.trim().split("@");
  if (!domain) return email;
  const masked =
    local.length <= 2
      ? local[0] + "*".repeat(Math.max(local.length - 1, 1))
      : local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}

/** Keeps the country prefix and the last two digits: +12025550189 → +12*******89 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.length <= 5) return digits;
  return digits.slice(0, 3) + "*".repeat(digits.length - 5) + digits.slice(-2);
}
