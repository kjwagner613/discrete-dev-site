const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const navContent = document.getElementById('navContent');
const navLinks = navContent ? navContent.querySelectorAll('a') : [];

function setSidebarOpen(open, skipFocus = false) {
  if (open) {
    sidebar.classList.add('expanded');
    sidebar.classList.remove('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'true');
    navContent.setAttribute('aria-hidden', 'false');
    navLinks.forEach(link => link.removeAttribute('tabindex'));
    // Focus first link for keyboard users
    if (!skipFocus && navLinks.length) navLinks[0].focus();
  } else {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
    navContent.setAttribute('aria-hidden', 'true');
    navLinks.forEach(link => link.setAttribute('tabindex', '-1'));
    // Return focus to the toggle
    if (!skipFocus) toggleBtn.focus();
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   const activeLink = document.querySelector("nav a.active");
//   if (activeLink) {
//     activeLink.focus();
//   }
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const links = document.querySelectorAll("nav a");
//     const currentPath = window.location.pathname.split("/").pop();

//     links.forEach(link => {
//         const linkPath = link.getAttribute("href");
//         if (linkPath === currentPath) {
//             link.classList.add("active");
//             link.focus();
//         } else {
//             link.classList.remove("active");
//             link.blur(); // This clears any lingering focus
//         }
//     });
// });

// Toggle and let CSS handle transitions
toggleBtn.addEventListener('click', (e) => {
  // Prevent immediate blur when controlling focus
  e.stopPropagation();
  setSidebarOpen(!sidebar.classList.contains('expanded'));
});

// Close sidebar when clicking outside (optional) - keeps UI tidy
document.addEventListener('click', (e) => {
  const isClickInside = sidebar.contains(e.target);
  if (!isClickInside && sidebar.classList.contains('expanded')) {
    setSidebarOpen(false);
  }
});

// Close sidebar with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('expanded')) {
    setSidebarOpen(false);
  }
});

// Initialize to collapsed state on load (set tabindex and aria-hidden) without moving focus
setSidebarOpen(false, true);

/* Contact form: AJAX submit to Formspree with inline feedback */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.contact-form');
  forms.forEach(form => {
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const clearStatus = () => {
      statusEl.textContent = '';
      statusEl.classList.remove('success', 'error');
      statusEl.removeAttribute('tabindex');
    };

    const showStatus = (msg, type = '') => {
      clearStatus();
      if (!msg) return;
      statusEl.classList.add(type);
      // append message text and a dismiss button
      const textNode = document.createTextNode(msg + ' ');
      statusEl.appendChild(textNode);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'status-dismiss';
      btn.setAttribute('aria-label', 'Dismiss message');
      btn.textContent = 'Dismiss';
      btn.addEventListener('click', () => {
        clearStatus();
        submitBtn.focus();
      }, { once: true });
      statusEl.appendChild(btn);
      // make it focusable so screen readers announce it
      statusEl.setAttribute('tabindex', '0');
      statusEl.focus();
    };

    form.addEventListener('submit', async (e) => {
      if (!form.checkValidity()) {
        // let browser show validation UI
        return;
      }
      e.preventDefault();
      // clear any previous messages
      clearStatus();
      submitBtn.disabled = true;
      statusEl.textContent = 'Sending…';
      const formData = new FormData(form);
      try {
        const resp = await fetch(form.action, {
          method: form.method || 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (resp.ok) {
          form.reset();
          showStatus('Thank you — your email has been sent.', 'success');
        } else {
          const data = await resp.json();
          showStatus(data?.error || 'Sorry — there was a problem sending your message.', 'error');
        }
      } catch (err) {
        showStatus('Network error — please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
});