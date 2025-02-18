document.addEventListener("DOMContentLoaded", function () {
    const selectedLang = document.querySelector(".selected-language");
    const langMenuItems = document.querySelectorAll(".language-menu a");

    // Check if a language was previously selected (using localStorage)
    const storedLang = localStorage.getItem("selectedLang");
    if (storedLang) {
      updateSelectedLanguage(storedLang);
    }

    // Update selected language on click
    langMenuItems.forEach(item => {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const lang = this.href.split("=")[1]; // Get language code from URL
        updateSelectedLanguage(lang);
        localStorage.setItem("selectedLang", lang); // Store in localStorage
      });
    });

    function updateSelectedLanguage(lang) {
      const flagMap = {
        "en": { src: "https://flagcdn.com/w40/gb.png", text: "English" },
        "pl": { src: "https://flagcdn.com/w40/pl.png", text: "Polski" },
        "es": { src: "https://flagcdn.com/w40/es.png", text: "Español" },
        "de": { src: "https://flagcdn.com/w40/de.png", text: "Deutsch" },
        "ru": { src: "https://flagcdn.com/w40/ru.png", text: "Русский" }
      };

      if (flagMap[lang]) {
        selectedLang.innerHTML = `<img src="${flagMap[lang].src}" alt="${flagMap[lang].text} Flag"> ${flagMap[lang].text}`;
      }
    }
  });