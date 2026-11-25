/* ATRIBUCIÓN PARA EL CRM (clics en botones de WhatsApp)
   Qué hace:
   1) Guarda 30 días de dónde vino el visitante (gclid, utm_*, campaña, anuncio) en el navegador.
   2) Cuando alguien toca un botón/link de WhatsApp, agrega al mensaje un renglón
      "Código de consulta: K7P2X9" y le avisa al CRM (crm.quinchossantafe.com) con ese código, la
      atribución y el texto del botón. Si la persona borra el código, el CRM igual lo une por
      horario + texto del botón.
   No toca los links que no son de WhatsApp.
   Generado desde el CRM (Configuración → Landing). Para cambiarlo, regenerarlo desde ahí.
   Va cargado ANTES de main.js en las 3 landings. */
(function () {
  var ENDPOINT = "https://crm.quinchossantafe.com/api/leads/click";
  var TOKEN = "dadbbd60eacf3ea4339949003204820be451eccf67d4ba9a";
  var KEY = "qsf_attr";
  var MAX_AGE = 30 * 24 * 60 * 60 * 1000;

  function pick(params, names) {
    for (var i = 0; i < names.length; i++) {
      var v = params.get(names[i]);
      if (v) return v;
    }
    return null;
  }

  function fromUrl() {
    var p = new URLSearchParams(window.location.search);
    var data = {
      gclid: pick(p, ["gclid"]),
      utmSource: pick(p, ["utm_source"]),
      utmMedium: pick(p, ["utm_medium"]),
      utmCampaign: pick(p, ["utm_campaign"]),
      utmContent: pick(p, ["utm_content"]),
      campaignId: pick(p, ["campaign_id", "campaignid"]),
      adsetId: pick(p, ["adset_id", "adgroupid"]),
      adId: pick(p, ["ad_id", "creative"])
    };
    for (var k in data) if (data[k]) return data;
    return null;
  }

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && Date.now() - raw.t < MAX_AGE) return raw.d;
    } catch (e) {}
    return null;
  }

  // Cada visita con parámetros pisa lo guardado: manda el último anuncio.
  var current = fromUrl();
  if (current) {
    try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: current })); } catch (e) {}
  }

  // Código corto, sin letras que se confunden (mismo alfabeto que ref-patterns.ts).
  function newCode() {
    var chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ", out = "";
    var bytes = window.crypto && window.crypto.getRandomValues
      ? window.crypto.getRandomValues(new Uint8Array(6))
      : null;
    for (var i = 0; i < 6; i++) {
      out += chars.charAt((bytes ? bytes[i] : Math.floor(Math.random() * 256)) % chars.length);
    }
    return out;
  }

  function isWhatsAppLink(url) {
    return url.protocol === "whatsapp:" ||
      url.hostname === "wa.me" ||
      url.hostname === "api.whatsapp.com" ||
      (url.hostname === "web.whatsapp.com" && url.pathname.indexOf("/send") === 0);
  }

  // Agrega el REF al link de WhatsApp y avisa al CRM. Devuelve el link nuevo
  // (o el mismo si no es de WhatsApp / ya tiene REF).
  function tag(href) {
    var url;
    try { url = new URL(href, window.location.href); } catch (err) { return href; }
    if (!isWhatsAppLink(url)) return href;

    var text = url.searchParams.get("text") || "Hola! Quiero un presupuesto.";
    // Ya tiene código (formato nuevo o el viejo "(ref: QSF-…)"): no se agrega otro.
    if (/c[o\u00f3]digo de consulta/i.test(text) || text.indexOf("(ref: QSF-") !== -1) return href;

    var code = newCode();
    url.searchParams.set("text", text + "\n\nC\u00f3digo de consulta: " + code);

    var attr = fromUrl() || load() || {};
    attr.clickRef = "QSF-" + code;
    // El texto del botón SIN el código: si la persona borra el código, el CRM igual puede unir
    // el mensaje con este clic por horario + texto (ver findWebsiteClickByTiming).
    attr.prefill = text;
    attr.landing = window.location.href;
    attr.intakeToken = TOKEN;
    try {
      navigator.sendBeacon(ENDPOINT, new Blob([JSON.stringify(attr)], { type: "text/plain" }));
    } catch (err) {}
    return url.toString();
  }

  // Links <a> a WhatsApp (botones, íconos, menús).
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var tagged = tag(a.href);
    if (tagged !== a.href) a.href = tagged;
  }, true);

  // Formularios que abren WhatsApp por JavaScript con window.open(...).
  var originalOpen = window.open;
  window.open = function (url) {
    var args = Array.prototype.slice.call(arguments);
    if (typeof url === "string") args[0] = tag(url);
    return originalOpen.apply(window, args);
  };
})();
