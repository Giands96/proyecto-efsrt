import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";
import { X, Info, Eye } from "lucide-react";
import { useMemo } from "react";

const columns = ["ID", "Cliente", "Fecha", "Total", "Método de Pago", "Observaciones", "Acciones"];

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementsPerPage = 10;

  const datosPaginados = useMemo(() => {
    const indiceInicial = (paginaActual-1) * elementsPerPage;
    const indiceFinal = indiceInicial + elementsPerPage;
    return ventas.slice(indiceInicial, indiceFinal);
  },[ventas, paginaActual, elementsPerPage])

  const totalPaginas = Math.ceil(ventas.length/elementsPerPage)

   const irAPagina = (numero) => {
    setPaginaActual(Math.max(1, Math.min(totalPaginas, numero)));
  };

  const irAPaginaSiguiente = () => irAPagina(paginaActual + 1);
  const irAPaginaAnterior = () => irAPagina(paginaActual - 1);


  const verDetalleVenta = async (venta) => {
    console.log("Venta seleccionada:", venta);
    setCargandoDetalle(true);
    setMostrarModal(true);
    setDetalleVenta(venta);
    
    // Primero obtenemos los detalles de venta
    const { data: detalles, error: errorDetalles } = await supabase
      .from("detalle_venta")
      .select("*")
      .eq("id_venta", venta.ID);

    console.log("Detalles de venta:", detalles);
    console.log("Error detalles:", errorDetalles);

    if (errorDetalles) {
      console.error("Error cargando detalle de venta:", errorDetalles);
      setProductos([]);
      setCargandoDetalle(false);
      return;
    }

    // Luego obtenemos la información de cada producto
    if (detalles && detalles.length > 0) {
      const idsProductos = detalles.map(d => d.id_producto);
      
      const { data: productosData, error: errorProductos } = await supabase
        .from("producto")
        .select("id_producto, nombre")
        .in("id_producto", idsProductos);

      console.log("Productos:", productosData);
      console.log("Error productos:", errorProductos);

      // Combinamos los datos
      const productosConDetalle = detalles.map(detalle => {
        const producto = productosData?.find(p => p.id_producto === detalle.id_producto);
        return {
          ...detalle,
          producto: producto || null
        };
      });

      console.log("Productos combinados:", productosConDetalle);
      setProductos(productosConDetalle);
    } else {
      setProductos([]);
    }

    setCargandoDetalle(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDetalleVenta(null);
    setProductos([]);
  };

  useEffect(() => {
    const fetchVentas = async () => {
      const { data, error } = await supabase
        .from("venta")
        .select(`
          id_venta,
          fecha,
          total,
          metodo_pago,
          observaciones,
          cliente (nombre)
        `)
        .order("fecha", { ascending: false });

      if (error) console.error("Error cargando ventas:", error);
      else {
        const formateadas = data.map((v) => ({
          ID: v.id_venta,
          Cliente: v.cliente?.nombre || "—",
          Fecha: v.fecha ? new Date(v.fecha).toLocaleDateString("es-PE") : "—",
          Total: `S/. ${(Number(v.total) || 0).toFixed(2)}`,
          "Método de Pago": v.metodo_pago || "—",
          Observaciones: v.observaciones || "—",
        }));
        setVentas(formateadas);
      }
    };

    fetchVentas();
  }, []);

  // Componente personalizado para los botones de acción
  const AccionesPersonalizadas = ({ row }) => (
    <div className="flex gap-2">
      <button
        onClick={() => verDetalleVenta(row)}
        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition cursor-pointer"
        title="Ver Detalle"
      >
        <Eye size={16} className="text-blue-600" />
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6 container mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Ventas</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {ventas.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.ID}</td>
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.Cliente}</td>
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.Fecha}</td>
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.Total}</td>
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row["Método de Pago"]}</td>
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{row.Observaciones}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <AccionesPersonalizadas row={row} />
                  </td>
                </tr>
              ))}

              {ventas.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
  <div className="text-sm text-gray-700">
    Mostrando {((paginaActual - 1) * elementsPerPage) + 1}-
    {Math.min(paginaActual * elementsPerPage, ventas.length)} de {ventas.length}
  </div>
  
  <div className="flex items-center gap-2">
    <button
      onClick={() => irAPagina(1)}
      disabled={paginaActual === 1}
      className={`p-2 rounded ${
        paginaActual === 1 
          ? 'text-gray-300 cursor-not-allowed' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      «
    </button>
    
    <button
      onClick={irAPaginaAnterior}
      disabled={paginaActual === 1}
      className={`p-2 rounded ${
        paginaActual === 1 
          ? 'text-gray-300 cursor-not-allowed' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      ‹
    </button>

    {/* Botones de página */}
    {[...Array(totalPaginas)].map((_, i) => (
      <button
        key={i + 1}
        onClick={() => irAPagina(i + 1)}
        className={`px-3 py-1 rounded ${
          paginaActual === i + 1
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={irAPaginaSiguiente}
      disabled={paginaActual === totalPaginas}
      className={`p-2 rounded ${
        paginaActual === totalPaginas
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      ›
    </button>
    
    <button
      onClick={() => irAPagina(totalPaginas)}
      disabled={paginaActual === totalPaginas}
      className={`p-2 rounded ${
        paginaActual === totalPaginas
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      »
    </button>
  </div>
</div>
        </div>
      </div>

      {/* Modal de Detalle de Venta */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Info size={24} />
                <h3 className="text-xl font-bold">
                  Detalle de Venta #{detalleVenta?.ID}
                </h3>
              </div>
              <button
                onClick={cerrarModal}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Cliente</p>
                  <p className="text-gray-800 font-semibold">{detalleVenta?.Cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fecha</p>
                  <p className="text-gray-800 font-semibold">{detalleVenta?.Fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Método de Pago</p>
                  <p className="text-gray-800 font-semibold">{detalleVenta?.["Método de Pago"]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                  <p className="text-gray-800 font-bold text-lg text-green-600">
                    {detalleVenta?.Total}
                  </p>
                </div>
                {detalleVenta?.Observaciones && detalleVenta.Observaciones !== "—" && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 font-medium">Observaciones</p>
                    <p className="text-gray-800">{detalleVenta.Observaciones}</p>
                  </div>
                )}
              </div>

              {/* Tabla de Productos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  Productos Vendidos
                </h4>
                
                {cargandoDetalle ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Cargando detalle...</p>
                  </div>
                ) : productos.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Precio Unit.
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {productos.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">
                                {item.producto?.nombre || "Producto eliminado"}
                              </p>
                              {item.producto?.descripcion && (
                                <p className="text-xs text-gray-500">
                                  {item.producto.descripcion}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
                              {item.cantidad}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-700">
                              S/. {(Number(item.precio_unitario) || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-800">
                              S/. {(Number(item.subtotal) || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay productos en esta venta.
                  </div>
                )}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={cerrarModal}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}