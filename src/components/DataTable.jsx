import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import PaginacionControls from "./PaginacionControls";

export default function DataTable({ title, columns, data, datosCompletos, rowsPerPage = 10, eliminar, editar }) {
  const allData = datosCompletos ?? data ?? [];
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = rowsPerPage;
  const totalPaginas = Math.max(1, Math.ceil(allData.length / elementosPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [allData, elementosPorPagina]);

  const datosPagina = useMemo(() => {
    const indiceInicial = (paginaActual - 1) * elementosPorPagina;
    const indiceFinal = indiceInicial + elementosPorPagina;
    return allData.slice(indiceInicial, indiceFinal);
  }, [allData, paginaActual, elementosPorPagina]);

  const irAPagina = (numero) => {
    const n = Math.max(1, Math.min(totalPaginas, numero));
    setPaginaActual(n);
  };

  const irAPaginaSiguiente = () => irAPagina(paginaActual + 1);
  const irAPaginaAnterior = () => irAPagina(paginaActual - 1);

  // 🔹 Función mejorada para obtener el valor de una columna
  const getColumnValue = (row, columnName) => {
    // Buscar la clave exacta o similar (case-insensitive)
    const key = Object.keys(row).find(
      (k) => k.toLowerCase() === columnName.toLowerCase()
    );
    
    if (key) return row[key];
    
    // Buscar por coincidencia parcial
    const partialKey = Object.keys(row).find(
      (k) => k.toLowerCase().includes(columnName.toLowerCase()) || 
             columnName.toLowerCase().includes(k.toLowerCase())
    );
    
    return partialKey ? row[partialKey] : "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 container mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <ArrowUpDown size={14} className="opacity-40" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {datosPagina.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                {columns.map((col, j) => {
                  // 🔹 Columna de Acciones
                  if (col === "Acciones") {
                    return (
                      <td key={j} className="px-6 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editar && editar(row)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => eliminar && eliminar(row)}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    );
                  }

                  // 🔹 Columna de Estado
                  if (col.toLowerCase() === "estado") {
                    const estadoValor = getColumnValue(row, col);
                    const esActivo = estadoValor === true || 
                                    estadoValor === "Activo" || 
                                    estadoValor === "Disponible";
                    
                    return (
                      <td key={j} className="px-6 py-3 text-gray-700 whitespace-nowrap">
                        {esActivo ? (
                          <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-medium">
                            {estadoValor === "Disponible" ? "Disponible" : "Activo"}
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-full text-xs font-medium">
                            {estadoValor === "No disponible" ? "No disponible" : "Desactivado"}
                          </span>
                        )}
                      </td>
                    );
                  }

                  // 🔹 Renderizado normal de columnas
                  const valor = getColumnValue(row, col);
                  
                  return (
                    <td key={j} className="px-6 py-3 text-gray-700 whitespace-nowrap">
                      {valor ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))}

            {datosPagina.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <PaginacionControls
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          irAPagina={irAPagina}
          irAPaginaAnterior={irAPaginaAnterior}
          irAPaginaSiguiente={irAPaginaSiguiente}
          desde={(paginaActual - 1) * elementosPorPagina + 1}
          hasta={Math.min(paginaActual * elementosPorPagina, allData.length)}
          total={allData.length}
        />
      </div>
    </div>
  );
}