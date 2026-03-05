/* ========================================
   Friend-Clock — Main Script
   Vanilla JS · Code-configured friends list
   ======================================== */

(() => {
  "use strict";

  // ══════════════════════════════════════════════════════════
  //  FRIENDS LIST — Edit this array to add / remove friends.
  //  Each entry needs: name, birthday (YYYY-MM-DD), and an
  //  optional image URL. That's it!
  // ══════════════════════════════════════════════════════════
  const friends = [
    { name: "Vonchay Somanit", birthday: "2006-12-23" },
    { name: "Tann TitPisey", birthday: "2006-08-05" },
    { name: "Try Thina", birthday: "2006-08-27" },
    { name: "Mondul DaraRacksmey", birthday: "2006-04-08" },
    { name: "Heng Sengthay", birthday: "2006-04-20" },
    { name: "Sem VatanakPanha", birthday: "2008-03-10" },
    { name: "You PhatYuth", birthday: "2006-09-19" },
    { name: "Yun Dalin", birthday: "2006-03-21" },
    { name: "Heng Voreakpich", birthday: "2007-08-16" },
    { name: "Mat Rosavy", birthday: "2006-01-13" },
    { name: "Hak ChhayVann", birthday: "2008-05-08" },
    { name: "Mean Rotha", birthday: "2003-04-12" },
    // { name: "Alex Johnson",  birthday: "2000-06-15", image: "" },
    // { name: "Sam Lee",       birthday: "1999-12-25", image: "https://example.com/sam.jpg" },
  ];

  // ─── Constants & DOM refs ───────────────────────────────
  const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?background=7c5cfc&color=fff&bold=true&size=200&name=";

  const grid = document.getElementById("birthday-grid");
  const emptyState = document.getElementById("empty-state");

  // ─── Countdown calculation ──────────────────────────────
  function getCountdown(birthdayStr) {
    const now = new Date();
    const bday = new Date(birthdayStr);

    let next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());

    if (now > next) {
      next = new Date(now.getFullYear() + 1, bday.getMonth(), bday.getDate());
    }

    const diff = next - now;
    const isToday = diff < 86400000 && next.getDate() === now.getDate();

    const totalSecs = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    return { days, hours, mins, secs, isToday };
  }

  // ─── Render helpers ─────────────────────────────────────
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }

  function buildCardHTML(friend, index) {
    const imgSrc =
      friend.image || DEFAULT_AVATAR + encodeURIComponent(friend.name);

    // Get the countdown data
    const countdown = getCountdown(friend.birthday);
    const { days, hours, mins, secs, isToday } = countdown;

    // --- NEW: Calculate "Turning Age" Logic ---
    const birthDate = new Date(friend.birthday);
    const now = new Date();
    let nextYear = now.getFullYear();

    // Determine if the next birthday is this year or next year
    const nextBdayDate = new Date(
      now.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (now > nextBdayDate) {
      nextYear = now.getFullYear() + 1;
    }

    // The age they will be on that next birthday
    const nextAge = nextYear - birthDate.getFullYear();
    // ------------------------------------------

    return `
      <div class="card ${isToday ? "card--today" : ""}" data-index="${index}">
        <img class="card__avatar" src="${imgSrc}" alt="${friend.name}" onerror="this.src='${DEFAULT_AVATAR}${encodeURIComponent(friend.name)}'" />
        <h3 class="card__name">${friend.name}</h3>
        <p class="card__date">${formatDate(friend.birthday)} • <strong>Turning ${nextAge}</strong></p>
        <div class="countdown">
          <div class="countdown__block">
            <span class="countdown__value" data-unit="days">${pad(days)}</span>
            <span class="countdown__label">Days</span>
          </div>
          <div class="countdown__block">
            <span class="countdown__value" data-unit="hours">${pad(hours)}</span>
            <span class="countdown__label">Hrs</span>
          </div>
          <div class="countdown__block">
            <span class="countdown__value" data-unit="mins">${pad(mins)}</span>
            <span class="countdown__label">Min</span>
          </div>
          <div class="countdown__block">
            <span class="countdown__value" data-unit="secs">${pad(secs)}</span>
            <span class="countdown__label">Sec</span>
          </div>
        </div>
      </div>`;
  }

  function renderAll() {
    friends.sort((a, b) => {
      const ca = getCountdown(a.birthday);
      const cb = getCountdown(b.birthday);
      const totalA = ca.days * 86400 + ca.hours * 3600 + ca.mins * 60 + ca.secs;
      const totalB = cb.days * 86400 + cb.hours * 3600 + cb.mins * 60 + cb.secs;
      return totalA - totalB;
    });

    grid.innerHTML = friends.map((f, i) => buildCardHTML(f, i)).join("");
    emptyState.classList.toggle("hidden", friends.length > 0);

    // --- NEW: Confetti Trigger ---
    // If ANY friend has a birthday today, launch the confetti!
    const birthdayToday = friends.some((f) => getCountdown(f.birthday).isToday);
    if (birthdayToday) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7c5cfc", "#00e5a0", "#ff5c75"], // Using your theme colors
      });
    }
  }

  // ─── Live tick ──────────────────────────────────────────
  function tick() {
    friends.forEach((friend, index) => {
      const card = grid.querySelector(`.card[data-index="${index}"]`);
      if (!card) return;

      const { days, hours, mins, secs, isToday } = getCountdown(
        friend.birthday,
      );
      card.querySelector('[data-unit="days"]').textContent = pad(days);
      card.querySelector('[data-unit="hours"]').textContent = pad(hours);
      card.querySelector('[data-unit="mins"]').textContent = pad(mins);
      card.querySelector('[data-unit="secs"]').textContent = pad(secs);
      card.classList.toggle("card--today", isToday);
    });
  }

  // ─── Init ───────────────────────────────────────────────
  renderAll();
  setInterval(tick, 1000);
})();
