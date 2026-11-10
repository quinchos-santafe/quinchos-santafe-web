/* JS COMÚN A LAS 3 LANDINGS
   1) WhatsApp  -> un solo número para toda la web
   2) Menú móvil
   3) Lenis     -> scroll suave
   4) GSAP + ScrollTrigger -> animaciones de entrada y de scroll */
document.documentElement.classList.add("js");

/* ---------- 1) WHATSAPP ----------
   Cambiá el número acá (código de país + área + número, sin + ni espacios).
   Cada botón con data-wa="mensaje" abre el chat con ese mensaje escrito. */
const WHATSAPP = "549XXXXXXXXXX";
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = a.dataset.wa || "Hola! Quiero pedir un presupuesto.";
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- 2) MENÚ MÓVIL ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", open);
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 3) SCROLL SUAVE ---------- */
  const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
    });
  });

  /* ---------- 4) ANIMACIONES ---------- */

  // 4a) Entrada del hero: elementos en cadena + dibujo del techo dorado
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".site-header", { y: -40, opacity: 0, duration: .9 }, 0)
    .from(".hero [data-hero]", { y: 50, opacity: 0, duration: 1, stagger: .14 }, .3);

  // 4b) Dibujar líneas SVG (stroke): se "trazan" solas. Sirve para el techo y los planos.
  const draw = (root, vars = {}) => {
    const shapes = root.querySelectorAll("path, polyline, rect, line");
    shapes.forEach((s) => {
      const len = s.getTotalLength ? s.getTotalLength() : 0;
      if (!len) return;
      s.style.strokeDasharray = len;
      s.style.strokeDashoffset = len;
    });
    return gsap.to(shapes, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: .18, ...vars });
  };
  document.querySelectorAll("[data-draw]").forEach((el) => {
    if (el.closest(".hero")) draw(el, { delay: .5 });
    else draw(el, { scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  // 4c) Aparecer al hacer scroll
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, y: 0, duration: 1, ease: "power3.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // 4d) Grupos: los hijos aparecen uno tras otro
  gsap.utils.toArray("[data-stagger]").forEach((group) => {
    gsap.to(group.children, {
      opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .12,
      scrollTrigger: { trigger: group, start: "top 85%", once: true },
    });
  });

  // 4e) Parallax: data-parallax="0.2" mueve el elemento más lento/rápido que el scroll
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) * 100;
    gsap.fromTo(el, { yPercent: -amount }, {
      yPercent: amount, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // 4f) Contadores
  document.querySelectorAll("[data-count]").forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: parseInt(el.dataset.count, 10), duration: 2, ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // 4g) Barras de durabilidad: se llenan de izquierda a derecha
  gsap.utils.toArray(".bar__fill").forEach((el) => {
    gsap.from(el, {
      scaleX: 0, duration: 1.6, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });

  // 4h) Header sólido al bajar
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => document.querySelector(".site-header").classList.toggle("is-solid", self.scroll() > 80),
  });

  // El FAQ se genera con JS: avisar a ScrollTrigger que recalcule posiciones
  window.addEventListener("load", () => ScrollTrigger.refresh());
} else {
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
  document.querySelector(".site-header")?.classList.add("is-solid");
}
