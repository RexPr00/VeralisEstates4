
(() => {
  const body = document.body;
  const lockScroll = (on) => { body.style.overflow = on ? 'hidden' : ''; };

  const trapFocus = (container, active) => {
    if (!active) return;
    const selectors = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = [...container.querySelectorAll(selectors)];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    const onKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    container.dataset.trap = 'on';
    container.__trapHandler = onKey;
    container.addEventListener('keydown', onKey);
    first.focus();
  };
  const releaseTrap = (container) => {
    if (container?.__trapHandler) container.removeEventListener('keydown', container.__trapHandler);
  };

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.lang');
      wrap.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang').forEach(l => { if (!l.contains(e.target)) l.classList.remove('open'); });
  });

  const drawer = document.getElementById('mobileDrawer');
  const openDrawer = document.getElementById('openDrawer');
  const closeDrawerBtn = drawer?.querySelector('.drawer-close');
  const closeDrawer = () => { drawer.classList.remove('open'); lockScroll(false); releaseTrap(drawer); };
  openDrawer?.addEventListener('click', () => { drawer.classList.add('open'); lockScroll(true); trapFocus(drawer, true); });
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelector('.drawer-backdrop')?.addEventListener('click', closeDrawer);

  const modal = document.getElementById('privacyModal');
  const openModalBtn = document.getElementById('openPrivacy');
  const closeBtns = modal ? modal.querySelectorAll('[data-close-modal]') : [];
  const closeModal = () => { modal.classList.remove('open'); lockScroll(false); releaseTrap(modal); };
  openModalBtn?.addEventListener('click', () => { modal.classList.add('open'); lockScroll(true); trapFocus(modal, true); });
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modal?.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer?.classList.contains('open')) closeDrawer();
      if (modal?.classList.contains('open')) closeModal();
    }
  });

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const parent = item.parentElement;
      parent.querySelectorAll('.faq-item').forEach(x => {
        if (x !== item) { x.classList.remove('active'); x.querySelector('.faq-btn').setAttribute('aria-expanded','false'); }
      });
      const active = item.classList.toggle('active');
      btn.setAttribute('aria-expanded', String(active));
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
