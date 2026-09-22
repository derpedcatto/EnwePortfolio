/* notes in case I'd want to change stuff
colors: https://www.realtimecolors.com/?colors=130b0b-fcf8f8-4d0000-dba4a4-cd7070&fonts=Jura-Montserrat

layout - measure
  measure: {
    desktop: "66ch",  // 45-75
    tablet: "52ch", // 40-65
    mobile: "42ch", // 30-50
  },

layout - gutter
  xl: "1.375rem", // 22
  "2xl": "2.125rem", // 34
*/

/**
 * @param {string} color
 * @param {number} amount
 */
const mix = (color, amount, base = "bg") =>
  `color-mix(in oklab, var(--color-${color}) ${amount}%, var(--color-${base}))`;

/**
 * @param {string} color
 * @param {number} amount
 */
const alpha = (color, amount) =>
  `color-mix(in oklab, var(--color-${color}) ${amount}%, transparent)`;

export default {
  breakpoint: {
    sm: "40rem", // 640,
    md: "48rem", // 768,
    lg: "64rem", // 1024,
    xl: "80rem", // 1280,
  },
  space: {
    1: "0.25rem", // 4
    2: "0.5rem", // 8
    3: "0.75rem", // 12
    4: "1rem", // 16
    6: "1.5rem", // 24
    8: "2rem", // 32
    12: "3rem", // 48
    16: "4rem", // 64
    24: "6rem", // 96
  },
  layout: {
    content: "80rem", // 1280
    gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)", // 16-40
    measure: "min(66ch, 100%)",
  },
  font: {
    family: {
      heading: '"Jura", system-ui, sans-serif',
      body: '"Montserrat", system-ui, sans-serif',
    },
    size: {
      xs: "0.75rem", // 12
      sm: "0.875rem", // 14
      base: "1rem", // 16
      lg: "1.125rem", // 18
      xl: "clamp(1.25rem, 1.15rem + 0.5vw, 1.375rem)", // 20-22
      "2xl": "clamp(1.75rem, 1.35rem + 2vw, 2.125rem)", // 28-34
      "3xl": "clamp(2.5rem, 1.8rem + 3.5vw, 4rem)", // 40-64
    },
    leading: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
    tracking: {
      tight: "-0.01em",
      normal: "0em",
      wide: "0.08em",
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    full: "9999px",
  },
  zindex: {
    base: 0,
    sticky: 5,
    overlay: 10,
  },
  color: {
    /* base [light, dark] */
    bg: ["#fbefef", "#100404"],
    text: ["#130707", "#f8ecec"],
    accent: ["#4d0000", "#ffb3b3"],

    /* derived */
    surface: mix("text", 5),
    border: mix("text", 15),
    "border-subtle": mix("text", 8),
    "border-strong": mix("text", 45),
    "text-muted": mix("text", 65),
    "text-on-accent": "var(--color-bg)",
    "accent-hover": mix("accent", 85, "text"),
    "accent-subtle": mix("accent", 10),
  },
  shadow: {
    sm: `0 1px 2px ${alpha("accent", 12)}`,
    md: `0 4px 16px ${alpha("accent", 18)}`,
  },
  motion: {
    duration: {
      fast: "200ms",
      base: "300ms",
      slow: "450ms",
      reveal: "600ms",
      zoom: "900ms",
    },
    ease: {
      out: "cubic-bezier(0.22, 1, 0.36, 1)",
      spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      inout: "ease-in-out",
    },
    stagger: {
      step: "45ms",
      card: "55ms",
    },
  },
};
