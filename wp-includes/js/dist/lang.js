document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("language-modal");
    const languageLinks = document.querySelectorAll(".language-options a");

    // Check if a language is already saved in localStorage
    const savedLang = localStorage.getItem("userLanguage");
    if (!savedLang) {
        modal.style.display = "flex"; // Show the modal if no language is saved
    } else {
        // Redirect to saved language page if necessary
        if (!window.location.href.includes(`/${savedLang}/`)) {
            window.location.href = `https://mln.finance/${savedLang}/`;
        }
    }

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
