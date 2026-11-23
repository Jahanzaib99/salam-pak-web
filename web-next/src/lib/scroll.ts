export function scrollToId(id: string, offset = 80) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: { offset?: number }) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
