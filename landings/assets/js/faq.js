/* PREGUNTAS FRECUENTES
   Las respuestas viven acá, en un solo lugar. Cada landing pide las que necesita:
   <div class="faq" data-faq="1,2,3"></div>  -> muestra las preguntas 1, 2 y 3.
   Texto tomado del documento "INFO GENERAL 28/10" (pendiente de aprobación del cliente). */
const FAQS = {
  1: ["¿Los techos de paja se llueven?",
    "<p>Un techo de paja correctamente construido ofrece una excelente protección frente a las lluvias. Utilizamos un sistema de panes de paja peinada, colocados de manera superpuesta para favorecer el escurrimiento natural del agua y evitar filtraciones.</p><p>La pendiente adecuada, la calidad de los materiales y una correcta instalación son fundamentales para lograr una cubierta impermeable y duradera.</p>"],
  2: ["¿Cuánto dura un quincho de paja?",
    "<p>Nuestras cubiertas de paja tienen una vida útil estimada de <b>aproximadamente 10 años</b>, dependiendo de las condiciones climáticas y la ubicación.</p><p>La estructura de madera puede alcanzar una durabilidad considerablemente mayor, según los materiales elegidos y sus condiciones de conservación. Cuando la paja completa su vida útil, es posible renovar la cubierta sin reemplazar toda la estructura, siempre que esta se encuentre en buenas condiciones.</p>"],
  3: ["¿Qué garantía ofrecen?",
    "<p>En Quinchos Santa Fe ofrecemos <b>2 años de garantía por defectos de construcción e instalación</b>.</p><p>Nuestra garantía comercial contempla los inconvenientes atribuibles a errores en la ejecución de la obra, tanto en la estructura como en la colocación de la cubierta de paja, incluyendo filtraciones causadas por defectos de instalación. Respaldamos nuestro trabajo con el compromiso de responder ante cualquier defecto constructivo, de acuerdo con las condiciones de garantía y la normativa vigente.</p>"],
  4: ["¿Los quinchos de paja son seguros frente al fuego?",
    "<p>Nuestros quinchos utilizan paja natural sin tratamientos ignífugos. Por tratarse de un material combustible, es fundamental adoptar las medidas de prevención correspondientes.</p><p>Las parrillas, chimeneas, instalaciones eléctricas y otras posibles fuentes de calor deben diseñarse e instalarse respetando las condiciones de seguridad necesarias para evitar el contacto de la cubierta con llamas, chispas o temperaturas peligrosas. La prevención y una instalación adecuada son esenciales para disfrutar de estos espacios con seguridad.</p>"],
  5: ["¿Realizan instalaciones en todo el país?",
    "<p><b>Sí, trabajamos en todo el territorio argentino.</b> Desde Santa Fe desarrollamos proyectos en distintas provincias, trasladando nuestros equipos de trabajo y materiales hasta el lugar de instalación.</p><p>Realizamos obras residenciales, comerciales y de gran escala, coordinando cada proyecto de acuerdo con su ubicación, características y disponibilidad operativa.</p>"],
  6: ["¿Qué diferencia existe entre las líneas de quinchos?",
    "<p>Contamos con tres líneas constructivas, diferenciadas por sus materiales, terminaciones y durabilidad:</p><ul><li><b>Línea Tradicional:</b> postes de palmera y estructura superior de eucalipto seleccionado. Conserva la estética rústica con una inversión inicial más accesible.</li><li><b>Línea Clásica:</b> postes de eucalipto curado e impregnado y estructura superior de eucalipto seleccionado. Equilibrio entre resistencia, durabilidad y costo.</li><li><b>Línea Exclusiva:</b> postes de quebracho colorado y estructura superior de eucalipto blanqueado. Nuestra línea de mayor categoría.</li></ul><p>Todas comparten nuestro sistema constructivo de cubierta de paja.</p>"],
  7: ["¿Los quinchos de paja son frescos en verano?",
    "<p>Sí. La paja posee excelentes propiedades de aislación térmica natural que ayudan a disminuir la transmisión de calor hacia el interior. Esto favorece ambientes más frescos durante el verano y contribuye a conservar mejor la temperatura durante el invierno.</p>"],
  8: ["¿Qué mantenimiento necesita un quincho?",
    "<p>Nuestros quinchos requieren un mantenimiento relativamente sencillo. Recomendamos revisar periódicamente el estado de la cubierta y la estructura, especialmente después de condiciones climáticas intensas.</p><p>El mantenimiento principal a largo plazo consiste en renovar la cubierta de paja cuando alcanza el final de su vida útil.</p>"],
  9: ["¿Se pueden construir quinchos de grandes dimensiones?",
    "<p>Sí. En Quinchos Santa Fe desarrollamos proyectos de diferentes escalas, desde pequeños espacios familiares hasta estructuras destinadas a salones de eventos, restaurantes, complejos turísticos y establecimientos comerciales. Cada obra se diseña considerando sus dimensiones, características y necesidades estructurales.</p>"],
  10: ["¿Se puede instalar un quincho junto a una construcción existente?",
    "<p>Sí. Realizamos galerías, ampliaciones y cubiertas adaptadas a viviendas y construcciones existentes. Evaluamos las dimensiones, alturas, pendientes y condiciones estructurales para desarrollar una solución funcional y estéticamente integrada al espacio.</p>"],
  11: ["¿Qué necesito tener preparado antes de la instalación?",
    "<p>Las condiciones necesarias dependen del tipo de quincho y las características del terreno. Antes de iniciar cada obra, nuestro equipo informa los requisitos de preparación, ubicación de postes, accesibilidad y demás aspectos necesarios para una correcta instalación.</p>"],
  12: ["¿Cuánto tiempo demora la construcción?",
    "<p>El tiempo de ejecución depende de las dimensiones, el modelo elegido y las características de cada proyecto. Nuestro equipo informa los plazos estimados y coordina la instalación previamente, contemplando que las condiciones climáticas pueden ocasionar modificaciones en el cronograma.</p>"],
  13: ["¿Cómo se realiza el pago?",
    "<p>Ofrecemos diferentes modalidades de pago, que se informan al momento de la cotización. En las operaciones de contado, el esquema habitual contempla <b>50 % al comenzar la instalación y el 50 % restante al finalizar el trabajo</b>, sin necesidad de anticipos para reservar la obra.</p><p>Las condiciones específicas se detallan en cada presupuesto.</p>"],
  14: ["¿Cómo puedo solicitar un presupuesto?",
    "<p>Podés comunicarte directamente con nuestro equipo a través de WhatsApp. Para preparar una cotización necesitamos conocer la localidad de instalación, las medidas aproximadas del quincho y la línea constructiva de tu interés.</p><p>Nuestro equipo te asesorará para encontrar la alternativa más adecuada para tu proyecto.</p>"],
};

document.querySelectorAll("[data-faq]").forEach((box) => {
  box.innerHTML = box.dataset.faq.split(",").map((id) => {
    const [q, a] = FAQS[id.trim()];
    return `<details><summary>${q}</summary><div class="answer"><div>${a}</div></div></details>`;
  }).join("");
});
