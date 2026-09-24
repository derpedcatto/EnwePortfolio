// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/// <reference types="@sveltejs/adapter-cloudflare" />
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
declare module "$content/*";

export {};
