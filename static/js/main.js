(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navigation ---------- */
  var nav = $('#nav'), burger = $('#burger'), links = $('#links');
  var navA = $$('a[href^="#"]', links);
  function updateActiveLink() {
    var position = window.scrollY + nav.offsetHeight + 80;
    var active = navA[0];
    navA.forEach(function (a) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (target && target.getBoundingClientRect().top + window.scrollY <= position) active = a;
    });
    navA.forEach(function (a) { a.classList.toggle('on', a === active); });
  }
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 12);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  onScroll();
  function closeMenu() { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); links.classList.toggle('open', open);
  });
  $$('a', links).forEach(function (a) { a.addEventListener('click', closeMenu); });

  if ('IntersectionObserver' in window) {
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.rv').forEach(function (el) { rv.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Custom dropdowns (enhance native <select>, names/values untouched) ---------- */
  function enhance(sel) {
    var ctl = sel.parentNode, dd = document.createElement('div'); dd.className = 'dd';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'dd-btn ph';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="dd-v"></span><svg class="ic"><use href="#i-chev"/></svg>';
    var list = document.createElement('ul'); list.className = 'dd-list'; list.setAttribute('role', 'listbox');
    var opts = [], act = -1, label = $('.dd-v', btn);
    label.textContent = sel.options[0].textContent;
    $$('option', sel).forEach(function (o) {
      if (o.disabled) return;
      var li = document.createElement('li'); li.setAttribute('role', 'option'); li.dataset.v = o.value; li.textContent = o.textContent;
      li.addEventListener('click', function () { pick(li); }); list.appendChild(li); opts.push(li);
    });
    function setAct(i) { act = i; opts.forEach(function (li, k) { li.classList.toggle('act', k === i); }); if (opts[i]) opts[i].scrollIntoView({ block: 'nearest' }); }
    function open() { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); setAct(Math.max(0, opts.findIndex(function (l) { return l.dataset.v === sel.value; }))); }
    function close() { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    function pick(li) {
      sel.value = li.dataset.v; label.textContent = li.textContent; btn.classList.remove('ph');
      opts.forEach(function (l) { l.setAttribute('aria-selected', l === li); });
      clearErr(sel); close(); btn.focus();
    }
    btn.addEventListener('click', function () { dd.classList.contains('open') ? close() : open(); });
    btn.addEventListener('keydown', function (e) {
      var o = dd.classList.contains('open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!o) open(); else setAct((act + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length); }
      else if ((e.key === 'Enter' || e.key === ' ') && o) { e.preventDefault(); pick(opts[act]); }
      else if (e.key === 'Escape' || e.key === 'Tab') close();
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
    sel.addEventListener('reset-ui', function () { label.textContent = sel.options[0].textContent; btn.classList.add('ph'); opts.forEach(function (l) { l.removeAttribute('aria-selected'); }); });
    ctl.appendChild(dd); dd.appendChild(btn); dd.appendChild(list);
  }

  /* ---------- Form, validation & AJAX prediction ---------- */
  var form = $('#form'), submit = $('#submit'), banner = $('#banner'), busy = false;
  form.noValidate = true;
  $$('select', form).forEach(enhance);

  function fieldOf(el) { return el.closest('.field'); }
  function setErr(el, text) { var f = fieldOf(el); f.classList.add('bad'); $('.msg', f).textContent = text; }
  function clearErr(el) { var f = fieldOf(el); f.classList.remove('bad'); $('.msg', f).textContent = ''; }
  function showBanner(t) { banner.hidden = !t; $('span', banner).textContent = t || ''; }
  $$('input', form).forEach(function (i) { i.addEventListener('input', function () { clearErr(i); showBanner(''); }); });

  function validate() {
    var ok = true, first = null;
    $$('select', form).forEach(function (s) {
      if (!s.value) { setErr(s, 'Please select an option.'); ok = false; first = first || $('.dd-btn', fieldOf(s)); }
    });
    $$('input[type=number]', form).forEach(function (i) {
      var v = i.value.trim(), n = Number(v), t = '';
      if (v === '') t = 'Please enter a score.';
      else if (!isFinite(n) || n < 0 || n > 100) t = 'Score must be between 0 and 100.';
      else if (!Number.isInteger(n)) t = 'Please enter a whole number.';
      if (t) { setErr(i, t); ok = false; first = first || i; }
    });
    if (first) first.focus();
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    showBanner('');
    if (!validate()) return;
    busy = true; submit.classList.add('loading'); submit.disabled = true; $('.lbl', submit).textContent = 'Analyzing…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' } })
      .then(function (r) { return r.json().catch(function () { throw new Error(); }).then(function (d) { if (!r.ok || !d.success) throw new Error(d.error); return d; }); })
      .then(function (d) {
        showResult(d.prediction, Number($('#reading_score').value), Number($('#writing_score').value), true);
      })
      .catch(function (err) { showBanner((err && err.message) || 'Could not reach the prediction service. Please try again.'); })
      .then(function () { busy = false; submit.classList.remove('loading'); submit.disabled = false; $('.lbl', submit).textContent = 'Predict Maths Score'; });
  });

  /* ---------- Result rendering ---------- */
  var CIRC = 2 * Math.PI * 84;
  function tierOf(s) { return s >= 85 ? 'Excellent performance' : s >= 70 ? 'Good performance' : s >= 50 ? 'Moderate performance' : 'Needs additional support'; }
  function showResult(score, rd, wr, scroll) {
    var res = $('#result'), pct = Math.max(0, Math.min(100, score));
    res.hidden = false;
    var card = $('.rcard', res); card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
    $('#tier').textContent = tierOf(score);
    $('#v-math').textContent = score.toFixed(1);
    var arc = $('#arc'); arc.style.strokeDasharray = CIRC; arc.style.strokeDashoffset = CIRC;
    ['read', 'write', 'math'].forEach(function (k) { $('#b-' + k).style.width = '0'; });
    $('#mark').style.left = '0%';
    if (!isNaN(rd)) { $('#v-read').textContent = rd; } else { $('#v-read').textContent = '–'; }
    if (!isNaN(wr)) { $('#v-write').textContent = wr; } else { $('#v-write').textContent = '–'; }
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      arc.style.strokeDashoffset = CIRC * (1 - pct / 100);
      $('#mark').style.left = pct + '%';
      $('#b-read').style.width = (isNaN(rd) ? 0 : rd) + '%'; $('#b-write').style.width = (isNaN(wr) ? 0 : wr) + '%'; $('#b-math').style.width = pct + '%';
    }); });
    countUp($('#score'), score);
    if (scroll) setTimeout(function () { res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 60);
  }
  function countUp(el, to) {
    if (reduce) { el.textContent = to.toFixed(1); return; }
    var t0 = null, dur = 1500;
    function step(t) {
      t0 = t0 || t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(1); if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  $('#again').addEventListener('click', function () {
    form.reset(); $$('select', form).forEach(function (s) { s.value = ''; s.dispatchEvent(new Event('reset-ui')); });
    $$('.field.bad', form).forEach(function (f) { f.classList.remove('bad'); });
    $$('.msg', form).forEach(function (m) { m.textContent = ''; });
  });

  /* Non-JS fallback: if the server rendered a result, display it */
  var pre = $('#result').getAttribute('data-score');
  if (pre !== null && pre !== '' && isFinite(Number(pre))) showResult(Number(pre), NaN, NaN, true);
})();
