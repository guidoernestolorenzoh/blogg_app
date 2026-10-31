function dividirPorLongitud(texto, palabrasPorParrafo) {
    const palabras = texto.split(" ");
    const parrafos = [];
    let parrafoActual = [];
  
    palabras.forEach((palabra, index) => {
      parrafoActual.push(palabra);
      if (parrafoActual.length >= palabrasPorParrafo || index === palabras.length - 1) {
        parrafos.push(parrafoActual.join(" "));
        parrafoActual = [];
      }
    });
  
    return parrafos;
  }
  
  function formatearTextoEnParrafos(texto, oracionesPorParrafo = 1) {
    if (!texto) return [];
  
    const oraciones = texto.match(/[^.!?]+[.!?]+(\s|$)/g) || [texto];
  
    if (oraciones.length === 1 && oraciones[0].length > 100) {
      return dividirPorLongitud(oraciones[0], 40);
    }
  
    const parrafos = [];
    for (let i = 0; i < oraciones.length; i += oracionesPorParrafo) {
      const parrafo = oraciones
        .slice(i, i + oracionesPorParrafo)
        .join(" ")
        .trim();
      parrafos.push(parrafo);
    }
  
    return parrafos;
  }
  
  
  function generarExcerpt(content, oracionesPorParrafo = 3) {
    const parrafos = formatearTextoEnParrafos(content, oracionesPorParrafo);
    return parrafos[0] || "";
  }
  
  module.exports = { formatearTextoEnParrafos, generarExcerpt };
  