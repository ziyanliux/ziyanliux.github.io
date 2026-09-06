const filterButtons = document.querySelectorAll(".filter-button");
const papers = document.querySelectorAll(".paper");
const publicationCount = document.querySelector(".publication-count");

const applyPublicationFilter = (button) => {
  const filter = button.dataset.filter;
  let count = 0;

  filterButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  papers.forEach((paper) => {
    const isVisible = filter === "all" || (filter === "selected"
      ? paper.dataset.selected === "true"
      : paper.dataset.topic === filter);
    paper.hidden = !isVisible;
    if (isVisible) count += 1;
  });

  publicationCount.textContent = count + " publications";
};

document.querySelector(".publication-controls").hidden = false;
filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyPublicationFilter(button));
});
applyPublicationFilter(document.querySelector(".filter-button.active"));

const newsToggle = document.querySelector(".news-toggle");
const earlierNews = [...document.querySelectorAll(".news-list li")].slice(3);
earlierNews.forEach((item) => { item.hidden = true; });
newsToggle.hidden = earlierNews.length === 0;
newsToggle.addEventListener("click", () => {
  const expanded = newsToggle.getAttribute("aria-expanded") !== "true";
  newsToggle.setAttribute("aria-expanded", String(expanded));
  newsToggle.querySelector("span").textContent = expanded ? "Recent updates" : "Earlier updates";
  earlierNews.forEach((item) => { item.hidden = !expanded; });
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll("#main-navigation a");
const closeMenu = () => {
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.title = "Open navigation";
};

menuToggle.hidden = false;
header.classList.add("menu-ready");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  header.classList.toggle("menu-open", expanded);
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
  menuToggle.title = expanded ? "Close navigation" : "Open navigation";
});
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("menu-open")) {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);

// Recalculate from section positions because publication filters change page height.
const sectionTargets = [...navLinks].map((link) => ({
  link,
  section: document.querySelector(link.getAttribute("href")),
}));
let scrollPending = false;
const updateActiveSection = () => {
  let active = sectionTargets[0];
  let closestTop = -Infinity;
  sectionTargets.forEach((target) => {
    const top = target.section.getBoundingClientRect().top;
    if (top <= 150 && top > closestTop) {
      active = target;
      closestTop = top;
    }
  });
  navLinks.forEach((link) => link.removeAttribute("aria-current"));
  active.link.setAttribute("aria-current", "location");
  scrollPending = false;
};
window.addEventListener("scroll", () => {
  if (!scrollPending) {
    scrollPending = true;
    requestAnimationFrame(updateActiveSection);
  }
}, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

const figureLightbox = document.querySelector("#figure-lightbox");
const figureLightboxImage = document.querySelector("#figure-lightbox-image");
const figureCaption = document.querySelector("#figure-lightbox-caption");
let activeFigureButton = null;

document.querySelectorAll(".paper-figure").forEach((button) => {
  button.title = button.getAttribute("aria-label");
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    activeFigureButton = button;
    figureLightboxImage.src = image.currentSrc || image.src;
    figureLightboxImage.alt = image.alt;
    figureCaption.textContent = image.alt;
    figureLightbox.showModal();
    document.body.classList.add("lightbox-open");
  });
});
document.querySelector(".figure-lightbox-close").addEventListener("click", () => figureLightbox.close());
figureLightbox.addEventListener("click", (event) => {
  if (event.target !== figureLightbox) return;
  const bounds = figureLightbox.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) figureLightbox.close();
});
figureLightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  figureLightboxImage.removeAttribute("src");
  activeFigureButton?.focus({ preventScroll: true });
  activeFigureButton = null;
});

if (window.lucide) {
  document.querySelectorAll(".paper-action").forEach((link) => {
    const icon = document.createElement("i");
    icon.dataset.lucide = link.classList.contains("code-action") ? "github" : "file-text";
    icon.setAttribute("aria-hidden", "true");
    link.prepend(icon);
  });
  document.querySelectorAll(".paper-figure").forEach((button) => {
    const zoom = document.createElement("span");
    zoom.className = "figure-zoom";
    zoom.setAttribute("aria-hidden", "true");
    const icon = document.createElement("i");
    icon.dataset.lucide = "maximize-2";
    zoom.append(icon);
    button.append(zoom);
  });
  lucide.createIcons();
}
