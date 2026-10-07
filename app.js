/**
 * HOSTEL BUDDY AI & PORTFOLIO INTERACTIVITY SCRIPT
 * Creator: Alex Chen
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initInteractiveChat();
  initProjectFilters();
  initModal();
  initContactForm();
  initEmailCopy();
  initMascot();
});

/* ==========================================================================
   THEME TOGGLE (LIGHT & DARK MODE)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn || !themeIcon) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.textContent = '🌙';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled');
  });
}

/* ==========================================================================
   STICKY NAV & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navList = document.getElementById('navLinks');

  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileBtn && navList) {
    mobileBtn.addEventListener('click', () => {
      navList.classList.toggle('mobile-open');
    });

    // Close when clicking nav item
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
      });
    });
  }

  // Jump to chat button
  const chatJumpBtn = document.getElementById('chatBuddyJumpBtn');
  if (chatJumpBtn) {
    chatJumpBtn.addEventListener('click', () => {
      scrollAndFocusChat();
    });
  }
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollAndFocusChat() {
  const mockup = document.getElementById('phoneMockup');
  const input = document.getElementById('chatInputField');
  if (mockup) {
    mockup.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      if (input) input.focus();
    }, 450);
  }
}

/* ==========================================================================
   INTERACTIVE HOSTEL BUDDY CHAT SIMULATION
   ========================================================================== */
function initInteractiveChat() {
  const form = document.getElementById('phoneChatForm');
  const input = document.getElementById('chatInputField');
  const stream = document.getElementById('chatMessagesStream');
  const chips = document.querySelectorAll('.prompt-chip-btn');

  if (!form || !input || !stream) return;

  // Prompt chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        submitUserMessage(query);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      submitUserMessage(query);
      input.value = '';
    }
  });

  function submitUserMessage(userText) {
    appendUserBubble(userText);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      generateBotResponse(userText);
    }, 850);
  }

  function appendUserBubble(text) {
    const timeStr = getCurrentTime();
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.innerHTML = `${escapeHTML(text)}<span class="bubble-time">${timeStr} ✓✓</span>`;
    stream.appendChild(bubble);
    scrollChatToBottom();
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'chatTypingIndicator';
    typing.className = 'chat-bubble bot';
    typing.innerHTML = '<span style="display:inline-flex; gap:4px; align-items:center;">🤖 Buddy is typing<span class="typing-dots">...</span></span>';
    stream.appendChild(typing);
    scrollChatToBottom();
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('chatTypingIndicator');
    if (typing) typing.remove();
  }

  function generateBotResponse(inputQuery) {
    const q = inputQuery.toLowerCase();
    const timeStr = getCurrentTime();
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';

    if (q.includes('hostel') || q.includes('college') || q.includes('room') || q.includes('stay')) {
      botBubble.innerHTML = `
        Found 3 top-rated hostels near your university:
        <div class="chat-hostel-card" style="margin-top: 8px;">
          <div class="chat-hostel-thumb" style="background: linear-gradient(135deg, #4338CA, #6366F1);">
            🏢
          </div>
          <div class="chat-hostel-info">
            <h5>Royal Palms Student Residency</h5>
            <div class="chat-hostel-meta">
              <span>📍 0.9 km • 2-sharing AC</span>
              <span>⭐ 4.8 (210 reviews)</span>
            </div>
            <button class="chat-hostel-btn" onclick="triggerHostelDetailsModal('Royal Palms')">Explore Vacancies ($180/mo)</button>
          </div>
        </div>
        <span class="bubble-time">${timeStr}</span>
      `;
    } else if (q.includes('dinner') || q.includes('mess') || q.includes('food') || q.includes('menu') || q.includes('eat')) {
      botBubble.innerHTML = `
        🍲 <strong>Today's Mess Menu (Dinner 7:30 - 9:30 PM):</strong><br>
        • Paneer Butter Masala & Dal Tadka<br>
        • Fresh Tandoori Rotis & Jeera Rice<br>
        • Crunchy Salad & Gulab Jamun 🍮<br>
        <span style="font-size:0.75rem; color:var(--accent-green); font-weight:600; display:block; margin-top:4px;">✨ 4.9/5 satisfaction rating today!</span>
        <span class="bubble-time">${timeStr}</span>
      `;
    } else if (q.includes('wifi') || q.includes('report') || q.includes('issue') || q.includes('complaint') || q.includes('broken')) {
      const ticketId = 'HB-' + Math.floor(1000 + Math.random() * 9000);
      botBubble.innerHTML = `
        🛠️ <strong>Complaint Logged Successfully!</strong><br>
        <strong>Ticket #${ticketId}</strong> has been routed to Hostel Maintenance & Network Ops.<br>
        • Status: <span style="color:#0284C7; font-weight:700;">In Progress</span><br>
        • Estimated resolution: <strong>Under 90 mins</strong><br>
        Warden notified via SMS.
        <span class="bubble-time">${timeStr}</span>
      `;
    } else if (q.includes('curfew') || q.includes('timing') || q.includes('gate') || q.includes('night') || q.includes('time')) {
      botBubble.innerHTML = `
        ⏰ <strong>Hostel Gate Timings:</strong><br>
        • Weekday In-Time: <strong>10:00 PM</strong><br>
        • Weekend In-Time: <strong>10:30 PM</strong><br>
        Need late entry permission? Submit a digital pass request before 8:00 PM through the app!
        <span class="bubble-time">${timeStr}</span>
      `;
    } else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      botBubble.innerHTML = `
        Hello there! 👋 I am <strong>Hostel Buddy AI</strong>, developed by <strong>Alex Chen</strong>. I can search hostels, check mess menus, route maintenance tickets, and answer campus policy questions! What would you like to know?
        <span class="bubble-time">${timeStr}</span>
      `;
    } else {
      botBubble.innerHTML = `
        I analyzed your query: "<em>${escapeHTML(inputQuery)}</em>".<br>
        As Hostel Buddy AI, I've cross-referenced campus databases and hostel records to assist you. Try asking about <strong>hostels nearby</strong>, <strong>mess menus</strong>, or <strong>submitting a maintenance report</strong>!
        <span class="bubble-time">${timeStr}</span>
      `;
    }

    stream.appendChild(botBubble);
    scrollChatToBottom();
  }

  function scrollChatToBottom() {
    stream.scrollTop = stream.scrollHeight;
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
}

// Global modal trigger for hostel card
window.triggerHostelDetailsModal = function(hostelName) {
  showToast(`Viewing details for ${hostelName} (Room Vacancy: 4 available)`);
};

/* ==========================================================================
   PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   LIGHTBOX MODAL FOR HIGH-RES MOCKUP
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('mockupModal');
  const openTrigger = document.getElementById('openMockupModalBtn');
  const inspectTrigger = document.getElementById('inspectDesignBtn');
  const closeBtn = document.getElementById('closeMockupModalBtn');

  window.openMockupModal = function() {
    if (modal) modal.classList.add('active');
  };

  if (openTrigger) {
    openTrigger.addEventListener('click', openMockupModal);
  }

  if (inspectTrigger) {
    inspectTrigger.addEventListener('click', openMockupModal);
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   CONTACT FORM INTERACTIVITY
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span> ⏳';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
    }, 900);
  });
}

/* ==========================================================================
   ONE-CLICK EMAIL COPY
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'alex.chen.innovator@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      copyBtn.textContent = 'Copied!';
      showToast('Email address copied to clipboard!');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }).catch(() => {
      showToast('Copied: ' + email);
    });
  });
}

/* ==========================================================================
   MASCOT INTERACTION
   ========================================================================== */
function initMascot() {
  const mascot = document.getElementById('buddyMascot');
  if (!mascot) return;

  const greetings = [
    "Buddy says: 'Hi! I'm your AI hostel guide!' 🤖",
    "Buddy says: 'Have you checked tonight's mess menu?' 🍲",
    "Buddy says: 'Need to report a leaky faucet? I've got you!' 🛠️",
    "Buddy says: 'Over 120 hostels cataloged and counting!' 🏠"
  ];

  mascot.addEventListener('click', () => {
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    showToast(randomGreet);
    mascot.style.transform = 'scale(1.15) rotate(-5deg)';
    setTimeout(() => {
      mascot.style.transform = '';
    }, 400);
  });
}

/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
