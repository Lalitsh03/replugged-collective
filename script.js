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

// Activity photos: if the file isn't in images/ yet, drop the broken <img>
// so the hatched placeholder underneath stays on show. Drop a correctly named
// file into images/ and the card fills itself in — no code change needed.
(function () {
  const markEmpty = (img) => {
    img.hidden = true;
    const slot = img.closest('.activity-media');
    if (slot) slot.classList.add('is-empty');
  };

  document.querySelectorAll('.activity-photo').forEach(img => {
    // this script runs at the end of <body>, so a 404 may already have landed
    if (img.complete && img.naturalWidth === 0) {
      markEmpty(img);
      return;
    }
    img.addEventListener('error', () => markEmpty(img), { once: true });
  });
})();

// Signup form (signup.html). Validates, then shows an honest confirmation —
// there's no backend, so nothing is sent or stored anywhere. If a real endpoint
// ever exists, give the <form> an action/method and delete this block.
(function () {
  const form = document.getElementById('signup-form');
  const done = document.getElementById('signup-done');
  if (!form || !done) return;

  const showError = (id, show) => {
    const msg = form.querySelector('[data-error-for="' + id + '"]');
    const input = document.getElementById(id);
    if (msg) msg.hidden = !show;
    input.classList.toggle('has-error', show);
    input.setAttribute('aria-invalid', show ? 'true' : 'false');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const nameBad = name.value.trim() === '';
    // deliberately loose: something@something.something
    const emailBad = !/^\S+@\S+\.\S+$/.test(email.value.trim());

    showError('name', nameBad);
    showError('email', emailBad);

    if (nameBad || emailBad) {
      (nameBad ? name : email).focus();
      return;
    }

    const data = new FormData(form);
    const hobby = data.get('hobby') || 'No preference';
    const cadence = form.querySelector('input[name="cadence"]:checked');

    document.getElementById('done-name').textContent = name.value.trim();
    document.getElementById('done-summary').innerHTML = '';
    [
      ['Email', email.value.trim()],
      ['Curious about', hobby],
      ['Cadence', cadence ? cadence.value.replace(/-/g, ' ') : 'monthly']
    ].forEach(([label, value]) => {
      const li = document.createElement('li');
      li.innerHTML = '<span>' + label + '</span>';
      li.append(value);                      // textNode — never parses user input as HTML
      document.getElementById('done-summary').appendChild(li);
    });

    form.hidden = true;
    done.hidden = false;
    done.setAttribute('tabindex', '-1');
    done.focus();
  });

  // clear an error as soon as the visitor starts fixing it
  ['name', 'email'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => showError(id, false));
  });
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
