/* =========================================================
   Sameer Surla — Portfolio (Pro) interactions
   Vanilla JS, no dependencies
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var stored = localStorage.getItem("theme");
  if (stored) root.setAttribute("data-theme", stored);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) root.setAttribute("data-theme", "light");
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Year ---------- */
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Scroll progress + nav active ---------- */
  var progress = document.getElementById("scrollProgress");
  function onScroll() {
    var sy = window.scrollY || 0;
    if (progress) { var h = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = (h > 0 ? (sy / h) * 100 : 0) + "%"; }
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("navMenu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(function (el, i) { el.style.transitionDelay = Math.min(i % 6, 5) * 0.05 + "s"; io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- Active nav link ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navlinks = document.querySelectorAll(".nav-menu a");
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { var id = e.target.getAttribute("id"); navlinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); }); } });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Case-study TOC active state ---------- */
  var tocLinks = document.querySelectorAll(".toc a");
  var blocks = document.querySelectorAll(".block[id]");
  if ("IntersectionObserver" in window && tocLinks.length && blocks.length) {
    var tspy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { var id = e.target.getAttribute("id"); tocLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); }); } });
    }, { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" });
    blocks.forEach(function (b) { tspy.observe ? tspy.observe(b) : tspy.observe(b); });
  }

  /* ---------- Word rotator ---------- */
  var rot = document.getElementById("rotator");
  if (rot && !reduceMotion) {
    var words = ["data platforms", "RAG systems", "LLM applications", "agentic AI", "vision systems"];
    var wi = 0, ci = 0, del = false;
    function tick() {
      var w = words[wi]; rot.textContent = w.substring(0, ci);
      if (!del && ci < w.length) { ci++; setTimeout(tick, 85); }
      else if (del && ci > 0) { ci--; setTimeout(tick, 40); }
      else { if (!del) { del = true; setTimeout(tick, 1500); } else { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 250); } }
    }
    setTimeout(tick, 700);
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute("data-count"), 10) || 0, suffix = el.getAttribute("data-suffix") || "", start = null, dur = 1500;
        function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var eased = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(eased * target) + suffix; if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix; }
        requestAnimationFrame(step); co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Project filter ---------- */
  var fbtns = document.querySelectorAll(".chip-btn");
  var projs = document.querySelectorAll(".proj");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      fbtns.forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      var f = b.getAttribute("data-filter");
      projs.forEach(function (p) { var cat = p.getAttribute("data-cat") || ""; p.classList.toggle("is-hidden", !(f === "all" || cat.indexOf(f) !== -1)); });
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email"), done = function () { var o = copyBtn.textContent; copyBtn.textContent = "Copied ✓"; setTimeout(function () { copyBtn.textContent = o; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(done);
    else { var t = document.createElement("textarea"); t.value = email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(t); done(); }
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Cursor glow + magnetic + tilt (pointer devices only) ---------- */
  if (!isTouch && !reduceMotion) {
    var glow = document.getElementById("cursorGlow");
    if (glow) {
      window.addEventListener("mousemove", function (e) { glow.style.opacity = "1"; glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });
      document.addEventListener("mouseleave", function () { glow.style.opacity = "0"; });
    }

    // Magnetic buttons
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + mx * 0.25 + "px," + my * 0.35 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    // Card tilt
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateY(" + px * 6 + "deg) rotateX(" + (-py * 6) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }
})();
