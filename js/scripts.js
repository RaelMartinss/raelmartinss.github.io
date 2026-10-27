const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const certificateModal = document.querySelector("#certificate-modal");
const certificateTitle = document.querySelector("#certificate-title");
const certificateDocument = document.querySelector(".certificate-modal__document");
const certificateExternalLink = document.querySelector("#certificate-external-link");
const certificateTriggers = document.querySelectorAll(".certificate-trigger");
const certificateCloseButtons = document.querySelectorAll("[data-certificate-close]");
const sections = [...navLinks].map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
let lastCertificateTrigger;

window.lucide?.createIcons();

const setMenuState = (isOpen) => {
    menu?.classList.toggle("is-open", isOpen);
    menuButton?.setAttribute("aria-expanded", String(isOpen));
    const label = menuButton?.querySelector(".sr-only");
    if (label) label.textContent = isOpen ? "Fechar menu" : "Abrir menu";
};

menuButton?.addEventListener("click", () => setMenuState(!menu?.classList.contains("is-open")));
navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));
document.addEventListener("click", (e) => {
    if (menu?.classList.contains("is-open") && !menu.contains(e.target) && !menuButton?.contains(e.target)) {
        setMenuState(false);
    }
});

const setActiveLink = () => {
    const atBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 40;
    let current = atBottom ? sections[sections.length - 1] : sections[0];
    if (!atBottom) {
        sections.forEach((s) => { if (s.getBoundingClientRect().top <= 140) current = s; });
    }
    navLinks.forEach((l) => l.classList.toggle("is-active", Boolean(current && l.getAttribute("href") === `#${current.id}`)));
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });

const closeCertificateModal = () => {
    certificateModal?.classList.remove("is-open");
    certificateModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-modal-open");
    if (certificateDocument) certificateDocument.src = "";
    lastCertificateTrigger?.focus();
};

certificateTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
        if (!window.matchMedia("(min-width: 768px)").matches || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        lastCertificateTrigger = trigger;
        const src = trigger.dataset.certificateSrc || trigger.getAttribute("href");
        certificateTitle.textContent = trigger.dataset.certificateTitle || "Certificado";
        certificateDocument.src = src;
        if (certificateExternalLink) certificateExternalLink.href = src;
        certificateModal.classList.add("is-open");
        certificateModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("has-modal-open");
        certificateModal.querySelector(".certificate-modal__close")?.focus();
    });
});

certificateCloseButtons.forEach((btn) => btn.addEventListener("click", closeCertificateModal));

document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const email = btn.dataset.copyEmail;
        const label = btn.querySelector("span");
        try {
            await navigator.clipboard.writeText(email);
            btn.classList.add("is-copied");
            if (label) label.textContent = "Copiado!";
            setTimeout(() => { btn.classList.remove("is-copied"); if (label) label.textContent = "Copiar"; }, 2200);
        } catch {
            window.location.href = `mailto:${email}`;
        }
    });
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certificateModal?.classList.contains("is-open")) return closeCertificateModal();
    if (e.key === "Escape" && menu?.classList.contains("is-open")) { setMenuState(false); menuButton?.focus(); return; }
    if (e.key === "Tab" && certificateModal?.classList.contains("is-open")) {
        const focusable = certificateModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});
