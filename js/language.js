// Language Toggle System for Le Centre Franco Tournaments
// Manages FR/EN language switching

// Get current language from localStorage or default to French
let currentLang = localStorage.getItem('preferredLang') || 'fr';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update all translatable text
  updateAllText();
  
  // Set up language toggle button
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    // Update button text to show which language you'll switch TO
    langToggle.textContent = translations[currentLang].header.langToggle;
    
    // Add click handler
    langToggle.addEventListener('click', toggleLanguage);
  }
});

// Toggle between French and English
function toggleLanguage() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  switchLanguage(currentLang);
}

// Switch to specific language
function switchLanguage(lang) {
  currentLang = lang;
  
  // Save preference
  localStorage.setItem('preferredLang', lang);
  
  // Update HTML lang attribute for accessibility
  document.documentElement.lang = lang;
  
  // Update all text content
  updateAllText();
  
  // Update toggle button text
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = translations[currentLang].header.langToggle;
  }
  
  // Dispatch custom event for other scripts to listen to
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Update all translatable elements on the page
function updateAllText() {
  // Find all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);
    
    if (translation) {
      // Check if we should update innerHTML or textContent
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getTranslation(key);
    
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Update title attributes (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = getTranslation(key);
    
    if (translation) {
      element.title = translation;
    }
  });
  
  // Update aria-label attributes for accessibility
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    const translation = getTranslation(key);
    
    if (translation) {
      element.setAttribute('aria-label', translation);
    }
  });
}

// Get translation by dot-notation key (e.g., "landing.welcome")
function getTranslation(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return null;
    }
  }
  
  return value;
}

// Helper function to translate text programmatically
function t(key) {
  return getTranslation(key) || key;
}

// Get current language
function getCurrentLanguage() {
  return currentLang;
}

// Check if current language is French
function isFrench() {
  return currentLang === 'fr';
}

// Check if current language is English
function isEnglish() {
  return currentLang === 'en';
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.i18n = {
    switchLanguage,
    toggleLanguage,
    updateAllText,
    getTranslation,
    t,
    getCurrentLanguage,
    isFrench,
    isEnglish,
    get currentLang() { return currentLang; }
  };
}
