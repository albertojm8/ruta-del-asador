document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.nav-mobile-panel');

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && mobilePanel) {
    toggle.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
    });

    mobilePanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobilePanel.classList.remove('open');
      });
    });
  }

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- MODAL MANAGER (shared by specialty / bodeguita / reservation) ---------- */
  const modalOverlays = Array.from(document.querySelectorAll('.modal-overlay'));
  let modalLastFocused = null;

  const closeModal = (overlay) => {
    overlay.classList.remove('is-open');
    if (!document.querySelector('.modal-overlay.is-open')) {
      document.body.style.overflow = '';
      if (modalLastFocused) modalLastFocused.focus();
    }
    if (overlay === reservationOverlay) {
      setTimeout(() => {
        reservationForm.hidden = false;
        reservationSuccess.hidden = true;
        reservationForm.reset();
      }, 250);
    }
  };

  const openModal = (overlay, trigger) => {
    if (!overlay) return;
    if (!document.querySelector('.modal-overlay.is-open')) {
      modalLastFocused = trigger || document.activeElement;
    }
    modalOverlays.forEach((el) => { if (el !== overlay) el.classList.remove('is-open'); });
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  modalOverlays.forEach((overlay) => {
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.modal-overlay.is-open');
    if (open) closeModal(open);
  });

  /* ---------- SPECIALTY MODAL ---------- */
  const specialtyOverlay = document.getElementById('specialtyModalOverlay');
  const specialtyImg = document.getElementById('specialtyModalImg');
  const specialtyTitle = document.getElementById('specialtyModalTitle');
  const specialtyDesc = document.getElementById('specialtyModalDesc');

  document.querySelectorAll('.js-specialty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      specialtyImg.src = btn.dataset.img;
      specialtyImg.alt = btn.dataset.alt || '';
      specialtyTitle.textContent = btn.dataset.title || '';
      specialtyDesc.textContent = btn.dataset.desc || '';
      openModal(specialtyOverlay, btn);
    });
  });

  /* ---------- BODEGUITA MODAL ---------- */
  const bodeguitaOverlay = document.getElementById('bodeguitaModalOverlay');
  document.querySelectorAll('.js-open-bodeguita').forEach((btn) => {
    btn.addEventListener('click', () => openModal(bodeguitaOverlay, btn));
  });

  /* ---------- RESERVATION MODAL ---------- */
  const reservationOverlay = document.getElementById('reservationModalOverlay');
  const reservationForm = document.getElementById('reservationForm');
  const reservationSuccess = document.getElementById('reservationSuccess');
  const reservationBack = document.getElementById('reservationBack');

  document.querySelectorAll('.js-open-reservation').forEach((btn) => {
    btn.addEventListener('click', () => openModal(reservationOverlay, btn));
  });

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(reservationForm);
      const subject = `Reserva — ${data.get('nombre')} — ${data.get('fecha')} ${data.get('hora')}`;
      const body = [
        `Nombre: ${data.get('nombre')}`,
        `Fecha: ${data.get('fecha')}`,
        `Hora: ${data.get('hora')}`,
        `Personas: ${data.get('personas')}`,
        `Teléfono: ${data.get('telefono')}`,
        `Comentario: ${data.get('comentario') || '—'}`,
      ].join('\n');
      const mailto = `mailto:reservas@rutadelasador.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      reservationForm.hidden = true;
      reservationSuccess.hidden = false;

      window.location.href = mailto;
    });
  }

  if (reservationBack) {
    reservationBack.addEventListener('click', () => {
      reservationForm.hidden = false;
      reservationSuccess.hidden = true;
      reservationForm.reset();
    });
  }
});
