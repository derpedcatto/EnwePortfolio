import { Nav } from "../components/nav";
import { LangSwitcher } from "../components/langSwitcher";
import { t } from "../i18n/i18n";

export const aboutHTML = /*html*/ `
  ${LangSwitcher()}
  ${Nav()}
  <h1>${t("nav.about")}</h1>
`;
