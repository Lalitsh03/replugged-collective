// Tiny status-line easter egg: flips between "offline" and "recharging"
// to echo the unplug/replug motif in the hero. Purely decorative.
(function () {
  const statusText = document.getElementById('status-text');
  if (!statusText) return;
  const states = ['signal: offline', 'battery: 100% (yours, not your phone\'s)'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % states.length;
    statusText.textContent = states[i];
  }, 4000);
})();

// Simple reveal-on-scroll for activity cards and how-steps
(function () {
  const targets = document.querySelectorAll('.activity-card, .how-step');
  if (!('IntersectionObserver' in window) || targets.length === 0) return;

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();
