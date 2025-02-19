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
    languageBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // Handle language selection
    languageLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute("data-lang");

            // Save language selection in localStorage
            localStorage.setItem("userLanguage", selectedLang);

            // Modify URL to insert language code in the path
            let currentUrl = window.location.href;
            let baseUrl = window.location.origin; // e.g., "https://mln.finance"
            let path = window.location.pathname;  // e.g., "/contact-us/contact-us.html"

            // Ensure the language is not already in the path
            let pathSegments = path.split("/").filter(segment => segment.trim() !== ""); // Remove empty segments
            if (!pathSegments.includes(selectedLang)) {
                pathSegments.unshift(selectedLang); // Add language at the beginning
            }

            // Construct the new URL
            let newUrl = `${baseUrl}/${pathSegments.join("/")}`;

            // Redirect to new URL
            window.location.href = newUrl;
        });
    });
});
