// Security utility functions

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  // This is a simple implementation
  // In a production app, use a library like DOMPurify
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate a random secure ID
export function generateSecureId(length = 16): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint8Array(length);

  // Use crypto.getRandomValues for secure random generation
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * characters.length);
    }
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % characters.length);
  }

  return result;
}

// Check if a password meets security requirements
export function isStrongPassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { isValid: true, message: "Password meets all requirements" };
}

// Mask sensitive data for logging
export function maskSensitiveData(data: any, fieldsToMask: string[]): any {
  if (!data) return data;

  const maskedData = { ...data };

  fieldsToMask.forEach((field) => {
    if (field in maskedData && maskedData[field]) {
      if (typeof maskedData[field] === "string") {
        // Show first and last character, mask the rest
        const value = maskedData[field];
        if (value.length <= 2) {
          maskedData[field] = "***";
        } else {
          maskedData[field] = value[0] + "***" + value[value.length - 1];
        }
      } else {
        maskedData[field] = "***";
      }
    }
  });

  return maskedData;
}
