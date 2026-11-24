/* =========================================================
   SUNVERA ENERGY — Vanilla JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const backToTop = document.getElementById("backToTop");
  const sections = [...document.querySelectorAll("main section[id]")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation ---------- */
  const closeMenu = () => {
    mainNav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) closeMenu();
  });

  /* ---------- Sticky header + back to top ---------- */
  const updateScrollUI = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 550);
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Active navigation ---------- */
  const setActiveNav = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
          setActiveNav(entry.target.id);
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .18, .5] });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------- Scroll reveal ---------- */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const duration = 1300;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(counter => {
      counter.textContent = Number(counter.dataset.target).toLocaleString();
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate: value => value.trim().length >= 2 ? "" : "Please enter your name."
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email."
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("phoneError"),
      validate: value => /^[+()\-\s\d]{8,20}$/.test(value.trim()) ? "" : "Please enter a valid phone number."
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate: value => value.trim().length >= 10 ? "" : "Please add a little more detail (10+ characters)."
    }
  };

  const validateField = field => {
    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.classList.toggle("invalid", Boolean(message));
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  };

  Object.values(fields).forEach(field => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("invalid")) validateField(field);
    });
  });

  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    formMessage.className = "form-message";

    const valid = Object.values(fields).every(validateField);

    if (!valid) {
      formMessage.textContent = "Please check the highlighted fields and try again.";
      formMessage.classList.add("error");
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin"></i>';

    // Front-end demo: replace this section with your backend/API endpoint.
    window.setTimeout(() => {
      contactForm.reset();
      Object.values(fields).forEach(field => {
        field.error.textContent = "";
        field.input.classList.remove("invalid");
        field.input.removeAttribute("aria-invalid");
      });

      formMessage.textContent = "Thanks! Your enquiry has been received. Our team will be in touch shortly.";
      formMessage.classList.add("success");

      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Enquiry <i class="fa-solid fa-paper-plane"></i>';
    }, 900);
  });

  /* ---------- Newsletter demo ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email.";
      return;
    }

    newsletterMessage.textContent = "You're on the list — welcome to the sunny side.";
    newsletterForm.reset();
  });

  /* ---------- Product card keyboard feedback ---------- */
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        const link = card.querySelector(".product-link");
        if (link) {
          event.preventDefault();
          link.click();
        }
      }
    });
  });

  /* ---------- Close mobile menu on Escape ---------- */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
});
