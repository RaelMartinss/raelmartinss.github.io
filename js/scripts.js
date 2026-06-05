const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (window.lucide) {
    window.lucide.createIcons();
}

menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
    });
});

const setActiveLink = () => {
    let current = sections[0];

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 130) {
            current = section;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
    });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });
