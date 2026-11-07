// Κεντρικός Διαχειριστής Πλοήγησης (Sidebar Routing) & Διαδραστικών Στοιχείων (Accordions)

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const openBtn = document.getElementById('sidebar-open-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const sidebarNavItems = document.querySelectorAll('#main-sidebar .sidebar-nav-item');
  const views = document.querySelectorAll('.portal-view');
  const savedBadge = document.getElementById('sidebar-saved-badge');

  function updateSidebarSavedCount() {
    try {
      const stored = localStorage.getItem('speedboat_saved_questions');
      const count = stored ? JSON.parse(stored).length : 0;
      if (savedBadge) savedBadge.textContent = count;
    } catch(e) {}
  }

  function switchView(targetViewId) {
    if (targetViewId === 'view-saved-test') {
      views.forEach(v => v.classList.add('hidden'));
      const quizView = document.getElementById('view-quiz');
      if (quizView) quizView.classList.remove('hidden');
      if (window.quizApp) window.quizApp.startQuiz('saved');
    } else if (targetViewId === 'view-stats') {
      views.forEach(v => v.classList.add('hidden'));
      const statsView = document.getElementById('view-stats');
      if (statsView) statsView.classList.remove('hidden');
      if (window.quizApp) window.quizApp.renderStats();
    } else {
      views.forEach(v => v.classList.add('hidden'));
      const target = document.getElementById(targetViewId);
      if (target) target.classList.remove('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    sidebarNavItems.forEach(link => {
      const target = link.getAttribute('data-sidebar-target');
      if (target === targetViewId) {
        link.className = "sidebar-nav-item w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all bg-sky-600 text-white shadow-md font-bold";
      } else {
        link.className = "sidebar-nav-item w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold";
      }
    });

    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');

    updateSidebarSavedCount();
  }

  // Global router access
  window.switchView = switchView;
  window.updateSidebarSavedCount = updateSidebarSavedCount;

  // Bind click navigation for all elements with data-sidebar-target
  document.querySelectorAll('[data-sidebar-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-sidebar-target');
      switchView(target);
    });
  });

  // Mobile sidebar controls
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('-translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (sidebar) sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    });
  }

  // Accordion toggles
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.accordion-icon');
      const isExpanded = !content.classList.contains('hidden');

      if (isExpanded) {
        content.classList.add('hidden');
        btn.classList.remove('bg-sky-50/70', 'border-sky-300');
        if (icon) icon.textContent = '▼';
      } else {
        content.classList.remove('hidden');
        btn.classList.add('bg-sky-50/70', 'border-sky-300');
        if (icon) icon.textContent = '▲';
      }
    });
  });

  // Toggle all accordions in section
  document.querySelectorAll('.btn-toggle-all-accordions').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const section = toggleBtn.closest('.portal-view');
      if (!section) return;

      const items = section.querySelectorAll('.accordion-content');
      const allOpen = Array.from(items).every(it => !it.classList.contains('hidden'));

      items.forEach(item => {
        const btn = item.previousElementSibling;
        const icon = btn ? btn.querySelector('.accordion-icon') : null;

        if (allOpen) {
          item.classList.add('hidden');
          if (btn) btn.classList.remove('bg-sky-50/70', 'border-sky-300');
          if (icon) icon.textContent = '▼';
        } else {
          item.classList.remove('hidden');
          if (btn) btn.classList.add('bg-sky-50/70', 'border-sky-300');
          if (icon) icon.textContent = '▲';
        }
      });

      toggleBtn.textContent = allOpen ? " Άνοιγμα Όλων" : " Κλείσιμο Όλων";
    });
  });

  // ==============================================================
// ==============================================================
  // Welcome Modal Logic (Απευθείας εμφάνιση 1ης φοράς)
  // ==============================================================
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeCloseBtn = document.getElementById('welcome-close-btn');
  const welcomeStartBtn = document.getElementById('welcome-start-btn');
  const welcomeDontShow = document.getElementById('welcome-dont-show');

  function openWelcomeModal() {
    const modal = welcomeModal || document.getElementById('welcome-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  function closeWelcomeModal() {
    const modal = welcomeModal || document.getElementById('welcome-modal');
    if (modal) {
      modal.classList.add('hidden');
      if (welcomeDontShow && welcomeDontShow.checked) {
        try {
          localStorage.setItem('taxyploo_welcome_v2', 'true');
        } catch(e) {}
      }
    }
  }

  window.openWelcomeModal = openWelcomeModal;
  window.closeWelcomeModal = closeWelcomeModal;

  if (welcomeCloseBtn) {
    welcomeCloseBtn.addEventListener('click', closeWelcomeModal);
  }

  if (welcomeStartBtn) {
    welcomeStartBtn.addEventListener('click', () => {
      try {
        localStorage.setItem('taxyploo_welcome_v2', 'true');
      } catch(e) {}
      const modal = welcomeModal || document.getElementById('welcome-modal');
      if (modal) modal.classList.add('hidden');
    });
  }

  if (welcomeModal) {
    welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) {
        closeWelcomeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const modal = welcomeModal || document.getElementById('welcome-modal');
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeWelcomeModal();
    }
  });

  // Άμεση εμφάνιση στο 1ο άνοιγμα (χωρίς καθυστέρηση)
  try {
    const hasSeenWelcome = localStorage.getItem('taxyploo_welcome_v2');
    if (!hasSeenWelcome) {
      openWelcomeModal();
    }
  } catch(e) {
    openWelcomeModal();
  }

  // ==============================================================
  // Mobile Pull-to-Refresh (Απότομο scroll / σύρσιμο προς τα πάνω από την κορυφή)
  // ==============================================================
  const pullIndicator = document.getElementById('pull-refresh-indicator');
  const pullSpinner = document.getElementById('pull-refresh-spinner');
  const pullLabel = document.getElementById('pull-refresh-label');

  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;
  let isPullingToRefresh = false;
  let isRefreshing = false;

  const PULL_THRESHOLD = 75; // px έλξης για επιβεβαίωση ανανέωσης

  function getScrollTop() {
    const area = document.getElementById('main-scroll-area');
    if (area && typeof area.scrollTop === 'number') {
      return area.scrollTop;
    }
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function handleTouchStart(e) {
    if (isRefreshing) return;
    if (e.touches.length !== 1) return;

    // Ενεργοποιείται μόνο εάν ο χρήστης βρίσκεται στην κορυφή της σελίδας
    if (getScrollTop() <= 2) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isPullingToRefresh = true;
    } else {
      isPullingToRefresh = false;
    }
  }

  function handleTouchMove(e) {
    if (!isPullingToRefresh || isRefreshing) return;
    if (e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartY;
    const deltaX = Math.abs(currentX - touchStartX);

    // Εάν μετακινείται προς τα πάνω ή οριζόντια, ακυρώνεται η έλξη
    if (getScrollTop() > 2 || deltaX > deltaY) {
      isPullingToRefresh = false;
      if (pullIndicator) {
        pullIndicator.style.transform = 'translateY(-100%)';
      }
      return;
    }

    if (deltaY > 5) {
      // Σύρσιμο προς τα κάτω από την κορυφή (Pull down)
      const pullProgress = Math.min(deltaY * 0.45, 95);
      if (pullIndicator) {
        pullIndicator.style.transform = `translateY(${pullProgress}px)`;
      }

      if (deltaY >= PULL_THRESHOLD) {
        if (pullLabel) pullLabel.textContent = 'Αφήστε για ανανέωση';
        if (pullSpinner) pullSpinner.style.transform = 'rotate(180deg)';
      } else {
        if (pullLabel) pullLabel.textContent = 'Σύρετε για ανανέωση';
        if (pullSpinner) pullSpinner.style.transform = 'rotate(0deg)';
      }
    }
  }

  function handleTouchEnd(e) {
    if (!isPullingToRefresh || isRefreshing) return;
    isPullingToRefresh = false;

    const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
    const deltaY = touchEndY - touchStartY;
    const duration = Date.now() - touchStartTime;
    const velocity = deltaY / Math.max(duration, 1);

    // Ενεργοποίηση εάν ξεπέρασε το όριο ή εάν έγινε απότομο swipe (flick με ταχύτητα >= 0.45 και απόσταση >= 40px)
    const isAbruptSwipe = deltaY >= 40 && velocity >= 0.45;
    const isPastThreshold = deltaY >= PULL_THRESHOLD;

    if (isPastThreshold || isAbruptSwipe) {
      isRefreshing = true;
      if (pullIndicator) {
        pullIndicator.style.transform = 'translateY(70px)';
      }
      if (pullLabel) {
        pullLabel.textContent = 'Ανανέωση σελίδας...';
      }
      if (pullSpinner) {
        pullSpinner.classList.add('animate-spin');
      }

      setTimeout(() => {
        window.location.reload();
      }, 350);
    } else {
      if (pullIndicator) {
        pullIndicator.style.transform = 'translateY(-100%)';
      }
    }
  }

  // Σύνδεση ακροατών touch στην κύρια περιοχή κύλισης και στο παράθυρο
  const mainScroll = document.getElementById('main-scroll-area');
  if (mainScroll) {
    mainScroll.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainScroll.addEventListener('touchmove', handleTouchMove, { passive: true });
    mainScroll.addEventListener('touchend', handleTouchEnd, { passive: true });
    mainScroll.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

  updateSidebarSavedCount();
});
