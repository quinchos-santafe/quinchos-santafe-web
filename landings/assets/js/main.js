/* ANIMACIONES COMUNES A LAS 3 LANDINGS
   1) Lenis  -> scroll suave
   2) GSAP + ScrollTrigger -> animaciones de entrada y de scroll */
document.documentElement.classList.add("js");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);

  // 1) SCROLL SUAVE: Lenis mueve el scroll, ScrollTrigger se entera en cada frame
  const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Links internos (#servicios) con scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
    });
  });

  // 2) ENTRADA DEL HERO: una línea de tiempo, los elementos aparecen en cadena
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__bg", { scale: 1.15, duration: 2 }, 0)
    .from(".site-header", { y: -40, opacity: 0, duration: .9 }, .2)
    .from(".hero [data-hero]", { y: 50, opacity: 0, duration: 1, stagger: .15 }, .4);

  // 3) REVEAL AL HACER SCROLL: cada [data-reveal] aparece al entrar en pantalla
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, y: 0, duration: 1, ease: "power3.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // 4) PARALLAX: la imagen del hero se mueve más lento que el scroll
  gsap.to(".hero__bg", {
    yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // 5) CONTADORES: los números suben de 0 al valor cuando aparecen
  document.querySelectorAll("[data-count]").forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: parseInt(el.dataset.count, 10), duration: 2, ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // 6) HEADER: se vuelve sólido al bajar
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => document.querySelector(".site-header")
      .classList.toggle("is-solid", self.scroll() > 80),
  });
} else {
  // Sin GSAP o con "reducir movimiento": mostrar todo y contadores finales
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
}
