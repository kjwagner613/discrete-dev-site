// SHA-256 hash of your password:
const EXPECTED_HASH = "d5591e1cc44953fb2f6b4020fe673b437282bab92b270380189af082b0c0fd7f";

// Optional: simple session flag so you don't have to re-enter on every refresh
const SESSION_KEY = "dd_preview_unlocked";

async function hash(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function goToSite() {
  // If your real site entry is "/", this is enough.
  // If your app lives at a subpath, adjust here.
  window.location.href = "/";
}

(async function init() {
  // If already unlocked this session, skip gate
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
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
        sessionStorage.setItem(SESSION_KEY, "1");
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
