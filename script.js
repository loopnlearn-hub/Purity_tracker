(() => {
  const startInput = document.getElementById('startInput');
  const setStartBtn = document.getElementById('setStartBtn');
  const dayCountEl = document.getElementById('dayCount');
  const checkinBtn = document.getElementById('checkin-btn');
  const resetBtn = document.getElementById('reset-btn');
  const quoteEl = document.getElementById('quote');
  const progressList = document.getElementById('progress-list');

  const quotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "The only way to finish is to start.",
    "Strength does not come from physical capacity, but from an indomitable will.",
    "Small daily improvements lead to stunning results.",
    "Your future is created by what you do today, not tomorrow.",
    "Self-control is strength. Right thought is mastery.",
    "Fall seven times, stand up eight."
  ];

  const STORAGE_KEYS = {
    startDate: 'purityMissionStartDate',
    checkins: 'purityMissionCheckins'
  };

  let startDate = null;
  let checkins = {};

  function saveState() {
    localStorage.setItem(STORAGE_KEYS.startDate, startDate.toISOString());
    localStorage.setItem(STORAGE_KEYS.checkins, JSON.stringify(checkins));
  }

  function loadState() {
    const storedDate = localStorage.getItem(STORAGE_KEYS.startDate);
    const storedCheckins = localStorage.getItem(STORAGE_KEYS.checkins);

    if (storedDate) {
      startDate = new Date(storedDate);
      startInput.value = startDate.toISOString().slice(0, 10);
    }

    if (storedCheckins) {
      try {
        checkins = JSON.parse(storedCheckins);
      } catch {
        checkins = {};
      }
    }
  }

  function calculateDayCount() {
    const today = new Date();
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function updateDayCount() {
    const dayCount = calculateDayCount();
    dayCountEl.textContent = dayCount;
  }

  function updateProgressLog() {
    progressList.innerHTML = '';
    const entries = Object.keys(checkins)
      .map(Number)
      .sort((a, b) => a - b);
    entries.forEach(day => {
      const div = document.createElement('div');
      div.textContent = `✅ Day ${day}`;
      progressList.appendChild(div);
    });
  }

  function showRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = `"${random}"`;
  }

  function init() {
    loadState();
    if (!startDate) {
      startDate = new Date();
      saveState();
    }
    updateDayCount();
    updateProgressLog();
    showRandomQuote();
  }

  setStartBtn.addEventListener('click', () => {
    const selected = startInput.value;
    const today = new Date().toISOString().slice(0, 10);
    if (!selected || selected > today) {
      alert("Please select a valid start date not in the future.");
      return;
    }
    startDate = new Date(selected);
    checkins = {};
    saveState();
    updateDayCount();
    updateProgressLog();
    showRandomQuote();
  });

  checkinBtn.addEventListener('click', () => {
    const todayIndex = calculateDayCount();
    if (!checkins[todayIndex]) {
      checkins[todayIndex] = true;
      saveState();
      updateProgressLog();
    } else {
      alert('✅ Already checked in today!');
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your mission?')) {
      startDate = new Date();
      checkins = {};
      saveState();
      startInput.value = startDate.toISOString().slice(0, 10);
      updateDayCount();
      updateProgressLog();
      showRandomQuote();
    }
  });

  init();
})();