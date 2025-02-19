document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("language-modal");
    const languageLinks = document.querySelectorAll(".language-options a");
    const languageBtn = document.getElementById("language-btn");

    // Define supported languages
    const supportedLanguages = ["en", "pl", "es", "de", "ru"];

    // Get current language from URL
    let pathSegments = window.location.pathname.split("/").filter(segment => segment.trim() !== "");
    let currentLang = supportedLanguages.includes(pathSegments[0]) ? pathSegments[0] : null;

    // Check if a language is already saved in localStorage
    const savedLang = localStorage.getItem("userLanguage");
    const firstVisit = localStorage.getItem("firstVisit"); // New flag to prevent showing modal after redirect

    // Show modal only if there's no language in URL AND it's their first visit
    if (!savedLang && !currentLang && !firstVisit) {
        modal.style.display = "flex"; // Show modal on first visit
    }

    // Click event to open modal when button is clicked
    if (languageBtn) {
        languageBtn.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    }

    // Handle language selection
    languageLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute("data-lang");

            if (!selectedLang) return; // Prevent errors if no data-lang is found

            // Save language selection in localStorage
            localStorage.setItem("userLanguage", selectedLang);
            localStorage.setItem("firstVisit", "true"); // Mark that the user has picked a language

            let baseUrl = window.location.origin; // e.g., "https://mln.finance"
            let path = window.location.pathname;

            // Remove existing language from path if present
            let pathSegments = path.split("/").filter(segment => !supportedLanguages.includes(segment));

            // If selectedLang is "/", redirect to the root
            if (selectedLang === "/") {
                modal.style.display = "none"; // Just close the modal if selecting root
                return;
            }

            // If already on the selected language, just close the modal
            if (selectedLang === currentLang) {
                modal.style.display = "none";
                return;
            }

            // Construct new URL with the selected language
            let newUrl = `${baseUrl}/${selectedLang}/${pathSegments.join("/")}`.replace(/([^:]\/)\/+/g, "$1");

            // Redirect to the new URL
            window.location.href = newUrl;
        });
    });
});
