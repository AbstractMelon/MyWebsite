// Typed effect
const typedTextElement = document.querySelector(".typed-text");
const textArray = [
  "Developer",
  "Combat Robotics Enthusiast",
  "Open Source Advocate",
    "Linux Enthusiast",
];
let textArrayIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function type() {
  const currentText = textArray[textArrayIndex];

  if (isDeleting) {
    typedTextElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = erasingDelay;
  } else {
    typedTextElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = newTextDelay;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textArrayIndex = (textArrayIndex + 1) % textArray.length;
  }

  setTimeout(type, typingDelay);
}

document.addEventListener("DOMContentLoaded", () => {
  type();
});

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
  mobileNavToggle.innerHTML = isOpen
    ? '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    : '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
});

// Close mobile nav on link click
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    mobileNavToggle.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
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
    behavior: "smooth",
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

// Glow effect following mouse
const glowElements = document.querySelectorAll(".glow");
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY + window.scrollY;

  glowElements.forEach((glow) => {
    const rect = glow.parentElement.getBoundingClientRect();
    const parentTop = rect.top + window.scrollY;
    const parentLeft = rect.left;
    const parentHeight = rect.height;
    const parentWidth = rect.width;

    // Only move if mouse is within or near parent element
    if (
      mouseY >= parentTop - 300 &&
      mouseY <= parentTop + parentHeight + 300 &&
      mouseX >= parentLeft - 300 &&
      mouseX <= parentLeft + parentWidth + 300
    ) {
      glow.style.top = `${mouseY - parentTop - 150}px`;
      glow.style.left = `${mouseX - parentLeft - 150}px`;
      glow.style.opacity = "0.5";
    }
  });
});

// Contact form handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Thanks for your message! I'll get back to you soon.");
    } else {
      alert("Oops, something went wrong. Please try again later.");
    }

    contactForm.reset();
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const sections = document.querySelectorAll(".section");

sections.forEach((section) => {
  observer.observe(section);
});

// --- Initial Hero Animation ---
const heroSection = document.querySelector(".hero-section.animate-on-load");
if (heroSection) {
  // Use a small delay to make sure that the styles are loaded
  setTimeout(() => {
    heroSection.classList.add("visible");
    document.querySelector(".hero").classList.add("visible");
  }, 100); // 100ms delay
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
      desc: "Open-source, encrypted, community-hostable chat platform with modern server features.",
      tech: "Go • Svelte • Flutter • Tauri • PostgreSQL • Redis • MinIO",
      img: "/assets/projects/zentra-project.png",
      imgAlt: "Zentra Project",
      links: [
        { label: "GitHub", href: "https://github.com/zentra-chat" },
        { label: "Live", href: "https://zentra.abstractmelon.net" },
      ],
    },
    {
      title: "AmberSearcher Suite",
      desc: `A comprehensive search engine stack: Rake (web scraper), Saffron (frontend), Indicium (backend), Helix (linker).`,
      tech: "Go • Vue.js • Search Infrastructure",
      img: "/assets/projects/ambersearcher-project.png",
      imgAlt: "AmberSearcher Suite Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://amber.abstractmelon.net/" },
      ],
    },
    {
      title: "BoplMapDB",
      desc: "Map hosting and database site for the game Bopl Battle.",
      tech: "Go • Vue.js • JSON",
      img: "/assets/projects/boplmapdb-project.png",
      imgAlt: "BoplMapDB Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://map-maker.abstractmelon.net/" },
      ],
    },
    {
      title: "Silk",
      desc: "Custom mod loader designed for the game Spiderheck.",
      tech: "C# • Doorstop • Unity",
      img: "/assets/projects/silk-project.png",
      imgAlt: "Silk Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://silk.abstractmelon.net/" },
      ],
    },
    {
      title: "Gem",
      desc: "Linux task manager designed for servers, offering performance monitoring and resource management.",
      tech: "Go • Linux • C",
      img: "/assets/projects/gem-project.png",
      imgAlt: "Gem Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://gem.abstractmelon.net/" },
      ],
    },
    {
      title: "Prism",
      desc: "Linux server manager providing intuitive web-based administration for server environments.",
      tech: "Go • Vue.js • Linux",
      img: "/assets/projects/prism-project.png",
      imgAlt: "Prism Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://prism.abstractmelon.net/" },
      ],
    },
    {
      title: "Azurite",
      desc: "Mod hosting platform.",
      tech: "Go • Svelte • Data Platform",
      img: "/assets/projects/azurite-project.png",
      imgAlt: "Azurite Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://azurite.abstractmelon.net/" },
      ],
    },
    {
      title: "FTrack",
      desc: "ADS-D receiver handler.",
      tech: "Go • C++ • Vue.js",
      img: "/assets/projects/ftrack-project.png",
      imgAlt: "FTrack Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon" },
        { label: "Live", href: "https://ftrack.abstractmelon.net/" },
      ],
    },
    {
      title: "ReDash",
      desc: "Custom community server implementation for the game 3Dash.",
      tech: "Go • Game Servers • Networking",
      img: "/assets/projects/redash-project.png",
      imgAlt: "ReDash Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon/ReDash" },
      ],
    },
    {
      title: "Ladybuild",
      desc: "Automatic Ladybird building tool.",
      tech: "Go • Build Tools",
      img: "/assets/projects/ladybuild-project.png",
      imgAlt: "Ladybuild Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon/Ladybuild" },
        { label: "Live", href: "https://ladybuild.abstractmelon.net/" },
      ],
    },
    {
      title: "Breeze",
      desc: "Docs generator.",
      tech: "Go • Tooling • Documentation",
      img: "/assets/projects/breeze-project.png",
      imgAlt: "Breeze Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon/Breeze" },
        { label: "Live", href: "https://breeze.abstractmelon.net/" },
      ],
    },
    {
      title: "RGB From IP",
      desc: "Converts IP address to RGB color.",
      tech: "JS • Utilities • APIs",
      img: "/assets/projects/rgb-from-ip-project.png",
      imgAlt: "RGB From IP Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon/MyWebsite/tree/main/src/rgb-from-ip" },
        { label: "Live", href: "https://abstractmelon.net/rgb-from-ip" },
      ],
    },
    {
      title: "RobotRegistry",
      desc: "A modern, fast data viewer for robot combat events, bots, teams, and rankings.",
      tech: "Go • Svelte • Tailwind • SQLite",
      img: "/assets/600x400.png",
      imgAlt: "RobotRegistry Project",
      links: [
        { label: "GitHub", href: "https://github.com/AbstractMelon/RobotRegistry" },
        { label: "Live", href: "https://robot-registry.abstractmelon.net/" },
      ],
    },
    {
      title: "Neutron Robotics",
      desc: "Full-stack e-commerce platform for robotics products with secure Stripe payments.",
      tech: "SvelteKit • Go • Stripe",
      img: "/assets/600x400.png",
      imgAlt: "Neutron Robotics Project",
      links: [
        { label: "Live", href: "https://neutron-robotics.abstractmelon.net/" },
      ],
    },
  ];

  const container = document.getElementById("projects-container");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-img">
        <img src="${project.img}" alt="${project.imgAlt}" />
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.desc}</p>
        <div class="project-tech">${project.tech}</div>
        ${project.links.length
          ? `<div class="project-links">${project.links
              .map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
              .join("")}</div>`
          : ""}
      </div>
    `;
    container.appendChild(card);
  });
});
