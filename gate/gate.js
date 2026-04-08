// SHA-256 hash of your password:
const EXPECTED_HASH = "857cfb69cce77c5eaf83d79d7cc25ec523a2720e83f9176ce870ec297dfc4b0c";

// Cookie name for authentication (readable by server-side redirects)
const AUTH_COOKIE = "dd_preview_auth";
const COOKIE_DURATION_DAYS = 30;

async function hash(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

function goToSite() {
  // After setting cookie, redirect to intended page or home
  const target = new URL(window.location.href).searchParams.get("redirect") || "/";
  window.location.href = target;
}

(async function init() {
  // If already authenticated (cookie exists), go to site
  if (getCookie(AUTH_COOKIE) === "1") {
    goToSite();
    return;
  }

  const form = document.getElementById("gate-form");
  const input = document.getElementById("pw");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const value = input.value || "";
    if (!value) {
      errorEl.textContent = "Password required.";
      return;
    }

    try {
      const h = await hash(value);
      if (h === EXPECTED_HASH) {
        setCookie(AUTH_COOKIE, "1", COOKIE_DURATION_DAYS);
        goToSite();
      } else {
        errorEl.textContent = "Incorrect password.";
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Something went wrong. Try again.";
    }
  });
})();
