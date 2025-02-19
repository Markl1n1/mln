document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("language-modal");
    const languageLinks = document.querySelectorAll(".language-options a");
    const languageBtn = document.getElementById("language-btn");

    // Define supported languages
    const supportedLanguages = ["en", "pl", "es", "de", "ru"];

    // Check if a language is already saved in localStorage
    const savedLang = localStorage.getItem("userLanguage");
    if (!savedLang) {
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

            let baseUrl = window.location.origin; // e.g., "https://mln.finance"
            let path = window.location.pathname;  // e.g., "/en/contact-us.html"

            // Split the path into segments
            let pathSegments = path.split("/").filter(segment => segment.trim() !== ""); // Remove empty segments

            // Check if the first segment is a language code
            if (supportedLanguages.includes(pathSegments[0])) {
                pathSegments.shift(); // Remove existing language
            }

            // If selectedLang is "/", redirect to the root
            let newUrl = selectedLang === "/" ? `${baseUrl}/` : `${baseUrl}/${selectedLang}/${pathSegments.join("/")}`;

            // Remove any accidental double slashes
            newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");

            // Redirect to the new URL
            window.location.href = newUrl;
        });
    });
});
