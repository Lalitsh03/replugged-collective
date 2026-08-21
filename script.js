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
// file into images/ and the card fills itself in, no code change needed.
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


// Activities carousel. Shows 3 cards on desktop, 2 on tablet, 1 on phones, and
// loops back to the start when it runs off either end. Without JS the track
// stays a plain grid (see .carousel-track in styles.css), so nothing is lost.
(function () {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const viewport = root.querySelector('.carousel-viewport');
  const track = root.querySelector('.carousel-track');
  const dotsWrap = root.querySelector('.carousel-dots');
  const slides = track ? Array.from(track.children) : [];
  if (!viewport || !track || slides.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let perView = 1;
  let timer = null;

  const perViewFor = (w) => (w >= 900 ? 3 : w >= 560 ? 2 : 1);
  const maxIndex = () => Math.max(0, slides.length - perView);
  const gapPx = () => parseFloat(getComputedStyle(track).columnGap) || 0;

  const renderDots = () => {
    const count = maxIndex() + 1;
    if (dotsWrap.children.length !== count) {
      dotsWrap.textContent = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Show activity ' + (i + 1) + ' of ' + count);
        dot.addEventListener('click', () => { go(i); restart(); });
        dotsWrap.appendChild(dot);
      }
    }
    Array.from(dotsWrap.children).forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  };

  const apply = () => {
    const gap = gapPx();
    const slideW = (viewport.clientWidth - gap * (perView - 1)) / perView;
    slides.forEach(s => { s.style.flex = '0 0 ' + slideW + 'px'; });
    track.style.transform = 'translateX(' + (-index * (slideW + gap)) + 'px)';
    renderDots();
  };

  // wraps around in both directions, so it never dead-ends
  const go = (i) => {
    const max = maxIndex();
    index = i < 0 ? max : (i > max ? 0 : i);
    apply();
  };

  const relayout = () => {
    perView = perViewFor(window.innerWidth);
    if (index > maxIndex()) index = maxIndex();
    apply();
  };

  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => {
    if (reduceMotion.matches || slides.length <= perView) return;
    stop();
    timer = setInterval(() => go(index + 1), 4500);
  };
  const restart = () => { stop(); start(); };

  root.querySelector('.carousel-prev').addEventListener('click', () => { go(index - 1); restart(); });
  root.querySelector('.carousel-next').addEventListener('click', () => { go(index + 1); restart(); });

  // pause while someone is actually looking at or interacting with it
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
    else if (e.key === 'ArrowRight') { go(index + 1); restart(); }
  });

  let touchX = null;
  viewport.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; stop(); }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
    start();
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(relayout, 120);
  });
  reduceMotion.addEventListener('change', () => (reduceMotion.matches ? stop() : start()));

  root.classList.add('is-ready');
  relayout();
  start();
})();


// Hobby combobox. A native <datalist> gives no control over how many rows show,
// so this swaps it for a listbox capped at five visible options that scrolls for
// the rest. Still just a text input underneath, so anything can be typed in.
// If this never runs, the datalist in the markup keeps working on its own.
(function () {
  const wrap = document.querySelector('[data-combo]');
  if (!wrap) return;
  const input = wrap.querySelector('input');
  const source = input && document.getElementById(input.getAttribute('list'));
  if (!input || !source) return;

  const all = Array.from(source.options).map(o => o.value);
  input.removeAttribute('list');   // otherwise the native dropdown doubles up

  const list = document.createElement('ul');
  list.className = 'combo-list';
  list.id = 'hobby-listbox';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  wrap.appendChild(list);

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-controls', list.id);
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');

  let items = [];
  let active = -1;

  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };

  const setActive = (i) => {
    items.forEach(li => li.classList.remove('is-active'));
    active = i;
    if (i < 0 || !items[i]) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    items[i].classList.add('is-active');
    input.setAttribute('aria-activedescendant', items[i].id);
    items[i].scrollIntoView({ block: 'nearest' });
  };

  const choose = (value) => {
    input.value = value;
    close();
    input.focus();
  };

  const open = (filter) => {
    const q = (filter || '').trim().toLowerCase();
    const matches = q ? all.filter(v => v.toLowerCase().includes(q)) : all;
    list.textContent = '';
    if (matches.length === 0) { close(); return; }
    matches.forEach((value, i) => {
      const li = document.createElement('li');
      li.id = 'hobby-opt-' + i;
      li.className = 'combo-option';
      li.setAttribute('role', 'option');
      li.textContent = value;
      // mousedown, not click: fires before blur closes the list
      li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(value); });
      list.appendChild(li);
    });
    items = Array.from(list.children);
    list.hidden = false;
    list.scrollTop = 0;
    input.setAttribute('aria-expanded', 'true');
    setActive(-1);
  };

  input.addEventListener('input', () => open(input.value));
  input.addEventListener('focus', () => open(input.value));
  input.addEventListener('blur', () => setTimeout(close, 120));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (list.hidden) { open(input.value); setActive(0); }
      else setActive(active + 1 >= items.length ? 0 : active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!list.hidden) setActive(active - 1 < 0 ? items.length - 1 : active - 1);
    } else if (e.key === 'Enter') {
      if (!list.hidden && active >= 0) { e.preventDefault(); choose(items[active].textContent); }
    } else if (e.key === 'Escape') {
      close();
    }
  });
})();


// Interest counters.
//
// Two layers. The local layer always runs and counts this browser only, which is
// what you see at ?stats. The remote layer is off until you configure it below,
// and even then it sends nothing but a tally: the fact that a signup happened,
// never the name or the email. Those are read straight off the form and dropped.
//
// The wording on the page is driven by whether the remote layer is on (see the
// data-note-* attributes), so the site cannot end up claiming it sends nothing
// while quietly sending something.
(function () {
  const KEY_VIEWS = 'rpc:views';
  const KEY_SIGNUPS = 'rpc:signups';

  const COUNTER = {
    // Easiest route to real numbers. Sign up free at goatcounter.com, then put
    // your site code here (the part before .goatcounter.com). Counts page opens
    // and completed signups, no cookies and no script tag.
    goatCounterCode: null,      // e.g. 'replugged'

    // Or point this at any URL that accepts a POST. The body is {event, at}
    // and nothing else.
    endpoint: null
  };

  const remoteOn = () => Boolean(COUNTER.goatCounterCode || COUNTER.endpoint);

  const read = (key) => {
    try { return parseInt(localStorage.getItem(key), 10) || 0; } catch (e) { return 0; }
  };
  const bump = (key) => {
    try { localStorage.setItem(key, read(key) + 1); } catch (e) { /* private mode */ }
  };

  const send = (event) => {
    const isSignup = event === 'signup';
    if (COUNTER.goatCounterCode) {
      // plain image request, so no third-party script ever runs on the page
      new Image().src = 'https://' + COUNTER.goatCounterCode + '.goatcounter.com/count'
        + '?p=' + encodeURIComponent(isSignup ? '/signup-completed' : location.pathname)
        + '&t=' + encodeURIComponent(isSignup ? 'Signup completed' : document.title)
        + '&r=' + encodeURIComponent(document.referrer || '');
    }
    if (COUNTER.endpoint) {
      try {
        navigator.sendBeacon(COUNTER.endpoint, JSON.stringify({ event: event, at: Date.now() }));
      } catch (e) { /* never let counting break the page */ }
    }
  };

  // keep the privacy wording matched to what actually happens
  document.querySelectorAll('[data-note-local]').forEach(el => {
    el.textContent = remoteOn() ? el.dataset.noteCounted : el.dataset.noteLocal;
  });

  const panel = document.getElementById('stats-panel');
  const render = () => {
    if (!panel || panel.hidden) return;
    const views = read(KEY_VIEWS);
    const signups = read(KEY_SIGNUPS);
    document.getElementById('stat-views').textContent = views;
    document.getElementById('stat-signups').textContent = signups;
    document.getElementById('stat-rate').textContent =
      views ? Math.round((signups / views) * 100) + '%' : '0%';
  };

  bump(KEY_VIEWS);
  send('view');

  // called by the signup form below
  window.rpcRecordSignup = function () {
    bump(KEY_SIGNUPS);
    send('signup');
    render();
  };

  if (panel && new URLSearchParams(location.search).has('stats')) {
    panel.hidden = false;
    render();
    document.getElementById('stats-reset').addEventListener('click', () => {
      try {
        localStorage.removeItem(KEY_VIEWS);
        localStorage.removeItem(KEY_SIGNUPS);
      } catch (e) { /* ignore */ }
      render();
    });
  }
})();


// Signup form (signup.html). Validates, counts the submission, then shows a
// confirmation. There is no backend, so nothing is sent or stored off-device.
// If a real endpoint ever exists, give the <form> an action/method and delete this.
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

    // free-text field backed by a datalist, so anything typed in is valid
    const hobby = document.getElementById('hobby').value.trim() || 'No preference';
    const cadence = form.querySelector('input[name="cadence"]:checked');

    document.getElementById('done-name').textContent = name.value.trim();
    const summary = document.getElementById('done-summary');
    summary.textContent = '';
    [
      ['Email', email.value.trim()],
      ['Curious about', hobby],
      ['Cadence', cadence ? cadence.value.replace(/-/g, ' ') : 'monthly']
    ].forEach(([label, value]) => {
      const li = document.createElement('li');
      const tag = document.createElement('span');
      tag.textContent = label;
      li.appendChild(tag);
      li.append(value);                      // textNode, never parsed as HTML
      summary.appendChild(li);
    });

    if (typeof window.rpcRecordSignup === 'function') window.rpcRecordSignup();

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


// Simple reveal-on-scroll. Deliberately skips the carousel cards: they get
// translated out of view, so an observer would leave them stuck at opacity 0.
(function () {
  const targets = document.querySelectorAll('.how-step, .carousel');
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
