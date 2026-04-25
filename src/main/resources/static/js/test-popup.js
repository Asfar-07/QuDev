/* ══════════════════════════════════════════════════════════
   test-popup.js
   Test User Selector Popup — qu.dev

   HOW TO USE
   ──────────
   1. Add to <head>:
        <link rel="stylesheet" href="test-popup.css">

   2. Add HTML snippet (test-popup.html) anywhere inside <body>.

   3. Add before </body>:
        <script src="test-popup.js"></script>

   4. Change the Test nav-item to a <button>:
        <button class="nav-item" id="test-nav-btn"
                onclick="toggleTestPopup(event)">
          ...svg + span + tooltip...
        </button>

   ROUTE
   ──────────
   On confirm, navigates to:  /user/account/{demoId}
   Swap the console.log for window.location.href when your
   backend route is ready.
══════════════════════════════════════════════════════════ */

(function () {

  /* ── STATE ── */
  let selectedTestUser = null;

  /* ─────────────────────────────────────────────────
     toggleTestPopup(event)
     Called by the Test nav button's onclick.
     Opens the popup if closed, closes if already open.
  ───────────────────────────────────────────────── */
  function toggleTestPopup(e) {
    e.stopPropagation();                          // prevent document click from firing immediately
    const popup = document.getElementById('test-popup');
    const btn   = document.getElementById('test-nav-btn');
    const isOpen = popup.classList.contains('open');

    popup.classList.toggle('open');
    btn.classList.toggle('active', !isOpen);      // highlight nav button while open
  }

  /* ─────────────────────────────────────────────────
     closeTestPopup()
     Hides the popup and resets nav button highlight.
  ───────────────────────────────────────────────── */
  function closeTestPopup() {
    const popup = document.getElementById('test-popup');
    const btn   = document.getElementById('test-nav-btn');
    if (popup) popup.classList.remove('open');
    if (btn)   btn.classList.remove('active');
  }

  /* ─────────────────────────────────────────────────
     selectTestUser(card, demoId, name, initials, color)
     Highlights the selected user card and enables
     the "Open as this user" button.

     @param {HTMLElement} card     - The clicked .test-user-card
     @param {string}      demoId  - e.g. "demo001"
     @param {string}      name    - e.g. "Alice Harper"
     @param {string}      initials- e.g. "AH"
     @param {string}      color   - CSS color for the avatar bg
  ───────────────────────────────────────────────── */
  function selectTestUser(card, demoId, name, initials, color) {
    // Deselect all cards
    document.querySelectorAll('.test-user-card')
            .forEach(c => c.classList.remove('selected'));

    // Select this one
    card.classList.add('selected');

    // Store selection
    selectedTestUser = { demoId, name, initials, color };

    // Enable the go button
    const goBtn = document.getElementById('test-go-btn');
    if (goBtn) goBtn.disabled = false;
  }

  /* ─────────────────────────────────────────────────
     goTestUser()
     Called by the "Open as this user" button.
     Builds the route URL and navigates to it.
     Shows a toast notification confirming the action.
  ───────────────────────────────────────────────── */
  function goTestUser() {
    if (!selectedTestUser) return;

    const url = `/user/account/${selectedTestUser.demoId}`;

    console.group('%c🧪 Test User Selected', 'color:#D2C1B6;font-weight:bold;font-size:13px;');
    console.log('User   :', selectedTestUser.name);
    console.log('Demo ID:', selectedTestUser.demoId);
    console.log('URL    :', url);
    console.groupEnd();

    // ↓ Uncomment to actually navigate when backend is ready
    // window.location.href = url;

    closeTestPopup();
    showToast(selectedTestUser, url);
  }

  /* ─────────────────────────────────────────────────
     showToast(user, url)
     Shows a bottom-right confirmation toast for ~3s.
  ───────────────────────────────────────────────── */
  function showToast(user, url) {
    const toast = document.createElement('div');
    toast.className = 'test-toast';
    toast.innerHTML = `
      <div class="test-toast-dp" style="background:${user.color};">
        ${user.initials}
      </div>
      <div>
        <div class="test-toast-name">${user.name}</div>
        <div class="test-toast-url">${url}</div>
      </div>`;

    document.body.appendChild(toast);

    // Fade out after 2.8s then remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  /* ─────────────────────────────────────────────────
     Close popup when clicking anywhere outside it.
  ───────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const popup = document.getElementById('test-popup');
    const btn   = document.getElementById('test-nav-btn');
    if (
      popup &&
      popup.classList.contains('open') &&
      !popup.contains(e.target) &&
      btn && !btn.contains(e.target)
    ) {
      closeTestPopup();
    }
  });

  /* ─────────────────────────────────────────────────
     Close popup on Escape key.
  ───────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTestPopup();
  });

  /* ─────────────────────────────────────────────────
     Expose functions globally so inline onclick=""
     attributes in the HTML can call them.
  ───────────────────────────────────────────────── */
  window.toggleTestPopup  = toggleTestPopup;
  window.closeTestPopup   = closeTestPopup;
  window.selectTestUser   = selectTestUser;
  window.goTestUser       = goTestUser;

})();
