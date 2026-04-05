import { getLang, setLang } from "../i18n/i18n.js";

export function LangSwitcher() {
  const lang = getLang();

  return /*html*/ `
    <div class="lang-switcher">
      <button data-lang="en" class="${lang === "en" ? "active" : ""}">EN</button>
      <button data-lang="ua" class="${lang === "ua" ? "active" : ""}">UA</button>
    </div>
  `;
}
