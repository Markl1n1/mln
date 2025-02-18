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

            // Redirect to the corresponding language page
            window.location.href = `https://mln.finance/${selectedLang}/`;
        });
    });
});
