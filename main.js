(() => {
  "use strict";

  const friends = [
    {
      name: "Vonchay Somanit",
      birthday: "2006-12-23",
      src: "images/1.jpg",
      phone: "85512345678",
    },
    { name: "Tann TitPisey", birthday: "2006-08-05", phone: "855884360855" },
    { name: "Try Thina", birthday: "2006-08-27", phone: "855966567427" },
    {
      name: "Mondul DaraRacksmey",
      birthday: "2006-04-08",
      src: "",
      phone: "85516993252",
    },
    {
      name: "Heng Sengthay",
      birthday: "2006-04-20",
      src: "images/4.jpg",
      phone: "85516767664",
    },
    { name: "Sem VatanakPanha", birthday: "2008-03-10" },
    { name: "You PhatYuth", birthday: "2006-09-19" },
    { name: "Yun Dalin", birthday: "2006-03-21" },
    { name: "Heng Voreakpich", birthday: "2007-08-16" },
    { name: "Mat Rosavy", birthday: "2006-01-13" },
    { name: "Hak ChhayVann", birthday: "2008-05-08" },
    { name: "Mean Rotha", birthday: "2003-04-12" },
  ];

  const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?background=7c5cfc&color=fff&bold=true&size=200&name=";
  const grid = document.getElementById("birthday-grid");
  const emptyState = document.getElementById("empty-state");
  const statsContainer = document.getElementById("friendship-stats");
  // Filter out people whose birthday is TODAY if you want to see who is NEXT
  const onlyFuture = friends.filter((f) => !getCountdown(f.birthday).isToday);
  // Then sort onlyFuture instead of friends...

  // --- Logic Helpers ---
  function getCountdown(birthdayStr) {
    const now = new Date();
    const bday = new Date(birthdayStr);
    let next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());

    if (
      now > next &&
      !(now.getMonth() === bday.getMonth() && now.getDate() === bday.getDate())
    ) {
      next.setFullYear(now.getFullYear() + 1);
    }

    const diff = next - now;
    const isToday =
      now.getMonth() === bday.getMonth() && now.getDate() === bday.getDate();
    const totalSecs = Math.max(0, Math.floor(diff / 1000));

    return {
      days: Math.floor(totalSecs / 86400),
      hours: Math.floor((totalSecs % 86400) / 3600),
      mins: Math.floor((totalSecs % 3600) / 60),
      secs: totalSecs % 60,
      isToday,
    };
  }

  function getZodiacVibe(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    let zodiac = "";
    let vibeClass = "";

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      zodiac = "♈ Aries";
      vibeClass = "vibe-fire";
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      zodiac = "♉ Taurus";
      vibeClass = "vibe-earth";
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      zodiac = "♊ Gemini";
      vibeClass = "vibe-air";
    } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
      zodiac = "♋ Cancer";
      vibeClass = "vibe-water";
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
      zodiac = "♌ Leo";
      vibeClass = "vibe-fire";
    } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
      zodiac = "♍ Virgo";
      vibeClass = "vibe-earth";
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      zodiac = "♎ Libra";
      vibeClass = "vibe-air";
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
      zodiac = "♏ Scorpio";
      vibeClass = "vibe-water";
    } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
      zodiac = "♐ Sagittarius";
      vibeClass = "vibe-fire";
    } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
      zodiac = "♑ Capricorn";
      vibeClass = "vibe-earth";
    } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
      zodiac = "♒ Aquarius";
      vibeClass = "vibe-air";
    } else {
      zodiac = "♓ Pisces";
      vibeClass = "vibe-water";
    }
    return { zodiac, vibeClass };
  }

  function updateFriendshipStats() {
    const statsContainer = document.getElementById("friendship-stats");
    if (!friends.length || !statsContainer) return;
    const now = new Date();
    const partyingToday = friends.filter(
      (f) => getCountdown(f.birthday).isToday,
    );
    const partyNames = partyingToday.length
      ? partyingToday.map((f) => f.name).join(", ")
      : "No one today 😴";

    // 2. Find who is NEXT (Filtering out today's people)
    const futureFriends = friends.filter(
      (f) => !getCountdown(f.birthday).isToday,
    );
    const sortedByNext = [...futureFriends].sort(
      (a, b) => getCountdown(a.birthday).days - getCountdown(b.birthday).days,
    );
    const nextUp = sortedByNext[0];

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">🔥 Party Now</span><span class="stat-value pulse">${partyNames}</span></div>
        <div class="stat-item"><span class="stat-label">📅 Next Party</span><span class="stat-value" style="color:#009ce5">${nextUp ? nextUp.name : "N/A"}</span></div>
        <div class="stat-item"><span class="stat-label">👥 Squad Size</span><span class="stat-value">${friends.length} Friends</span></div>
      </div>`;
  }

  function buildCardHTML(friend, index) {
    const c = getCountdown(friend.birthday);
    const bDate = new Date(friend.birthday);
    const { zodiac, vibeClass } = getZodiacVibe(friend.birthday);
    const nextAge =
      (new Date() >
      new Date(new Date().getFullYear(), bDate.getMonth(), bDate.getDate())
        ? new Date().getFullYear() + 1
        : new Date().getFullYear()) - bDate.getFullYear();
    const imgSrc =
      friend.src || DEFAULT_AVATAR + encodeURIComponent(friend.name);

    return `
      <div class="card ${c.isToday ? "card--today" : ""}" data-index="${index}">
        <div class="zodiac-badge ${vibeClass}">${zodiac}</div>
        <img class="card__avatar" src="${imgSrc}" onerror="this.src='${DEFAULT_AVATAR}${encodeURIComponent(friend.name)}'">
        <h3 class="card__name">${friend.name}</h3>
        <p class="card__date">${bDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} • <strong>Turning ${nextAge}</strong></p>
        ${c.isToday && friend.phone ? `<a href="sms:${friend.phone}?body=Happy Birthday!" class="btn-wish">Wish Now📱</a>` : ""}
        <div class="countdown">
          <div class="countdown__block"><span class="countdown__value" data-unit="days">${String(c.days).padStart(2, "0")}</span><span class="countdown__label">Days</span></div>
          <div class="countdown__block"><span class="countdown__value" data-unit="hours">${String(c.hours).padStart(2, "0")}</span><span class="countdown__label">Hrs</span></div>
          <div class="countdown__block"><span class="countdown__value" data-unit="mins">${String(c.mins).padStart(2, "0")}</span><span class="countdown__label">Min</span></div>
          <div class="countdown__block"><span class="countdown__value" data-unit="secs">${String(c.secs).padStart(2, "0")}</span><span class="countdown__label">Sec</span></div>
        </div>
      </div>`;
  }

  function renderAll() {
    grid.innerHTML = friends.map((f, i) => buildCardHTML(f, i)).join("");
    updateFriendshipStats();

    if (friends.some((f) => getCountdown(f.birthday).isToday)) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }

  function tick() {
    friends.forEach((friend, index) => {
      const card = grid.querySelector(`.card[data-index="${index}"]`);
      if (!card) return;
      const c = getCountdown(friend.birthday);
      card.querySelector('[data-unit="days"]').textContent = String(
        c.days,
      ).padStart(2, "0");
      card.querySelector('[data-unit="hours"]').textContent = String(
        c.hours,
      ).padStart(2, "0");
      card.querySelector('[data-unit="mins"]').textContent = String(
        c.mins,
      ).padStart(2, "0");
      card.querySelector('[data-unit="secs"]').textContent = String(
        c.secs,
      ).padStart(2, "0");
    });
  }

  // ─── Init ───────────────────────────────────────────────
  renderAll();
  setInterval(tick, 1000);
})();
