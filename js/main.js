// CircleSpaces / NextDorm — shared site behavior
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var mobileClose = document.querySelector("[data-mobile-close]");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.setAttribute("data-open", "true");
    navToggle && navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var firstLink = mobileMenu.querySelector("a, button");
    if (firstLink) firstLink.focus();
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.setAttribute("data-open", "false");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  navToggle && navToggle.addEventListener("click", openMobileMenu);
  mobileClose && mobileClose.addEventListener("click", closeMobileMenu);
  mobileMenu && mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobileMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Waitlist / notify modal ---------- */
  var modalTriggers = document.querySelectorAll("[data-open-modal]");
  var modal = document.querySelector("[data-waitlist-modal]");
  var modalClose = modal ? modal.querySelectorAll("[data-close-modal]") : [];
  var lastFocused = null;

  function openModal(context) {
    if (!modal) return;
    var titleEl = modal.querySelector("[data-modal-title]");
    var bodyEl = modal.querySelector("[data-modal-body]");
    if (context === "surplus") {
      titleEl && (titleEl.textContent = "Get notified about Surplus");
      bodyEl && (bodyEl.textContent = "Surplus is still taking shape. Drop your email and we'll let you know the moment it's ready to explore.");
    } else {
      titleEl && (titleEl.textContent = "Be first in line for NextDorm");
      bodyEl && (bodyEl.textContent = "NextDorm is launching soon on Brown's campus. Leave your email and we'll notify you the moment the app goes live.");
    }
    var form = modal.querySelector("form");
    var success = modal.querySelector("[data-modal-success]");
    form && (form.style.display = "flex");
    success && success.setAttribute("data-show", "false");

    lastFocused = document.activeElement;
    modal.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    var input = modal.querySelector("input[type='email']");
    if (input) input.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  modalTriggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-open-modal"));
    });
  });
  modalClose.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });
  modal && modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.getAttribute("data-open") === "true") closeModal();
  });

  function submitToNetlify(form, onSuccess, onError) {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Form submission failed with status " + res.status);
        onSuccess();
      })
      .catch(onError);
  }

  if (modal) {
    var modalForm = modal.querySelector("form");
    modalForm && modalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = modal.querySelector("[data-modal-success]");
      var error = modal.querySelector("[data-modal-error]");
      var submitBtn = modalForm.querySelector("button[type='submit']");
      error && error.setAttribute("data-show", "false");
      submitBtn && (submitBtn.disabled = true);
      submitToNetlify(
        modalForm,
        function () {
          modalForm.style.display = "none";
          success && success.setAttribute("data-show", "true");
        },
        function () {
          submitBtn && (submitBtn.disabled = false);
          error && error.setAttribute("data-show", "true");
        }
      );
    });
  }

  /* ---------- Newsletter / footer CTA forms — submits to Netlify Forms ---------- */
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = form.parentElement.querySelector("[data-newsletter-success]");
      var error = form.parentElement.querySelector("[data-newsletter-error]");
      var submitBtn = form.querySelector("button[type='submit']");
      error && error.setAttribute("data-show", "false");
      submitBtn && (submitBtn.disabled = true);
      submitToNetlify(
        form,
        function () {
          form.style.display = "none";
          success && success.setAttribute("data-show", "true");
        },
        function () {
          submitBtn && (submitBtn.disabled = false);
          error && error.setAttribute("data-show", "true");
        }
      );
    });
  });

  /* ---------- Site search ---------- */
  var SEARCH_INDEX = [
    { title: "NextDorm — our flagship app", desc: "Share, borrow, and circulate goods across Brown's campus.", url: "/nextdorm/" },
    { title: "Surplus — coming soon", desc: "Our next project for redistributing surplus goods and resources.", url: "/surplus/" },
    { title: "About CircleSpaces", desc: "Our mission, our story, and why we're a Public Benefit Corporation.", url: "/about/" },
    { title: "Our mission", desc: "Regenerative redistribution of goods, services, and wealth.", url: "/about/#mission" },
    { title: "What is a Public Benefit Corporation?", desc: "Why CircleSpaces is structured to serve people and planet first.", url: "/about/#pbc" },
    { title: "NextDorm features", desc: "Listing, matching, zero-waste move-out, and verified campus accounts.", url: "/nextdorm/#features" },
    { title: "How NextDorm works", desc: "List it, match it, circulate it — in three simple steps.", url: "/nextdorm/#how-it-works" },
    { title: "Join the NextDorm waitlist", desc: "Be first to know when the app launches at Brown University.", url: "/nextdorm/#launch" },
    { title: "Our impact", desc: "Items circulated, students reached, and waste diverted.", url: "/#impact" },
    { title: "Get involved / newsletter", desc: "Stay in the loop on new CircleSpaces projects.", url: "/#join" },
    { title: "Home", desc: "CircleSpaces — sustainable, regenerative redistribution.", url: "/" }
  ];

  document.querySelectorAll("[data-search-toggle]").forEach(function (toggle) {
    var panel = toggle.parentElement.querySelector("[data-search-panel]");
    var input = panel ? panel.querySelector("input[type='search']") : null;
    var resultsEl = panel ? panel.querySelector("[data-search-results]") : null;

    function renderResults(query) {
      if (!resultsEl) return;
      resultsEl.innerHTML = "";
      var q = query.trim().toLowerCase();
      var matches = !q ? SEARCH_INDEX.slice(0, 5) : SEARCH_INDEX.filter(function (item) {
        return (item.title + " " + item.desc).toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        var li = document.createElement("li");
        li.className = "search-empty";
        li.textContent = "No pages match “" + query + "” yet.";
        resultsEl.appendChild(li);
        return;
      }
      matches.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.url;
        a.innerHTML = "<strong>" + escapeHtml(item.title) + "</strong><br><span style='color:var(--ink-soft);font-size:0.82rem;'>" + escapeHtml(item.desc) + "</span>";
        li.appendChild(a);
        resultsEl.appendChild(li);
      });
    }
    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    toggle.addEventListener("click", function () {
      if (!panel) return;
      var isOpen = panel.getAttribute("data-open") === "true";
      document.querySelectorAll("[data-search-panel]").forEach(function (p) {
        p.setAttribute("data-open", "false");
      });
      panel.setAttribute("data-open", isOpen ? "false" : "true");
      if (!isOpen) {
        renderResults("");
        setTimeout(function () { input && input.focus(); }, 50);
      }
    });

    input && input.addEventListener("input", function () {
      renderResults(input.value);
    });
  });

  document.addEventListener("click", function (e) {
    document.querySelectorAll("[data-search-panel]").forEach(function (panel) {
      var wrap = panel.closest(".search-wrap");
      if (wrap && !wrap.contains(e.target)) {
        panel.setAttribute("data-open", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll("[data-search-panel]").forEach(function (panel) {
        panel.setAttribute("data-open", "false");
      });
    }
  });
})();
