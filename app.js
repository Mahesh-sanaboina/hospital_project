document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a nav-link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- Hero Section Glowing Particles Generator ---
  const particleContainer = document.getElementById('particle-container');
  if (particleContainer) {
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random positioning
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random sizes
      const size = Math.random() * 6 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation delay and duration
      particle.style.animationDelay = `${Math.random() * 4}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      
      // Random colors from theme (soft pink / medical blue)
      if (Math.random() > 0.5) {
        particle.style.background = 'rgba(236, 72, 153, 0.4)'; // pink
      } else {
        particle.style.background = 'rgba(37, 99, 235, 0.4)'; // blue
      }
      
      particleContainer.appendChild(particle);
    }
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- Department Tabs Switcher ---
  const tabButtons = document.querySelectorAll('.dept-tab-btn');
  const contentPanels = document.querySelectorAll('.dept-content-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Update active button state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active panel state
      contentPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `dept-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- Animated Statistics Counters ---
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 2000; // 2 seconds animation
      const increment = target / (duration / 16); // ~60fps
      
      let current = 0;
      const updateCount = () => {
        current += increment;
        if (current < target) {
          if (target > 1000) {
            // Format large numbers (e.g. 120,000 to 120K+)
            const valueK = Math.floor(current / 1000);
            stat.textContent = `${valueK}K+`;
          } else {
            stat.textContent = Math.floor(current);
          }
          requestAnimationFrame(updateCount);
        } else {
          if (target > 1000) {
            stat.textContent = `${target / 1000}K+`;
          } else {
            stat.textContent = target + (target === 99 || target === 80 ? '%' : '+');
            if (target === 99) stat.textContent = '99%';
            if (target === 80) stat.textContent = '80+';
          }
        }
      };
      updateCount();
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- Patient Success Stories Slider ---
  const storyTrack = document.getElementById('story-track');
  const slides = document.querySelectorAll('.story-slide');
  const prevBtn = document.getElementById('prev-story');
  const nextBtn = document.getElementById('next-story');
  const dotElements = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const totalSlides = slides.length;

  const updateSlidePosition = () => {
    storyTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots active state
    dotElements.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
  };

  if (nextBtn && prevBtn && storyTrack) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dotElements.forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentSlide = parseInt(e.target.getAttribute('data-index'));
        updateSlidePosition();
      });
    });

    // Auto play every 7 seconds
    let autoPlayInterval = setInterval(nextSlide, 7000);

    // Reset timer on manual navigation
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 7000);
    };

    [prevBtn, nextBtn, ...dotElements].forEach(el => {
      el.addEventListener('click', resetAutoPlay);
    });
  }

  // --- Floating Live Support Widget ---
  const chatBubble = document.getElementById('live-chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatBody = document.getElementById('chat-body');

  if (chatBubble && chatWindow && closeChatBtn) {
    chatBubble.addEventListener('click', () => {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
      chatBody.scrollTop = chatBody.scrollHeight;
    });

    closeChatBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });

    // Simulated responses
    const botReplies = [
      "I can assist you with scheduling. To book a priority slot, please click the 'Book Appointment' button at the top of our page.",
      "Medilux emergency services operate 24/7. In case of emergency, you can call us directly at 1800-555-999.",
      "For details on IVF treatments and success rates, please consult our Fertility specialist, Dr. Evelyn Thorne.",
      "Our hospital is located at 101, Luxury Boulevard, Medical Zone, City. Valet parking is available for all visitors."
    ];

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // User Message
      const userMsg = document.createElement('div');
      userMsg.classList.add('chat-msg', 'msg-user');
      userMsg.textContent = text;
      chatBody.appendChild(userMsg);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      // Simulated Bot Reply
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.classList.add('chat-msg', 'msg-bot');
        // Pick response based on keyword or random
        let reply = "Thank you for contacting MediLux Care. An agent will connect with you shortly.";
        const lowercaseText = text.toLowerCase();
        
        if (lowercaseText.includes('appoint') || lowercaseText.includes('book') || lowercaseText.includes('doctor')) {
          reply = botReplies[0];
        } else if (lowercaseText.includes('emerg') || lowercaseText.includes('call') || lowercaseText.includes('phone')) {
          reply = botReplies[1];
        } else if (lowercaseText.includes('ivf') || lowercaseText.includes('fertility') || lowercaseText.includes('baby')) {
          reply = botReplies[2];
        } else if (lowercaseText.includes('where') || lowercaseText.includes('address') || lowercaseText.includes('location')) {
          reply = botReplies[3];
        }
        
        botMsg.textContent = reply;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    };

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // --- Search Overlay Modal ---
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchOverlay = document.getElementById('search-overlay');

  if (openSearchBtn && closeSearchBtn && searchOverlay) {
    openSearchBtn.addEventListener('click', () => {
      searchOverlay.style.display = 'flex';
      searchOverlay.querySelector('input').focus();
    });

    closeSearchBtn.addEventListener('click', () => {
      searchOverlay.style.display = 'none';
    });

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.style.display = 'none';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
        searchOverlay.style.display = 'none';
      }
    });
  }

  // --- Booking Appointment Modal Controller ---
  const bookingModal = document.getElementById('booking-modal');
  const openBookingBtn = document.getElementById('open-booking-btn');
  const heroBookBtn = document.getElementById('hero-book-btn');
  const emergencyModalBtn = document.getElementById('emergency-modal-btn');
  const closeBookingBtn = document.getElementById('close-booking-btn');
  const appointmentForm = document.getElementById('appointment-form');
  const successMsg = document.getElementById('submit-success-msg');
  const formSubmitContainer = document.querySelector('.booking-form-submit');
  
  const selectDoctorField = document.getElementById('book-doctor');
  const selectSpecialityField = document.getElementById('book-speciality');
  const selectPackageField = document.getElementById('book-package');

  const openBooking = (docName = '', deptName = '', pkgName = 'None') => {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Set fields if passed
    if (docName) selectDoctorField.value = docName;
    if (deptName) selectSpecialityField.value = deptName;
    if (pkgName) selectPackageField.value = pkgName;

    // Set today as minimum date
    const dateInput = document.getElementById('book-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  };

  const closeBooking = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
    
    // Reset form after transition
    setTimeout(() => {
      appointmentForm.reset();
      successMsg.style.display = 'none';
      formSubmitContainer.style.display = 'block';
      // Enable all fields
      Array.from(appointmentForm.elements).forEach(el => {
        if(el.tagName !== 'BUTTON') el.style.display = 'block';
      });
      document.querySelectorAll('.form-label').forEach(lbl => lbl.style.display = 'block');
    }, 300);
  };

  if (bookingModal && closeBookingBtn) {
    if (openBookingBtn) openBookingBtn.addEventListener('click', () => openBooking());
    if (heroBookBtn) heroBookBtn.addEventListener('click', () => openBooking());
    if (emergencyModalBtn) {
      emergencyModalBtn.addEventListener('click', () => {
        openBooking('General Consultation', 'Cardiology');
        // focus on phone number and alert
        document.getElementById('book-notes').value = "EMERGENCY: Ambulance requested.";
      });
    }

    closeBookingBtn.addEventListener('click', closeBooking);
    
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBooking();
      }
    });

    // Handle context-specific clicks on doctors and departments
    document.querySelectorAll('.booking-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const doctor = btn.getAttribute('data-doctor');
        const speciality = btn.getAttribute('data-speciality');
        openBooking(doctor, speciality);
      });
    });

    document.querySelectorAll('.booking-dept-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const speciality = btn.getAttribute('data-speciality');
        openBooking('', speciality);
      });
    });

    document.querySelectorAll('.open-booking-pkg').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgName = btn.getAttribute('data-pkg');
        openBooking('', '', pkgName);
      });
    });

    // Form Submit handling with animation
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Client side checking
      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      if (!name || !phone) return;

      // Animate submission
      formSubmitContainer.style.display = 'none';
      
      // Hide form fields to show success page
      Array.from(appointmentForm.elements).forEach(el => {
        if(el.tagName !== 'BUTTON' && el.id !== 'submit-success-msg') {
          el.style.display = 'none';
        }
      });
      document.querySelectorAll('.form-label').forEach(lbl => lbl.style.display = 'none');

      // Show success container
      successMsg.style.display = 'block';

      // Auto close after 5 seconds
      setTimeout(() => {
        closeBooking();
      }, 5000);
    });
  }
});
