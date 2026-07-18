const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const SITE_RELATIVE_PATH = /^\/(?!\/)/;

interface LinkOptions {
  allowHash?: boolean;
  allowHttp?: boolean;
  allowMailto?: boolean;
}

export function sanitizeLinkUrl(value: string, options: LinkOptions = {}) {
  const {
    allowHash = true,
    allowHttp = false,
    allowMailto = true,
  } = options;
  const normalized = value.trim();

  if (!normalized || CONTROL_CHARACTERS.test(normalized)) return null;
  if (allowHash && normalized.startsWith("#")) return normalized;
  if (SITE_RELATIVE_PATH.test(normalized)) return normalized;

  try {
    const url = new URL(normalized);
    const allowedProtocols = new Set([
      "https:",
      ...(allowHttp ? ["http:"] : []),
      ...(allowMailto ? ["mailto:"] : []),
    ]);
    return allowedProtocols.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function sanitizeAssetUrl(value?: string) {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized || CONTROL_CHARACTERS.test(normalized)) return null;
  if (SITE_RELATIVE_PATH.test(normalized)) return normalized;

  try {
    const url = new URL(normalized);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function isSafeLengthPart(value: string) {
  if (value === "0") return true;
  const match = /^(\d+(?:\.\d+)?)(px|rem|em|%|vw|vh|vmin|vmax)$/.exec(value);
  if (!match) return false;

  const amount = Number(match[1]);
  const unit = match[2];
  if (!Number.isFinite(amount)) return false;
  if (["%", "vw", "vh", "vmin", "vmax"].includes(unit)) return amount <= 100;
  if (["rem", "em"].includes(unit)) return amount <= 100;
  return amount <= 4096;
}

export function sanitizeCssLength(value?: string) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return isSafeLengthPart(normalized) ? normalized : null;
}

export function sanitizeCssSpacing(value?: string) {
  if (!value) return null;
  const parts = value.trim().toLowerCase().split(/\s+/);
  return parts.length >= 1 && parts.length <= 4 && parts.every(isSafeLengthPart)
    ? parts.join(" ")
    : null;
}

export function sanitizeCssColor(value?: string) {
  if (!value) return null;
  const normalized = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) return normalized;
  if (/^var\(--[a-z0-9-]+\)$/i.test(normalized)) return normalized;
  if (["transparent", "currentcolor"].includes(normalized.toLowerCase())) return normalized;
  return null;
}
