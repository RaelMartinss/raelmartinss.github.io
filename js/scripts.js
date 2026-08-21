const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const certificateModal = document.querySelector("#certificate-modal");
const certificateTitle = document.querySelector("#certificate-title");
const certificateDocument = document.querySelector(".certificate-modal__document");
const certificateTriggers = document.querySelectorAll(".certificate-trigger");
const certificateCloseButtons = document.querySelectorAll("[data-certificate-close]");
let lastCertificateTrigger;
const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (window.lucide) {
    window.lucide.createIcons();
}

menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    const menuLabel = menuButton.querySelector(".sr-only");
    if (menuLabel) {
        menuLabel.textContent = isOpen ? "Fechar menu" : "Abrir menu";
    }
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

const closeCertificateModal = () => {
    certificateModal?.classList.remove("is-open");
    certificateModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-modal-open");
    if (certificateDocument) {
        certificateDocument.src = "";
    }
    lastCertificateTrigger?.focus();
};

certificateTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        lastCertificateTrigger = trigger;
        certificateTitle.textContent = trigger.dataset.certificateTitle;
        certificateDocument.src = trigger.dataset.certificateSrc;
        certificateModal.classList.add("is-open");
        certificateModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("has-modal-open");
        certificateModal.querySelector(".certificate-modal__close").focus();
    });
});

certificateCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCertificateModal);
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certificateModal?.classList.contains("is-open")) {
        closeCertificateModal();
        return;
    }

    if (event.key === "Escape" && menu?.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
        const menuLabel = menuButton?.querySelector(".sr-only");
        if (menuLabel) {
            menuLabel.textContent = "Abrir menu";
        }
        menuButton?.focus();
    }
});
