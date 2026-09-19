const colorRef = (color) => `var(--color-${color})`;

const mix = (color, amount, base = "bg") =>
  `color-mix(in oklab, var(--color-${color}) ${amount}%, var(--color-${base}))`;

export default {
  breakpoint: {
    sm: "40rem" /* 640px */,
    md: "48rem" /* 768px */,
    lg: "64rem" /* 1024px */,
    xl: "80rem" /* 1280px */,
    "2xl": "96rem" /* 1536px */,
  },
  font: {
    family: {
      heading: '"Jura", system-ui, sans-serif',
      body: '"Montserrat", system-ui, sans-serif',
    },
  },
  color: {
    /* base */
    bg: ["#fbefef", "#100404"],
    text: ["#130707", "#f8ecec"],
    accent: ["#4d0000", "#ffb3b3"],

    /* derived */
    surface: mix("text", 5),
    border: mix("text", 15),
    "text-muted": mix("text", 65),
    "accent-hover": mix("accent", 80),
    "on-accent": colorRef("bg"),
  },
};
