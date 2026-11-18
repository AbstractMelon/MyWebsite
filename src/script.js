const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Navigation scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile nav toggle
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const navLinks = document.querySelector(".nav-links");
mobileNavToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  const isOpen = navLinks.classList.contains("active");
  mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  mobileNavToggle.innerHTML = isOpen
    ? '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    : '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
});

// Close mobile nav on link click
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    mobileNavToggle.setAttribute("aria-expanded", "false");
    mobileNavToggle.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    history.replaceState(null, "", targetId);
  });
});

// Back to top button
const backToTopButton = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

// Particles animation
const particlesContainer = document.getElementById("particles");
const numberOfParticles = 50;

for (let i = 0; i < numberOfParticles; i++) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  const size = Math.random() * 10 + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  const left = Math.random() * 100;
  const top = Math.random() * 100;
  particle.style.left = `${left}%`;
  particle.style.top = `${top}%`;

  const delay = Math.random() * 5;
  const duration = Math.random() * 3 + 2;
  particle.style.animationDelay = `${delay}s`;
  particle.style.animationDuration = `${duration}s`;

  const opacity = Math.random() * 0.5 + 0.1;
  particle.style.opacity = opacity;

  particlesContainer.appendChild(particle);
}

// Glow effect following mouse. Geometry is cached so mousemove never forces layout.
const glowTargets = Array.from(document.querySelectorAll(".glow"), (glow) => ({
  glow,
  parent: glow.parentElement,
  rect: null,
}));

function updateGlowGeometry() {
  glowTargets.forEach((target) => {
    target.rect = target.parent.getBoundingClientRect();
  });
}

updateGlowGeometry();
window.addEventListener("load", updateGlowGeometry);
window.addEventListener("resize", updateGlowGeometry);
window.addEventListener("scroll", updateGlowGeometry, { passive: true });

let mouseX = 0;
let mouseY = 0;
let glowFrame = 0;

function positionGlows() {
  glowFrame = 0;

  glowTargets.forEach(({ glow, rect }) => {
    if (!rect) return;

    const nearby =
      mouseY >= rect.top - 300 &&
      mouseY <= rect.bottom + 300 &&
      mouseX >= rect.left - 300 &&
      mouseX <= rect.right + 300;

    if (nearby) {
      glow.style.top = `${mouseY - rect.top - 150}px`;
      glow.style.left = `${mouseX - rect.left - 150}px`;
      glow.style.opacity = "0.5";
    }
  });
}

document.addEventListener(
  "mousemove",
  (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!glowFrame) glowFrame = requestAnimationFrame(positionGlows);
  },
  { passive: true }
);

// Contact form handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const submitButton = contactForm.querySelector(".submit-btn");
  const formStatus = document.getElementById("form-status");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    submitButton.disabled = true;

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      website: document.getElementById("website").value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        formStatus.textContent =
          "Thanks for your message. I'll get back to you soon.";
        contactForm.reset();
      } else if (response.status === 429) {
        formStatus.textContent =
          "Too many messages. Please try again in a few minutes.";
      } else if (response.status === 400) {
        formStatus.textContent = "Please check the form fields and try again.";
      } else {
        formStatus.textContent = "Something went wrong. Please try again later.";
      }
    } catch (err) {
      formStatus.textContent =
        "Could not reach the server. Please try again later.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

// Scroll reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
}

// Initial hero animation
const hero = document.querySelector(".hero");
if (hero) {
  requestAnimationFrame(() => hero.classList.add("visible"));
}

// --- Footer Current Year ---
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --- Projects ---
document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      title: "Zentra",
      desc: "An open-source, encrypted, community-hostable chat platform. Servers run their own communities, with channels, roles, moderation, and media hosting built in rather than bolted on.",
      tech: [
        "Go",
        "Svelte",
        "Flutter",
        "Tauri",
        "PostgreSQL",
        "Redis",
        "MinIO",
      ],
      img: "/assets/projects/zentra-project.jpg",
      imgAlt: "Zentra chat interface",
      links: [
        {
          label: "Live site",
          href: "https://zentra.abstractmelon.net",
          primary: true,
        },
        { label: "GitHub", href: "https://github.com/zentra-chat" },
      ],
    },
    {
      title: "TrainTracks",
      desc: "Real-time transit maps for live GTFS feeds. It ingests vehicle positions, estimates movement between sparse updates, and streams the result to the browser over Server-Sent Events. No polling, no refresh.",
      tech: ["Go", "SvelteKit", "MapLibre", "PostGIS", "Redis"],
      img: "/assets/projects/traintracks-project.jpg",
      imgAlt: "TrainTracks live transit map",
      links: [
        {
          label: "Live site",
          href: "https://traintracks.abstractmelon.net/",
          primary: true,
        },
        {
          label: "GitHub",
          href: "https://github.com/AbstractMelon/TrainTracks",
        },
      ],
    },
    {
      title: "OBS Workspaces",
      desc: "A dock layout plugin for OBS Studio. Save your dock positions, sizes, and window geometry under a name, then switch between layouts from the Docks menu. Profiles are plain JSON, so they can be backed up or moved between machines.",
      tech: ["C++", "Qt 6", "OBS API"],
      img: "/assets/projects/obs-workspaces-project.gif",
      imgAlt: "Animated demo of custom OBS dock layouts",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/AbstractMelon/obs-workspaces",
          primary: true,
        },
        {
          label: "Releases",
          href: "https://github.com/AbstractMelon/obs-workspaces/releases",
        },
      ],
    },
    {
      title: "Onshape Replay",
      desc: "Turns Onshape documents into timelapse video. It walks a document's feature history, renders each step, and exports frames as MP4, GIF, or a PNG sequence, with control over camera framing and which feature types appear.",
      tech: ["Go", "Svelte", "TypeScript", "FFmpeg", "Onshape API"],
      img: "/assets/projects/onshape-replay-project.png",
      imgAlt: "Onshape Replay logo and settings",
      contain: true,
      links: [
        {
          label: "Live site",
          href: "https://onshape-replay.abstractmelon.net/",
          primary: true,
        },
        {
          label: "GitHub",
          href: "https://github.com/AbstractMelon/onshape-replay",
        },
      ],
    },
    {
      title: "Silk",
      desc: "A custom mod loader for Spiderheck. It handles mod discovery and loading through Doorstop so mods can hook Unity assemblies without patching the game itself.",
      tech: ["C#", "Doorstop", "Unity"],
      img: "/assets/projects/silk-project.jpg",
      imgAlt: "Silk mod loader running in Spiderheck",
      links: [
        {
          label: "Live site",
          href: "https://silk.abstractmelon.net/",
          primary: true,
        },
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
      ],
    },
  ];

  const moreProjects = [
    {
      title: "AmberSearcher Suite",
      desc: "A search engine stack: Rake crawls, Indicium indexes, Helix links, and Saffron serves the frontend.",
      tech: "Go • Vue.js",
      href: "https://amber.abstractmelon.net/",
    },
    {
      title: "Gem",
      desc: "A Linux task manager built for servers, focused on performance monitoring and resource management.",
      tech: "Go • Linux • C",
      href: "https://gem.abstractmelon.net/",
    },
    {
      title: "Prism",
      desc: "Web-based administration for Linux servers.",
      tech: "Go • Vue.js",
      href: "https://prism.abstractmelon.net/",
    },
    {
      title: "Azurite",
      desc: "A mod hosting platform for publishing and distributing game mods.",
      tech: "Go • Svelte",
      href: "https://azurite.abstractmelon.net/",
    },
    {
      title: "Ladybuild",
      desc: "Automated builds for the Ladybird browser.",
      tech: "Go • Build tooling",
      href: "https://github.com/AbstractMelon/Ladybuild",
    },
    {
      title: "Breeze",
      desc: "A documentation generator for Go projects.",
      tech: "Go • Tooling",
      href: "https://github.com/AbstractMelon/Breeze",
    },
  ];

  const renderTags = (tech) =>
    `<ul class="project-tags">${tech
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;

  const renderActions = (links) =>
    `<div class="project-actions">${links
      .map(
        (link) =>
          `<a class="project-btn${link.primary ? " is-primary" : ""}" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join("")}</div>`;

  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.innerHTML = projects
    .map(
      (project) => `
        <article class="project-row">
          <div class="project-row-media${project.contain ? " is-contain" : ""}">
            <img src="${project.img}" alt="${project.imgAlt}" loading="lazy" decoding="async" />
          </div>
          <div class="project-row-body">
            <h3 class="project-row-title">${project.title}</h3>
            <p class="project-row-desc">${project.desc}</p>
            ${renderTags(project.tech)}
            ${renderActions(project.links)}
          </div>
        </article>
      `
    )
    .join("");

  const moreContainer = document.getElementById("more-projects-container");
  moreContainer.innerHTML = moreProjects
    .map(
      (project) => `
        <a class="project-mini" href="${project.href}" target="_blank" rel="noopener noreferrer">
          <h4>${project.title}</h4>
          <p>${project.desc}</p>
          <span>${project.tech}</span>
        </a>
      `
    )
    .join("");
});
