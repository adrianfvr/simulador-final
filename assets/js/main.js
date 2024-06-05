window.addEventListener('load', function() {
  ScrollReveal().reveal('.home', {
      origin: 'top',
      distance: '50px',
      duration: 2000,
      reset: true,
      delay: 0
  });
});

ScrollReveal().reveal(".section[id]", {
    origin: 'left',
      distance: '50px',
      duration: 2000,
      reset: true,
      delay: 800
})
ScrollReveal().reveal(".section", {
  origin: 'bottom',
    distance: '50px',
    duration: 2000,
    reset: true,
    delay: 800
})
// Show Menu
const showMenu = (toggleID, navId) => {
  const toggle = document.getElementById(toggleID),
    nav = document.getElementById(navId);

  // Validate that variables exist
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

// Remove Menu Mobile
const navLinks = document.querySelectorAll(".nav__link");
function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
}
navLinks.forEach((navLink) => navLink.addEventListener("click", linkAction));

// Scroll Section Active Link
const sections = document.querySelectorAll("section[id]");
console.log(sections);
function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight,
      sectionTop = section.offsetTop - 50,
      sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight)
      document
        .querySelector(`.nav__menu a[href*=${sectionId}]`)
        .classList.add("active-link");
    else
      document
        .querySelector(`.nav__menu a[href*=${sectionId}]`)
        .classList.remove("active-link");
  });
}
addEventListener("scroll", scrollActive);

// Change Background Header
addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (this.scrollY >= 100) {
    header.classList.add("scroll-header");
  } else header.classList.remove("scroll-header");
});

// Show Scroll Up
addEventListener("scroll", () => {
  const scrollUp = document.getElementById("scroll-up");
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
});

// Dark Light Theme
const themeButton = document.getElementById("theme-button"),
  darkTheme = "dark-theme",
  iconTheme = "bx-toggle-right";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  document.body.classList.contains(darkTheme)
    ? "bx-toggle-left"
    : "bx-toggle-right";

if (selectedTheme) {
  document.body.classList[selectedTheme == "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon == "bx-toggle-left" ? "add" : "remove"](
    iconTheme
  );
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);

  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});