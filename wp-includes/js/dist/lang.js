document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("language-modal");
    const languageLinks = document.querySelectorAll(".language-options a");
    const languageBtn = document.getElementById("language-btn");

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
            let path = window.location.pathname;  // e.g., "/contact-us/contact-us.html"

            let newUrl;
            if (selectedLang === "/") {
                // Redirect to root (ensuring no double slashes)
                newUrl = baseUrl + "/";
            } else {
                // Modify URL to insert language code in the path
                let pathSegments = path.split("/").filter(segment => segment.trim() !== ""); // Remove empty segments

                if (pathSegments[0] !== selectedLang) {
                    pathSegments.unshift(selectedLang);
                }

                newUrl = `${baseUrl}/${pathSegments.join("/")}`.replace(/([^:]\/)\/+/g, "$1"); // Remove double slashes
            }

            // Redirect to new URL
            window.location.href = newUrl;
        });
    });
});
