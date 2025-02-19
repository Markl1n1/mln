document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = window.location.origin; // e.g., "https://mln.finance"
    const path = window.location.pathname;  // e.g., "/"
    
    // Define supported languages
    const supportedLanguages = ["en", "pl", "es", "de", "ru"];
    
    // Get path segments and check if language exists
    let pathSegments = path.split("/").filter(segment => segment.trim() !== "");
    let currentLang = supportedLanguages.includes(pathSegments[0]) ? pathSegments[0] : null;

    // If no language is in the URL, redirect to English
    if (!currentLang) {
        window.location.href = `${baseUrl}/en/`; // Redirect to English version
        return; // Stop further execution
    }

    const modal = document.getElementById("language-modal");
    const languageLinks = document.querySelectorAll(".language-options a");
    const languageBtn = document.getElementById("language-btn");

    // 🛠 Hide modal if the page already has a language in the URL
    if (currentLang) {
        modal.style.display = "none"; // Don't show modal if a language is found
    }

    // Click event to open modal manually (if user clicks the button)
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

            // Remove existing language from path if present
            let newPathSegments = pathSegments.filter(segment => !supportedLanguages.includes(segment));

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
            let newUrl = `${baseUrl}/${selectedLang}/${newPathSegments.join("/")}`.replace(/([^:]\/)\/+/g, "$1");

            // Redirect to the new URL
            window.location.href = newUrl;
        });
    });
});
