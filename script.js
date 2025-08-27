// Load translations
const languageSwitcher = document.getElementById("languageSwitcher");

let translations = {};

async function loadTranslations() {
  try {
    const res = await fetch("translations.json");
    translations = await res.json();
    applyTranslations("en");
  } catch (err) {
    console.error("Error loading translations:", err);
  }
}

function applyTranslations(lang) {
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

languageSwitcher.addEventListener("change", (e) => {
  applyTranslations(e.target.value);
});

document.getElementById("startBtn").addEventListener("click", () => {
  alert("AR Experience starting soon!");
});

loadTranslations();
