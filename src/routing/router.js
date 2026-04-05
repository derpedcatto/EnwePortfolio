import { t, setLang, getLang } from "../i18n/i18n.js";
import routes from "./routes.js";

const app = document.querySelector("#app");

function currentPath() {
  return window.location.hash.replace(/^#\/?/, "");
}

function navigate() {
  const path = currentPath();
  const route = routes[path] ?? routes[""];

  app.innerHTML = route.html;
  document.title = route.title();

  window.scrollTo(0, 0);

  app.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      navigate();
    });
  });

  document.documentElement.lang = getLang();

  app.dispatchEvent(
    new CustomEvent("routechange", { detail: { route: path } }),
  );
}

export function navigateTo(path) {
  window.location.hash = path ? `/${path}` : "";
}

export function initRouter() {
  window.addEventListener("hashchange", navigate);
  navigate();
}
