/* Turn-Table ad pixels (Meta, optional TikTok): TEACHER PAGES ONLY.
 *
 * Paste the IDs below. Leave an ID empty and that pixel never loads.
 *
 * How it stays off the student side:
 *  - Nothing is fetched from Facebook or TikTok until a teacher page calls ttPixel.track().
 *    Student screens never call it, so a student Chromebook never contacts those servers.
 *  - index.html also refuses to send anything while a student is signed in on the device
 *    (see ttTeacherPx in index.html).
 *  - Meta's automatic features are turned off: no auto button-click events, no form
 *    scraping ("automatic advanced matching"), no extra page views on screen changes.
 *    Only the events Turn-Table sends by name are recorded.
 *
 * Events this site sends:
 *   Landing page   PageView, ViewContent, ClickSignUp (custom, when a trial/sign-up button is clicked)
 *   Teacher app    ViewContent (sign-in page), Lead (sign-up form sent), CompleteRegistration
 *                  (first sign-in after confirming email), InitiateCheckout (sent to card page),
 *                  StartTrial (back from checkout), plus custom: TeacherDashboard, ClassCreated,
 *                  TeacherTriedGames, TeacherViewedData
 *   Purchase is NOT sent from here: a trial turns into a payment days later, so it has to come
 *   from the Stripe webhook on the server (Meta Conversions API).
 */
(function () {
  var META_PIXEL_ID = '';   /* 15-16 digit number from Meta Events Manager > Data sources */
  var TIKTOK_PIXEL_ID = ''; /* from TikTok Ads Manager > Tools > Events, if you run TikTok ads */

  var loaded = false;
  var TT_STD = { PageView: 'Pageview', ViewContent: 'ViewContent', Lead: 'SubmitForm',
    CompleteRegistration: 'CompleteRegistration', InitiateCheckout: 'InitiateCheckout', StartTrial: 'Subscribe' };

  function load() {
    if (loaded) return true;
    if (!META_PIXEL_ID && !TIKTOK_PIXEL_ID) return false;
    if (META_PIXEL_ID) {
      /* Meta's standard loader, unchanged except that the automatic features are switched off */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq.disablePushState = true;            /* no automatic PageView on screen changes */
      window.fbq('set', 'autoConfig', false, META_PIXEL_ID); /* no auto button clicks, no form scraping */
      window.fbq('init', META_PIXEL_ID);
    }
    if (TIKTOK_PIXEL_ID) {
      /* TikTok's standard loader */
      !function (w, d, t) {
        w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
        ttq.load = function (e, n) {
          var r = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
          ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {};
          var o = d.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = r + '?sdkid=' + e + '&lib=' + t;
          var a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a);
        };
        ttq.load(TIKTOK_PIXEL_ID);
      }(window, document, 'ttq');
    }
    loaded = true;
    return true;
  }

  /* name: a Meta standard event (PageView, ViewContent, Lead, ...) or a custom name.
     params: small plain values only. Never pass student info. */
  function track(name, params) {
    try {
      if (!load()) return false;
      params = params || {};
      if (META_PIXEL_ID) {
        if (name === 'PageView') window.fbq('track', 'PageView');
        else if (TT_STD[name]) window.fbq('track', name, params);
        else window.fbq('trackCustom', name, params);
      }
      if (TIKTOK_PIXEL_ID && window.ttq) {
        if (name === 'PageView') window.ttq.page();
        else window.ttq.track(TT_STD[name] || name, params);
      }
      return true;
    } catch (e) { return false; }
  }

  /* Remembers where a teacher came from (utm_source etc.), first visit and latest visit.
     Saved on this device only; sent with the teacher's sign-up so the founder panel can
     show sign-ups by source. Only call this on teacher pages. */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid'];
  function captureSource() {
    try {
      var sp = new URLSearchParams(location.search), s = {}, any = false;
      KEYS.forEach(function (k) { var v = sp.get(k); if (v) { s[k] = v.slice(0, 120); any = true; } });
      var ref = document.referrer && document.referrer.indexOf(location.origin) !== 0 ? document.referrer.slice(0, 200) : '';
      if (!any && !ref) return;
      if (ref) s.referrer = ref;
      s.at = new Date().toISOString().slice(0, 10);
      if (!localStorage.getItem('tt_src_first')) localStorage.setItem('tt_src_first', JSON.stringify(s));
      localStorage.setItem('tt_src_last', JSON.stringify(s));
    } catch (e) {}
  }
  function source() {
    var o = {};
    try { o.first = JSON.parse(localStorage.getItem('tt_src_first') || 'null'); o.last = JSON.parse(localStorage.getItem('tt_src_last') || 'null'); } catch (e) {}
    return o;
  }

  window.ttPixel = { track: track, captureSource: captureSource, source: source,
    enabled: function () { return !!(META_PIXEL_ID || TIKTOK_PIXEL_ID); } };
})();
