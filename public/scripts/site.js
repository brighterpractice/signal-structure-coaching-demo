const mobileMenu = document.querySelector('.mobile-nav');
const menuToggle = mobileMenu?.querySelector('summary');

mobileMenu?.addEventListener('toggle', () => {
  menuToggle?.setAttribute(
    'aria-label',
    mobileMenu.open ? 'Close navigation' : 'Open navigation'
  );
});

mobileMenu?.querySelector('nav')?.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;

  mobileMenu.removeAttribute('open');

  const target = new URL(link.href);
  if (target.pathname === window.location.pathname && target.hash) {
    requestAnimationFrame(() => menuToggle?.focus());
  }
});

mobileMenu?.querySelectorAll('.mobile-subtoggle').forEach((toggle) => {
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const group = toggle.closest('.mobile-group');
    const panel = group?.querySelector('.mobile-subpanel');

    if (!panel) return;

    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const willExpand = !expanded;

    toggle.setAttribute('aria-expanded', String(willExpand));
    panel.hidden = !willExpand;
  });
});

const appointmentControl = document.getElementById('mobile-appointment');
const mobileViewport = window.matchMedia('(max-width: 47.999rem)');
let returnTimer;

const showAppointmentControl = () => {
  window.clearTimeout(returnTimer);
  appointmentControl?.classList.remove('is-retreating');
};

const handleScroll = () => {
  if (
    !appointmentControl ||
    !mobileViewport.matches ||
    document.activeElement === appointmentControl
  ) {
    return;
  }

  appointmentControl.classList.add('is-retreating');
  window.clearTimeout(returnTimer);
  returnTimer = window.setTimeout(showAppointmentControl, 450);
};

window.addEventListener('scroll', handleScroll, { passive: true });
appointmentControl?.addEventListener('focus', showAppointmentControl);
mobileViewport.addEventListener('change', showAppointmentControl);

/* Desktop navigation with delayed close behavior. */
(() => {
  const initializeDesktopDropdowns = () => {
    const nav = document.querySelector('.desktop-nav');
    if (!nav) return;

    const dropdowns = [...nav.querySelectorAll('details')];
    const closeTimers = new Map();

    const cancelClose = (dropdown) => {
      const timer = closeTimers.get(dropdown);

      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(dropdown);
      }
    };

    const closeDropdown = (dropdown) => {
      cancelClose(dropdown);
      dropdown.open = false;
    };

    const scheduleClose = (dropdown) => {
      cancelClose(dropdown);

      const timer = setTimeout(() => {
        dropdown.open = false;
        closeTimers.delete(dropdown);
      }, 350);

      closeTimers.set(dropdown, timer);
    };

    const closeOthers = (current) => {
      dropdowns.forEach((dropdown) => {
        if (dropdown !== current) {
          closeDropdown(dropdown);
        }
      });
    };

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener('toggle', () => {
        if (dropdown.open) {
          cancelClose(dropdown);
          closeOthers(dropdown);
        }
      });

      dropdown.addEventListener('mouseenter', () => {
        cancelClose(dropdown);
      });

      dropdown.addEventListener('mouseleave', () => {
        scheduleClose(dropdown);
      });
    });

    document.addEventListener('pointerdown', (event) => {
      if (!nav.contains(event.target)) {
        dropdowns.forEach(closeDropdown);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        dropdowns.forEach(closeDropdown);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeDesktopDropdowns,
      { once: true }
    );
  } else {
    initializeDesktopDropdowns();
  }
})();
