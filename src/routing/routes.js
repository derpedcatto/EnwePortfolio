import { homeHTML } from "../pages/home.js";
import { aboutHTML } from "../pages/about.js";
import { t } from "../i18n/i18n.js";

const routes = {
  "": { html: homeHTML, title: () => t("artist"), label: () => t("nav.home") },
  about: {
    html: aboutHTML,
    title: () => `${t("artist")} - ${t("nav.about")}`,
    label: () => t("nav.about"),
  },
};

export default routes;
