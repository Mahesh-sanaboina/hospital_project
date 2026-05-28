/* ============================================
   MediNova Advanced Care – App JavaScript
   ============================================ */

/* ─── LOADING SCREEN ─────────────────────── */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
let loadProgress = 0;

const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18 + 5;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }
  loaderBar.style.width = loadProgress + '%';
}, 80);

document.body.style.overflow = 'hidden';

/* ─── NAVBAR ─────────────────────────────── */
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
  navLinks.classList.toggle('active');
});

// Close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('open');
    navLinks.classList.remove('active');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !mobileToggle.contains(e.target)) {
    mobileToggle.classList.remove('open');
    navLinks.classList.remove('active');
  }
});

/* ─── PARTICLE FIELD ─────────────────────── */
const particleField = document.getElementById('particle-field');
if (particleField) {
  const colors = [
    'rgba(147,197,253,0.5)',
    'rgba(240,171,252,0.4)',
    'rgba(255,255,255,0.3)',
    'rgba(96,165,250,0.4)',
  ];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'prt';
    const size = Math.random() * 5 + 3;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${Math.random() * 6 + 5}s;
      --delay:${Math.random() * 6}s;
      border-radius:50%;
    `;
    particleField.appendChild(p);
  }
}

/* ─── SCROLL REVEAL ──────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── ANIMATED COUNTERS ──────────────────── */
const statsSection = document.getElementById('stats');
let counted = false;

const countUp = (el) => {
  const target = +el.getAttribute('data-count');
  const suffix = el.getAttribute('data-suffix') || '';
  const format = el.getAttribute('data-format');
  const duration = 2200;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    if (format === 'lakh') {
      const val = (current / 100000).toFixed(1);
      el.textContent = val + ' Lakh' + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
    if (current < target) requestAnimationFrame(update);
    else {
      if (format === 'lakh') el.textContent = '1 Lakh' + suffix;
      else el.textContent = target + suffix;
    }
  };
  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    document.querySelectorAll('.stat-num[data-count]').forEach(countUp);
  }
}, { threshold: 0.4 });

if (statsSection) statsObserver.observe(statsSection);

/* ─── STORIES SLIDER ─────────────────────── */
const storiesTrack = document.getElementById('stories-track');
const storyDots = document.querySelectorAll('.sldr-dot');
const storyPrev = document.getElementById('story-prev');
const storyNext = document.getElementById('story-next');

let storyIdx = 0;
const storyTotal = document.querySelectorAll('.story-slide').length;

const goToStory = (idx) => {
  storyIdx = (idx + storyTotal) % storyTotal;
  if (storiesTrack) storiesTrack.style.transform = `translateX(-${storyIdx * 100}%)`;
  storyDots.forEach((d, i) => d.classList.toggle('active', i === storyIdx));
};

if (storyPrev) storyPrev.addEventListener('click', () => goToStory(storyIdx - 1));
if (storyNext) storyNext.addEventListener('click', () => goToStory(storyIdx + 1));
storyDots.forEach(d => d.addEventListener('click', () => goToStory(+d.getAttribute('data-i'))));

let storyTimer = setInterval(() => goToStory(storyIdx + 1), 7000);
[storyPrev, storyNext, ...storyDots].forEach(el => {
  if (el) el.addEventListener('click', () => {
    clearInterval(storyTimer);
    storyTimer = setInterval(() => goToStory(storyIdx + 1), 7000);
  });
});

/* ─── SEARCH MODAL ───────────────────────── */
const searchModal = document.getElementById('search-modal');
const searchField = document.getElementById('search-field');
const openSearchBtns = document.querySelectorAll('#nav-search-btn');
const closeSearchBtn = document.getElementById('search-close');

const openSearch = () => {
  searchModal.classList.add('open');
  setTimeout(() => searchField.focus(), 100);
};
const closeSearch = () => searchModal.classList.remove('open');

openSearchBtns.forEach(b => b && b.addEventListener('click', openSearch));
closeSearchBtn && closeSearchBtn.addEventListener('click', closeSearch);
searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });

document.querySelectorAll('.search-hint').forEach(h => {
  h.addEventListener('click', () => { searchField.value = h.textContent; });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSearch(); closeBookingModal(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

/* ─── BOOKING MODAL ──────────────────────── */
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const bookingClose = document.getElementById('booking-close');

const openBooking = (doctor = '', dept = '', pkg = '') => {
  bookingModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (doctor && document.getElementById('bk-doctor')) {
    const sel = document.getElementById('bk-doctor');
    for (let o of sel.options) {
      if (o.text.includes(doctor)) { sel.value = o.value; break; }
    }
  }
  if (dept && document.getElementById('bk-dept')) {
    const sel = document.getElementById('bk-dept');
    for (let o of sel.options) {
      if (o.value === dept || o.text === dept) { sel.value = o.value; break; }
    }
  }
  if (pkg && document.getElementById('bk-pkg')) {
    const sel = document.getElementById('bk-pkg');
    for (let o of sel.options) {
      if (o.text.includes(pkg)) { sel.value = o.value; break; }
    }
  }

  // Set min date to today
  const dateInput = document.getElementById('bk-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
};

const closeBookingModal = () => {
  bookingModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (bookingForm) {
      bookingForm.reset();
      bookingSuccess.style.display = 'none';
      bookingForm.querySelector('.booking-submit').style.display = 'block';
      Array.from(bookingForm.querySelectorAll('.form-input, .form-label')).forEach(el => el.style.display = '');
    }
  }, 400);
};

window.openBooking = openBooking;

bookingClose && bookingClose.addEventListener('click', closeBookingModal);
bookingModal && bookingModal.addEventListener('click', (e) => {
  if (e.target === bookingModal) closeBookingModal();
});

// Nav book buttons
document.getElementById('nav-book-btn') && document.getElementById('nav-book-btn').addEventListener('click', () => openBooking());
document.getElementById('hero-book-btn') && document.getElementById('hero-book-btn').addEventListener('click', () => openBooking());

// Form submission
bookingForm && bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('bk-name').value.trim();
  const phone = document.getElementById('bk-phone').value.trim();
  if (!name || !phone) return;

  // Animate out form fields
  bookingForm.querySelectorAll('.form-input, .form-label').forEach(el => {
    el.style.transition = 'opacity .3s ease';
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, 300);
  });
  bookingForm.querySelector('.booking-submit').style.display = 'none';

  setTimeout(() => {
    bookingSuccess.style.display = 'block';
    bookingSuccess.style.animation = 'slide-up .5s ease both';
  }, 400);

  setTimeout(() => closeBookingModal(), 5000);
});

/* ─── INLINE APPOINTMENT FORM ────────────── */
const apptForm = document.getElementById('appt-form');
const apptSuccess = document.getElementById('appt-success');
const apptDate = document.getElementById('appt-date');
if (apptDate) apptDate.min = new Date().toISOString().split('T')[0];

apptForm && apptForm.addEventListener('submit', (e) => {
  e.preventDefault();
  apptForm.querySelectorAll('input, select, textarea, button[type=submit]').forEach(el => {
    el.style.transition = 'opacity .3s ease';
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, 300);
  });
  apptForm.querySelectorAll('.form-label').forEach(el => {
    setTimeout(() => { el.style.display = 'none'; }, 300);
  });
  setTimeout(() => {
    apptSuccess.style.display = 'block';
    apptSuccess.style.animation = 'slide-up .5s ease both';
  }, 400);
});

/* ─── CHAT WIDGET ────────────────────────── */
const chatWidget = document.getElementById('chat-widget');
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInp = document.getElementById('chat-inp');
const chatSend = document.getElementById('chat-send');

chatToggle && chatToggle.addEventListener('click', () => {
  chatWidget.classList.toggle('open');
  if (chatWidget.classList.contains('open')) chatInp.focus();
});
chatClose && chatClose.addEventListener('click', () => chatWidget.classList.remove('open'));

const chatResponses = {
  appoint: "To book an appointment, click the 'Book Appointment' button at the top, or call us at 1800-1800-999. Our team confirms within 15 minutes!",
  ivf: "Our IVF program has an 85%+ success rate! Dr. Evelyn Thorne leads our fertility team. Would you like to schedule a consultation?",
  fertil: "MediNova's fertility centre offers IVF, ICSI, PGT genetic testing, egg freezing and more. Shall I connect you with our fertility specialist?",
  cardio: "Our cardiology department has a 24/7 cardiac cath lab, robotic surgery, and primary angioplasty services. Emergency cardiac line: 1800-1800-999.",
  emerg: "Our emergency number is 1800-1800-999. Our mobile ICU responds within 10 minutes. Do you need immediate assistance?",
  doctor: "We have 250+ specialist doctors. You can search and book directly through the 'Find Doctor' section or I can help you find the right specialist!",
  package: "We offer several health packages: Full Body Checkup (₹3,999), Heart Care Elite (₹9,999), Women's Wellness (₹7,499), and Fertility Readiness (₹14,999).",
  default: "Thank you for reaching out to MediNova! Our care team will connect with you shortly. Alternatively, call us anytime on 1800-1800-999."
};

const addChat = (text, type) => {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const sendChat = () => {
  const text = chatInp.value.trim();
  if (!text) return;
  addChat(text, 'user');
  chatInp.value = '';

  const lc = text.toLowerCase();
  let reply = chatResponses.default;
  if (lc.includes('appoint') || lc.includes('book')) reply = chatResponses.appoint;
  else if (lc.includes('ivf')) reply = chatResponses.ivf;
  else if (lc.includes('fertil') || lc.includes('baby') || lc.includes('pregnan')) reply = chatResponses.fertil;
  else if (lc.includes('cardio') || lc.includes('heart')) reply = chatResponses.cardio;
  else if (lc.includes('emerg') || lc.includes('ambulance') || lc.includes('urgent')) reply = chatResponses.emerg;
  else if (lc.includes('doctor') || lc.includes('specialist') || lc.includes('consult')) reply = chatResponses.doctor;
  else if (lc.includes('package') || lc.includes('checkup') || lc.includes('price') || lc.includes('cost')) reply = chatResponses.package;

  setTimeout(() => addChat(reply, 'bot'), 900);
};

chatSend && chatSend.addEventListener('click', sendChat);
chatInp && chatInp.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChat(); });

/* ─── NEWSLETTER ─────────────────────────── */
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm && newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = newsletterForm.querySelector('.newsletter-submit');
  btn.textContent = '✓ Subscribed!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  newsletterForm.querySelector('input').value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3500);
});

/* ─── SMOOTH SCROLL ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── DOCTOR CARD DRAG SCROLL ────────────── */
const doctorsWrap = document.querySelector('.doctors-scroll-wrap');
if (doctorsWrap) {
  let isDown = false, startX, scrollLeft;
  doctorsWrap.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - doctorsWrap.offsetLeft;
    scrollLeft = doctorsWrap.scrollLeft;
    doctorsWrap.style.cursor = 'grabbing';
  });
  ['mouseleave','mouseup'].forEach(ev => {
    doctorsWrap.addEventListener(ev, () => {
      isDown = false;
      doctorsWrap.style.cursor = '';
    });
  });
  doctorsWrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - doctorsWrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    doctorsWrap.scrollLeft = scrollLeft - walk;
  });
}

/* ─── DEPARTMENT CARD GLOW on hover ──────── */
document.querySelectorAll('.dept-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.dept-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(37,99,235,.18), transparent 70%)`;
    }
  });
});
