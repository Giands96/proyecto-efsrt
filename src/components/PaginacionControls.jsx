import React from "react";

export default function PaginacionControls({
  paginaActual,
  totalPaginas,
  irAPagina,
  irAPaginaAnterior,
  irAPaginaSiguiente,
  desde,
  hasta,
  total
}) {
  // Genera un rango de páginas visible (máx 5 botones)
  const maxButtons = 5;
  let start = Math.max(1, paginaActual - Math.floor(maxButtons / 2));
  let end = Math.min(totalPaginas, start + maxButtons - 1);
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }
  const paginas = [];
  for (let i = start; i <= end; i++) paginas.push(i);

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-t mt-4">
      <div className="text-sm text-gray-600">
        {total === 0 ? "Mostrando 0" : `Mostrando ${desde}-${hasta} de ${total}`}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => irAPagina(1)}
          disabled={paginaActual === 1}
          className={`px-2 py-1 rounded ${paginaActual === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          «
        </button>

        <button
          onClick={irAPaginaAnterior}
          disabled={paginaActual === 1}
          className={`px-2 py-1 rounded ${paginaActual === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ‹
        </button>

        {start > 1 && (
          <span className="px-2 text-gray-500">...</span>
        )}

        {paginas.map((p) => (
          <button
            key={p}
            onClick={() => irAPagina(p)}
            className={`px-3 py-1 rounded ${p === paginaActual ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}

        {end < totalPaginas && (
          <span className="px-2 text-gray-500">...</span>
        )}

        <button
          onClick={irAPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className={`px-2 py-1 rounded ${paginaActual === totalPaginas ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ›
        </button>

        <button
          onClick={() => irAPagina(totalPaginas)}
          disabled={paginaActual === totalPaginas}
          className={`px-2 py-1 rounded ${paginaActual === totalPaginas ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          »
        </button>
      </div>
    </div>
  );
}