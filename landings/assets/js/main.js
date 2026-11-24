/* JS COMÚN A LAS 3 LANDINGS
   1) WhatsApp  -> un solo número para toda la web
   2) Menú móvil
   3) Lenis     -> scroll suave
   4) GSAP + ScrollTrigger -> animaciones de entrada y de scroll */
document.documentElement.classList.add("js");

/* ---------- 1) WHATSAPP ----------
   Cambiá el número acá (código de país + área + número, sin + ni espacios).
   Cada botón con data-wa="mensaje" abre el chat con ese mensaje escrito. */
const WHATSAPP = "5493426313000";
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = a.dataset.wa || "Hola! Quiero pedir un presupuesto.";
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- 1b) ICONO, BOTÓN FLOTANTE Y MEDICIÓN ---------- */
const WA_ICON = '<svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
document.querySelectorAll(".btn--wa").forEach((b) => b.insertAdjacentHTML("afterbegin", WA_ICON));

// Botón flotante de WhatsApp: aparece al bajar un poco y queda visible en toda la navegación
const float = document.querySelector(".wa-float");
if (float) {
  float.insertAdjacentHTML("afterbegin", WA_ICON);
  const toggleFloat = () => float.classList.toggle("is-visible", window.scrollY > 400);
  window.addEventListener("scroll", toggleFloat, { passive: true });
  toggleFloat();
}

/* Medición: cada clic en un botón de WhatsApp envía UN evento "whatsapp_click" al dataLayer.
   Google Tag Manager lo toma y lo manda a GA4 y a Google Ads (se configura en GTM, no acá).
   El evento lleva la landing, el texto del botón, el lugar de la página y el modelo (si hay). */
window.dataLayer = window.dataLayer || [];
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-wa]");
  if (!a) return;
  window.dataLayer.push({
    event: "whatsapp_click",
    landing: document.body.dataset.landing || "landing",
    cta_text: a.textContent.trim().slice(0, 60),
    cta_location: a.dataset.loc || a.closest("section, header, footer")?.id || "pagina",
    model: a.dataset.model || undefined,
  });
});

/* Google Tag Manager: el código está pegado en el <head> y el <body> de cada página (contenedor GTM-WJ6PQSWX). */

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

  // 4f) Contadores: el HTML ya muestra el valor final (si la animación no carga, igual se ve bien).
  //     Al entrar en pantalla, el número sube de 0 al valor.
  document.querySelectorAll("[data-count]").forEach((el) => {
    const final = parseInt(el.dataset.count, 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(obj, {
        v: final, duration: 1.6, ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(obj.v)),
        onComplete: () => (el.textContent = final),
      }),
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
  document.querySelector(".site-header")?.classList.add("is-solid");
}

/* ---------- VIDEO DE PORTADA ----------
   Si existe assets/video/portada.mp4, se muestra de fondo. En celular o con ahorro de datos
   no se carga (queda el fondo de marca), para no gastar datos ni frenar la página. */
const heroVideo = document.querySelector(".hero__video");
if (heroVideo) {
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData || window.matchMedia("(max-width: 768px)").matches) heroVideo.remove();
  else {
    const show = () => heroVideo.classList.add("is-playing");
    heroVideo.addEventListener("playing", show);
    heroVideo.addEventListener("canplay", () => !heroVideo.paused && show());
    if (!heroVideo.paused && heroVideo.readyState > 2) show();   // por si ya empezó antes de cargar este script
  }
}
