const filterButtons = document.querySelectorAll(".filter-button");
const papers = document.querySelectorAll(".paper");
const publicationViewLabel = document.querySelector("#publication-view-label");

const applyPublicationFilter = (button) => {
  const filter = button.dataset.filter;

  filterButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  papers.forEach((paper) => {
    const isVisible = filter === "selected"
      ? paper.dataset.selected === "true"
      : paper.dataset.topic === filter;
    paper.hidden = !isVisible;
  });

  if (publicationViewLabel) {
    publicationViewLabel.textContent = button.dataset.label || "Selected Publications";
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPublicationFilter(button);
  });
});

const activeFilterButton = document.querySelector(".filter-button.active") || filterButtons[0];

if (activeFilterButton) {
  applyPublicationFilter(activeFilterButton);
}

const figureButtons = document.querySelectorAll(".paper-figure");
const figureLightbox = document.querySelector("#figure-lightbox");
const figureLightboxImage = document.querySelector("#figure-lightbox-image");
const figureLightboxClose = document.querySelector(".figure-lightbox-close");
let activeFigureButton = null;

const closeFigureLightbox = () => {
  if (!figureLightbox || !figureLightboxImage) {
    return;
  }

  figureLightbox.hidden = true;
  figureLightboxImage.src = "";
  figureLightboxImage.alt = "";
  document.body.classList.remove("lightbox-open");

  if (activeFigureButton) {
    activeFigureButton.focus();
    activeFigureButton = null;
  }
};

figureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");

    if (!figureLightbox || !figureLightboxImage || !image) {
      return;
    }

    activeFigureButton = button;
    figureLightboxImage.src = image.currentSrc || image.src;
    figureLightboxImage.alt = image.alt;
    figureLightbox.hidden = false;
    document.body.classList.add("lightbox-open");

    if (figureLightboxClose) {
      figureLightboxClose.focus();
    }
  });
});

if (figureLightboxClose) {
  figureLightboxClose.addEventListener("click", closeFigureLightbox);
}

if (figureLightbox) {
  figureLightbox.addEventListener("click", (event) => {
    if (event.target === figureLightbox) {
      closeFigureLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && figureLightbox && !figureLightbox.hidden) {
    closeFigureLightbox();
  }
});
