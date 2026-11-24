/* ATRIBUCIÓN PARA EL CRM (clics en botones de WhatsApp)
   Qué hace:
   1) Guarda 30 días de dónde vino el visitante (gclid, utm_*, campaña, anuncio) en el navegador.
   2) Cuando alguien toca un botón/link de WhatsApp, agrega un código "(ref: QSF-XXXXXXXXXX)" al mensaje
      y le avisa al CRM (crm.quinchossantafe.com) con esa referencia y la atribución.
   Así, cuando llega el mensaje por WhatsApp, el CRM sabe de qué anuncio y qué landing salió.
   No toca los links que no son de WhatsApp.
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

  function newRef() {
    var chars = "0123456789ABCDEF", out = "QSF-";
    var bytes = window.crypto && window.crypto.getRandomValues
      ? window.crypto.getRandomValues(new Uint8Array(10))
      : null;
    for (var i = 0; i < 10; i++) {
      out += chars.charAt((bytes ? bytes[i] : Math.floor(Math.random() * 256)) % 16);
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
    if (text.indexOf("(ref: QSF-") !== -1) return href;

    var ref = newRef();
    var sep = text.indexOf("\n") !== -1 ? "\n\n" : " ";
    url.searchParams.set("text", text + sep + "(ref: " + ref + ")");

    var attr = fromUrl() || load() || {};
    attr.clickRef = ref;
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
