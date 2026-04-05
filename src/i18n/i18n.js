import en from "./en.json";
import ua from "./ua.json";

const locales = { en, ua };
const STORAGE_KEY = "lang";

let currentLang = localStorage.getItem(STORAGE_KEY) ?? "en";

export function t(key) {
  return (
    key.split(".").reduce((obj, k) => obj?.[k], locales[currentLang]) ?? key
  );
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function getLang() {
  return currentLang;
}
