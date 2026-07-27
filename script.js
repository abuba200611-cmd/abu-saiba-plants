/* أبو صيبع للنباتات والزهور — التفاعل */
(function () {
  "use strict";

  var WA_NUMBER = "97333632333"; // +973 3363 2333 (مؤكّد من إنستقرام الحساب الرسمي @abusaibaplants)
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initYear();
    initHeader();
    initThemeToggle();
    initMobileNav();
    initScrollProgress();
    initReveal();
    initCounters();
    initFilter();
    initGotoFilter();
    initCarousel();
    initGallery();
    initFaq();
    initBackToTop();
    initWhatsAppCtas();
    initCustomOrderForm();
    initContactForm();
  }

  /* -------- سنة الفوتر -------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -------- ظل الهيدر عند التمرير -------- */
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------- شريط تقدّم التمرير -------- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    function onScroll() {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* -------- الوضع الداكن / الفاتح -------- */
  function initThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    var root = document.documentElement;

    function currentIsDark() {
      var attr = root.getAttribute("data-theme");
      if (attr === "dark") return true;
      if (attr === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function reflect() {
      btn.setAttribute("aria-pressed", String(currentIsDark()));
    }
    reflect();

    btn.addEventListener("click", function () {
      var next = currentIsDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("asp-theme", next); } catch (e) {}
      reflect();
    });
  }

  /* -------- قائمة الجوال -------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("navLinks");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "فتح قائمة التنقل");
    }
    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "إغلاق قائمة التنقل");
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? close() : open();
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* -------- ظهور تدريجي عند التمرير -------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* -------- عدّادات متحركة -------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-target"));
      var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1500;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { io.observe(el); });
  }

  /* -------- فلترة المنتجات -------- */
  function initFilter() {
    var bar = document.getElementById("filterBar");
    var grid = document.getElementById("productGrid");
    var empty = document.getElementById("emptyState");
    if (!bar || !grid) return;

    function applyFilter(value) {
      var cards = grid.querySelectorAll(".product-card");
      var visibleCount = 0;
      cards.forEach(function (card) {
        var match = value === "all" || card.getAttribute("data-category") === value;
        card.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });
      if (empty) empty.classList.toggle("is-visible", visibleCount === 0);

      bar.querySelectorAll(".filter-btn").forEach(function (btn) {
        var isActive = btn.getAttribute("data-filter") === value;
        btn.setAttribute("aria-pressed", String(isActive));
      });
    }

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-filter"));
    });

    window.__aspApplyFilter = applyFilter;
  }

  /* -------- الانتقال من التصنيفات/الفوتر إلى فلتر معيّن -------- */
  function initGotoFilter() {
    document.querySelectorAll("[data-goto-filter]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var value = el.getAttribute("data-goto-filter");
        var target = document.getElementById("products");
        if (!target) return;
        if (el.tagName === "BUTTON") e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 90,
          behavior: reduceMotion ? "auto" : "smooth",
        });
        if (window.__aspApplyFilter) {
          setTimeout(function () { window.__aspApplyFilter(value); }, reduceMotion ? 0 : 350);
        }
      });
    });
  }

  /* -------- كاروسيل المناسبات -------- */
  function initCarousel() {
    var root = document.getElementById("occasionCarousel");
    var track = document.getElementById("carouselTrack");
    var dotsWrap = document.getElementById("carouselDots");
    if (!root || !track || !dotsWrap) return;

    var slides = Array.prototype.slice.call(track.children);
    var index = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "الانتقال إلى الشريحة " + (i + 1));
      dot.setAttribute("aria-current", i === 0 ? "true" : "false");
      dot.addEventListener("click", function () { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = "translateX(" + index * 100 + "%)";
      dots.forEach(function (d, i) { d.setAttribute("aria-current", String(i === index)); });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    root.querySelector(".carousel-nav.next").addEventListener("click", function () { next(); resetAutoplay(); });
    root.querySelector(".carousel-nav.prev").addEventListener("click", function () { prev(); resetAutoplay(); });

    function startAutoplay() {
      if (reduceMotion) return;
      timer = setInterval(next, 5500);
    }
    function resetAutoplay() {
      if (timer) clearInterval(timer);
      startAutoplay();
    }
    root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
    root.addEventListener("focusout", startAutoplay);

    /* سحب باللمس */
    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) { diff > 0 ? prev() : next(); resetAutoplay(); }
      startX = null;
    });

    render();
    startAutoplay();
  }

  /* -------- المعرض + لايت بوكس -------- */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    var lightbox = document.getElementById("lightbox");
    if (!items.length || !lightbox) return;

    var img = document.getElementById("lightboxImg");
    var caption = document.getElementById("lightboxCaption");
    var counter = document.getElementById("lightboxCounter");
    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");
    var current = 0;
    var lastFocused = null;

    function openAt(i) {
      current = (i + items.length) % items.length;
      var el = items[current];
      img.src = el.getAttribute("data-full");
      img.alt = el.querySelector("img").alt || "";
      caption.textContent = el.getAttribute("data-caption") || "";
      counter.textContent = (current + 1) + " / " + items.length;
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }
    function close() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }
    function goNext() { openAt(current + 1); }
    function goPrev() { openAt(current - 1); }

    function getFocusable() {
      return [closeBtn, prevBtn, nextBtn];
    }
    function onKeydown(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowLeft") { goNext(); return; } /* يمين→يسار: التالي بصرياً على اليسار */
      if (e.key === "ArrowRight") { goPrev(); return; }
      if (e.key === "Tab") {
        var focusable = getFocusable();
        var firstEl = focusable[0], lastEl = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault(); lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault(); firstEl.focus();
        }
      }
    }

    items.forEach(function (el, i) {
      el.addEventListener("click", function () { openAt(i); });
    });
    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
  }

  /* -------- أسئلة شائعة (أكورديون) -------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      var inner = item.querySelector(".faq-a-inner");
      q.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";
        if (isOpen) {
          a.style.height = a.scrollHeight + "px";
          requestAnimationFrame(function () { a.style.height = "0px"; });
          item.setAttribute("data-open", "false");
          q.setAttribute("aria-expanded", "false");
        } else {
          a.style.height = inner.offsetHeight + "px";
          item.setAttribute("data-open", "true");
          q.setAttribute("aria-expanded", "true");
        }
      });
      a.addEventListener("transitionend", function () {
        if (item.getAttribute("data-open") === "true") a.style.height = "auto";
      });
    });
  }

  /* -------- زر العودة للأعلى -------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    onScroll();
  }

  /* -------- روابط واتساب العامة -------- */
  function buildWaLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }
  function initWhatsAppCtas() {
    document.querySelectorAll("[data-wa-cta]").forEach(function (el) {
      el.setAttribute("href", buildWaLink(el.getAttribute("data-wa-text") || "مرحباً أبو صيبع"));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-wa-product]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-wa-product");
        var price = btn.getAttribute("data-wa-price");
        var text = "مرحباً أبو صيبع، أحب أطلب:\n\n🌿 المنتج: " + name +
          (price ? "\n💰 السعر: " + price : "") +
          "\n\nالرجاء تأكيد التوفر وتفاصيل التوصيل.";
        window.open(buildWaLink(text), "_blank", "noopener");
      });
    });
  }

  /* -------- نموذج التنسيق المخصص -------- */
  function initCustomOrderForm() {
    var form = document.getElementById("customOrderForm");
    if (!form) return;
    var msg = document.getElementById("formMsg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      clearError("occasion-picker", "err-occasion");
      clearFieldError("co-name", "err-name");
      clearFieldError("co-phone", "err-phone");

      var occasionInput = form.querySelector('input[name="occasion"]:checked');
      if (!occasionInput) {
        valid = false;
        showError("occasion-picker", "err-occasion");
        firstInvalid = firstInvalid || document.getElementById("occ-wedding");
      }

      var name = form.querySelector("#co-name");
      if (!name.value.trim()) {
        valid = false;
        showFieldError("co-name", "err-name");
        firstInvalid = firstInvalid || name;
      }

      var phone = form.querySelector("#co-phone");
      if (!isValidPhone(phone.value)) {
        valid = false;
        showFieldError("co-phone", "err-phone");
        firstInvalid = firstInvalid || phone;
      }

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        msg.classList.remove("is-visible");
        return;
      }

      var date = form.querySelector("#co-date").value;
      var budget = form.querySelector("#co-budget").value;
      var details = form.querySelector("#co-details").value.trim();

      var lines = [
        "مرحباً أبو صيبع، أحب أطلب تنسيقاً مخصصاً:",
        "",
        "🎉 المناسبة: " + occasionInput.value,
        "👤 الاسم: " + name.value.trim(),
        "📱 الجوال: " + phone.value.trim(),
      ];
      if (date) lines.push("📅 تاريخ التسليم المطلوب: " + date);
      if (budget) lines.push("💰 الميزانية التقريبية: " + budget);
      if (details) lines.push("📝 التفاصيل: " + details);

      window.open(buildWaLink(lines.join("\n")), "_blank", "noopener");
      msg.classList.add("is-visible");
      form.reset();
    });
  }

  /* -------- نموذج التواصل -------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var msg = document.getElementById("contactFormMsg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      clearFieldError("c-name", "err-c-name");
      clearFieldError("c-phone", "err-c-phone");
      clearFieldError("c-msg", "err-c-msg");

      var name = form.querySelector("#c-name");
      if (!name.value.trim()) { valid = false; showFieldError("c-name", "err-c-name"); firstInvalid = firstInvalid || name; }

      var phone = form.querySelector("#c-phone");
      if (!isValidPhone(phone.value)) { valid = false; showFieldError("c-phone", "err-c-phone"); firstInvalid = firstInvalid || phone; }

      var message = form.querySelector("#c-msg");
      if (!message.value.trim()) { valid = false; showFieldError("c-msg", "err-c-msg"); firstInvalid = firstInvalid || message; }

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        msg.classList.remove("is-visible");
        return;
      }

      var text = "مرحباً أبو صيبع،\n\n👤 الاسم: " + name.value.trim() +
        "\n📱 الجوال: " + phone.value.trim() +
        "\n💬 الرسالة: " + message.value.trim();

      window.open(buildWaLink(text), "_blank", "noopener");
      msg.classList.add("is-visible");
      form.reset();
    });
  }

  function isValidPhone(value) {
    var v = value.trim();
    return /^[0-9+\s-]{7,}$/.test(v);
  }
  function showFieldError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) input.closest(".field").classList.add("has-error");
    if (error) error.style.display = "flex";
  }
  function clearFieldError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) input.closest(".field").classList.remove("has-error");
    if (error) error.style.display = "";
  }
  function showError(wrapId, errorId) {
    document.getElementById(errorId).style.display = "flex";
  }
  function clearError(wrapId, errorId) {
    document.getElementById(errorId).style.display = "";
  }
})();
