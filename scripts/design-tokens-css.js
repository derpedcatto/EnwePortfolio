import designTokens from "../src/lib/styles/design-tokens.js";

export const GENERATED_COMMENT = "/* generated, do not edit */\n\n";

export function rootCss(tokens = designTokens) {
  const { breakpoint: _breakpoint, ...cssTokens } = tokens;

  return `:root {\n${flattenTokens(cssTokens).join("\n")}\n}\n`;
}

export function customMediaCss(breakpoints = designTokens.breakpoint) {
  if (!breakpoints) return "";

  return (
    Object.entries(breakpoints)
      .map(([name, width]) => `@custom-media --${name} (width >= ${width});`)
      .join("\n") + "\n"
  );
}

function flattenTokens(obj, prefix = "") {
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key;

    if (Array.isArray(value)) {
      const [light, dark] = value;
      lines.push(`--${name}: light-dark(${light}, ${dark});`);
    } else if (value !== null && typeof value === "object") {
      lines.push(...flattenTokens(value, name));
    } else {
      lines.push(`--${name}: ${value};`);
    }
  }

  return lines;
}
