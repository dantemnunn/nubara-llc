/* NUBARA promotions: fills pages from promo/config.js, runs the giveaway entry form,
   the business lead form and the homepage banner. */
(function () {
  var P = window.NUBARA_PROMO; if (!P) return;
  var now = Date.now(), start = Date.parse(P.start), end = Date.parse(P.end);
  var phase = now < start ? 'before' : (now <= end ? 'open' : 'closed');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(sel) { return document.querySelector(sel); }
  function set(key, html) { document.querySelectorAll('[data-p="' + key + '"]').forEach(function (el) { el.innerHTML = html; }); }
  var short = function (iso) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' }); };
  var CONTACT = 'call or text <a href="tel:+14707980045">470-798-0045</a> or email <a href="mailto:info@nubaragroup.com">info@nubaragroup.com</a>';

  /* Homepage banner */
  var bar = $('#promo-bar');
  if (bar) {
    if (now < Date.parse(P.bannerUntil || P.end)) {
      bar.className = 'promo-bar' + (P.bannerImage ? ' promo-bar-img' : '');
      if (P.bannerImage) bar.style.backgroundImage = 'linear-gradient(90deg, rgba(18,29,53,.92) 0%, rgba(18,29,53,.75) 45%, rgba(18,29,53,.25) 100%), url(' + P.bannerImage + ')';
      bar.innerHTML = '<a href="giveaway/"><span class="pb-text"><span class="pb-eyebrow">' + esc(P.eyebrow) + '</span><span class="pb-main">' + esc(P.bannerText) + '</span></span><strong class="pb-btn">Enter now</strong></a>';
      bar.hidden = false;
    }
    return;
  }

  document.body.className = 'promo-theme-' + (P.theme || 'standard');
  var hero = $('.gv-hero');
  if (hero && P.heroImage) {
    hero.style.background = 'linear-gradient(90deg, rgba(18,29,53,.94) 0%, rgba(18,29,53,.82) 45%, rgba(18,29,53,.55) 100%), linear-gradient(0deg, rgba(18,29,53,.7) 0%, rgba(18,29,53,0) 40%), url(' + P.heroImage + ') center / cover no-repeat, #121D35';
    var lv = hero.querySelector('.gv-leaves'); if (lv) lv.style.display = 'none';
  }
  var comm = $('.gv-community');
  if (comm && P.communityImage) comm.style.background = 'linear-gradient(0deg, rgba(18,29,53,.93), rgba(18,29,53,.86)), url(' + P.communityImage + ') center / cover no-repeat, #121D35';

  set('eyebrow', esc(P.eyebrow));
  set('headline-html', esc(P.headline).replace(esc(P.prizeTotal), '<span class="gold">' + esc(P.prizeTotal) + '</span>'));
  set('intro', esc(P.intro));
  set('prizeTotal', esc(P.prizeTotal));
  set('winners-text', P.winners + (P.winners === 1 ? ' winner' : ' winners'));
  set('prizes', P.prizes.map(function (x) { return '<div><b>' + esc(x.amount) + '</b><span>' + esc(x.label) + '</span></div>'; }).join(''));
  set('window', 'Enter ' + short(P.start) + ' to ' + short(P.end) + ', ' + new Date(P.end).getFullYear());
  set('announce-chip', 'Winner announced ' + short(P.announce + 'T12:00:00-05:00'));
  set('name', esc(P.name)); set('startLabel', esc(P.startLabel)); set('endLabel', esc(P.endLabel));
  set('announceLabel', esc(P.announceLabel)); set('prizeRulesText', esc(P.prizeRulesText));
  set('winners', String(P.winners)); set('prizeTotal-plain', esc(P.prizeTotal));
  if (document.title.indexOf('Official Rules') === -1) document.title = P.name.replace('NUBARA ', '') + ' | NUBARA Group';

  var S = P.social || {};
  var fb = $('#gv-fb'); if (fb && S.facebook) fb.href = S.facebook;
  var ig = $('#gv-ig'); if (ig && S.instagram) ig.href = S.instagram;

  /* Countdown */
  var cd = $('[data-p="countdown"]');
  function tick() {
    if (!cd) return;
    var t = Date.now(), target = t < start ? start : end, ms = target - t;
    if (t > end) { cd.textContent = 'Entries are closed. Winner announced ' + P.announceLabel + '.'; return; }
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    cd.textContent = (t < start ? 'Entries open in ' : 'Entries close in ') + d + 'd ' + h + 'h ' + m + 'm';
  }
  tick(); setInterval(tick, 30000);

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  /* Backup delivery: email via Web3Forms (same free key as the homepage form). */
  function emailBackup(subject, fields) {
    var body = { access_key: P.emailKey, subject: subject, from_name: 'NUBARA Website', botcheck: '' };
    Object.keys(fields).forEach(function (k) { body[k] = fields[k]; });
    return fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || j.success === false) throw new Error(j.message || 'error'); return { ok: true }; }); });
  }

  /* ---------- Business lead form (Section 2) ---------- */
  (function () {
    var lf = $('#lead-form'); if (!lf) return;
    var L = P.leads || {}, sel = $('#lead-service');
    (L.services || []).forEach(function (s) { var o = document.createElement('option'); o.textContent = s; o.value = s; sel.appendChild(o); });
    var st = $('#lead-status'), btn = lf.querySelector('button[type=submit]'), label = btn.textContent;
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!lf.checkValidity()) { st.textContent = 'Please fill in your name, business, email and service, and check the box.'; st.className = 'gv-status err'; lf.reportValidity(); return; }
      var fd = new FormData(lf);
      if (fd.get('website')) return; /* bot trap */
      var name = fd.get('name').trim(), parts = name.split(/\s+/), first = parts.shift(), last = parts.join(' ');
      var lead = { name: name, company: fd.get('company').trim(), email: fd.get('email').trim().toLowerCase(), site: (fd.get('site') || '').trim(), service: fd.get('service') };
      btn.disabled = true; btn.textContent = 'Sending...'; st.textContent = ''; st.className = 'gv-status';
      var send;
      if (L.hubspotPortalId && L.hubspotFormId) {
        var f = [
          { objectTypeId: '0-1', name: 'firstname', value: first },
          { objectTypeId: '0-1', name: 'lastname', value: last },
          { objectTypeId: '0-1', name: 'email', value: lead.email },
          { objectTypeId: '0-1', name: 'company', value: lead.company },
          { objectTypeId: '0-1', name: L.serviceField || 'message', value: L.serviceField && L.serviceField !== 'message' ? lead.service : 'Free Business Visibility Check. Service interested in: ' + lead.service + ' (source: ' + P.id + ' page)' }
        ];
        if (lead.site) f.push({ objectTypeId: '0-1', name: 'website', value: lead.site });
        var hutk = (document.cookie.match(/(?:^|; )hubspotutk=([^;]+)/) || [])[1];
        var ctx = { pageUri: location.href, pageName: document.title }; if (hutk) ctx.hutk = hutk;
        send = fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + encodeURIComponent(L.hubspotPortalId) + '/' + encodeURIComponent(L.hubspotFormId), {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: f, context: ctx })
        }).then(function (r) { if (!r.ok) throw new Error('hubspot ' + r.status); return { ok: true }; });
      } else {
        send = emailBackup('New FREE Business Visibility Check (' + P.name + ' page)', { name: lead.name, business_name: lead.company, email: lead.email, business_website: lead.site || '(none)', service_interested_in: lead.service, consent: 'Agreed to be contacted by email', source: location.href });
      }
      send.then(function () {
        $('#lead-wrap').innerHTML = '<div class="gv-done"><div class="icon">&#10003;</div><h3>Request received!</h3><p>Thanks, ' + esc(first) + '. We\'ll review ' + esc(lead.company) + ' and email you within 1 business day.</p></div>';
      }).catch(function () {
        st.innerHTML = 'Something went wrong. Please try again, or ' + CONTACT + '.'; st.className = 'gv-status err';
        btn.disabled = false; btn.textContent = label;
      });
    });
  })();

  /* ---------- Giveaway entry form (Section 1) ---------- */
  var wrap = $('#gv-form-wrap'), form = $('#gv-form'); if (!form) return;
  var key = 'nubara-entered-' + P.id;
  function done(title, msg) {
    wrap.innerHTML = '<div class="gv-done"><div class="icon">&#10003;</div><h3>' + title + '</h3><p>' + msg + '</p><p>Winner announced ' + esc(P.announceLabel) + '. Good luck!</p></div>';
  }
  function closed(title, msg) { wrap.innerHTML = '<div class="gv-closed"><h3>' + title + '</h3><p>' + msg + '</p></div>'; }

  if (phase === 'before') return closed('Entries open ' + esc(P.startLabel), 'Come back then to enter. It takes less than a minute.');
  if (phase === 'closed') return closed('Entries are closed', 'Thank you to everyone who entered. The winner will be announced ' + esc(P.announceLabel) + '.');
  if (store(key)) return done("You're already entered", 'We have your entry on file. Only one entry per person.');

  var st = $('#gv-status'), btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { st.textContent = 'Please complete every field and check both boxes.'; st.className = 'gv-status err'; form.reportValidity(); return; }
    var fd = new FormData(form);
    var body = { campaign: P.id, name: fd.get('name').trim(), email: fd.get('email').trim().toLowerCase(), state: fd.get('state'), age: !!fd.get('age'), rules: !!fd.get('rules'), website: fd.get('website') || '', page: location.href };
    if (body.website) return; /* bot trap */
    btn.disabled = true; btn.textContent = 'Submitting...'; st.textContent = ''; st.className = 'gv-status';
    var send = P.endpoint
      ? fetch(P.endpoint, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); })
      : emailBackup('Giveaway entry: ' + P.id, { campaign: P.id, name: body.name, email: body.email, state: body.state, age_18_plus: 'Yes', agreed_to_rules: 'Yes' });
    send.then(function (j) {
        if (j.ok) { store(key, '1'); done("You're entered!", 'Thanks, ' + esc(body.name.split(' ')[0]) + '. Your entry is confirmed for the ' + esc(P.name) + '.'); }
        else if (j.code === 'duplicate') { store(key, '1'); done("You're already entered", 'That email is already entered. Only one entry per person.'); }
        else if (j.code === 'closed') { closed('Entries are closed', 'This giveaway is not accepting entries right now.'); }
        else { throw new Error(j.message || 'error'); }
      })
      .catch(function () {
        st.innerHTML = 'Something went wrong. Please try again, or ' + CONTACT + '.';
        st.className = 'gv-status err'; btn.disabled = false; btn.textContent = 'Enter Giveaway';
      });
  });
})();
