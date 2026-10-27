// ---------- Helpers ----------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ---------- Year in footer ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Navbar: scrolled state + mobile menu ----------
const navbar = $("#navbar");
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});

$$("#navLinks a").forEach((link) =>
  link.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

// ---------- Highlight active nav link on scroll ----------
const sections = $$("section[id]");
const navAnchors = $$("#navLinks a:not(.btn)");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => spy.observe(s));

// ---------- Typing effect ----------
const roles = ["Video Editor", "Photo Editor", "3D Artist"];
const typedEl = $("#typed");
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = roles[roleIndex];
  typedEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 110);
  } else if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 60);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- Scroll reveal + counters + skill bars ----------
function animateCount(el) {
  const target = +el.dataset.count;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 40);
}

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("show");
      $$("[data-count]", el).forEach(animateCount);
      $$(".fill", el).forEach((bar) => (bar.style.width = bar.dataset.width + "%"));
      obs.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Portfolio filter ----------
const filterButtons = $$(".filter");
const items = $$(".item");

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    items.forEach((item) => {
      const show = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hide", !show);
    });
  })
);

// ---------- Lightbox ----------
const lightbox = $("#lightbox");
const lightboxBody = $("#lightboxBody");
const lightboxTitle = $("#lightboxTitle");

function openLightbox(item) {
  const { type, src, title } = item.dataset;
  lightboxBody.innerHTML = "";

  if (!src) {
    lightboxBody.innerHTML =
      '<div class="no-media">Add your file path in <code>data-src</code> to show this work.</div>';
  } else if (type === "youtube") {
    lightboxBody.innerHTML = `<iframe src="${src}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
  } else if (type === "video") {
    lightboxBody.innerHTML = `<video src="${src}" controls autoplay></video>`;
  } else {
    lightboxBody.innerHTML = `<img src="${src}" alt="${title}" />`;
  }

  lightboxTitle.textContent = title || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxBody.innerHTML = ""; // stops any playing video
  document.body.style.overflow = "";
}

items.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
$("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ---------- Contact form (opens the visitor's email app) ----------
// Change this to your real email address.
const MY_EMAIL = "yourmail@example.com";

$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const subject = $("#subject").value.trim() || "Portfolio enquiry";
  const message = $("#message").value.trim();

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href =
    `mailto:${MY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  $("#formNote").textContent = "Thanks! Your email app should open now.";
  e.target.reset();
});
