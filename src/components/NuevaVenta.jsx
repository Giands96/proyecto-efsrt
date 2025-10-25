import { useState, useEffect } from "react";
import { supabase } from "../backend/supabaseClient";

export default function NuevaVenta({ onClose, onVentaRegistrada }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);

  // --- Cargar datos ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: clientesData } = await supabase.from("cliente").select("*");
      const { data: productosData } = await supabase.from("producto").select("*");
      setClientes(clientesData || []);
      setProductos(productosData || []);
    };
    fetchData();
  }, []);

  // --- Filtros ---
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(filtroCliente.toLowerCase()) ||
      c.dni.includes(filtroCliente)
  );

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
  );

  // --- Agregar producto ---
  const agregarProducto = (producto) => {
    const existente = items.find((i) => i.id_producto === producto.id_producto);
    if (existente) {
      setItems(
        items.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      setItems([
        ...items,
        { ...producto, cantidad: 1, precio_unitario: producto.precio },
      ]);
    }
    setFiltroProducto("");
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    setItems(
      items.map((i) =>
        i.id_producto === id_producto
          ? { ...i, cantidad: Math.max(1, nuevaCantidad) }
          : i
      )
    );
  };

  const eliminarItem = (id_producto) =>
    setItems(items.filter((i) => i.id_producto !== id_producto));

  const totalVenta = items.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );

  // --- Guardar venta ---
  const registrarVenta = async () => {
    if (!clienteSeleccionado || items.length === 0) {
      alert("Selecciona un cliente y al menos un producto.");
      return;
    }

    setGuardando(true);

    const { data: venta, error: errorVenta } = await supabase
      .from("venta")
      .insert([
        {
          id_cliente: clienteSeleccionado.id_cliente,
          total: totalVenta,
          metodo_pago: metodoPago,
          observaciones,
        },
      ])
      .select()
      .single();

    if (errorVenta) {
      console.error("Error registrando venta:", errorVenta);
      setGuardando(false);
      return;
    }

    const detalles = items.map((item) => ({
      id_venta: venta.id_venta,
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
    }));

    const { error: errorDetalles } = await supabase
      .from("detalle_venta")
      .insert(detalles);

    if (errorDetalles) {
      console.error("Error registrando detalles:", errorDetalles);
    } else {
      alert("✅ Venta registrada correctamente");
      onVentaRegistrada();
    }

    setGuardando(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Registrar Nueva Venta</h2>

      {/* Cliente */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2"
        />
        {filtroCliente && (
          <ul className="border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto bg-white">
            {clientesFiltrados.map((c) => (
              <li
                key={c.id_cliente}
                onClick={() => {
                  setClienteSeleccionado(c);
                  setFiltroCliente("");
                }}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {c.nombre} — {c.dni}
              </li>
            ))}
          </ul>
        )}
        {clienteSeleccionado && (
          <div className="mt-2 text-sm text-green-600">
            Cliente seleccionado: <strong>{clienteSeleccionado.nombre}</strong>
          </div>
        )}
      </div>

      {/* Productos */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Productos</label>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2"
        />
        {filtroProducto && (
          <ul className="border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto bg-white">
            {productosFiltrados.map((p) => (
              <li
                key={p.id_producto}
                onClick={() => agregarProducto(p)}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {p.nombre} — S/. {p.precio}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Items seleccionados */}
      {items.length > 0 && (
        <table className="w-full text-sm border border-gray-200 rounded-lg mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-center">Cantidad</th>
              <th className="p-2 text-right">Precio</th>
              <th className="p-2 text-right">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id_producto}>
                <td className="p-2">{item.nombre}</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={item.cantidad}
                    min="1"
                    onChange={(e) =>
                      actualizarCantidad(item.id_producto, Number(e.target.value))
                    }
                    className="w-16 border rounded p-1 text-center"
                  />
                </td>
                <td className="p-2 text-right">S/. {item.precio_unitario}</td>
                <td className="p-2 text-right font-semibold">
                  S/. {(item.cantidad * item.precio_unitario).toFixed(2)}
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => eliminarItem(item.id_producto)}
                    className="text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="text-right font-semibold mb-4">
        Total: S/. {totalVenta.toFixed(2)}
      </div>

      <div className="flex flex-col gap-2">
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option>Efectivo</option>
          <option>Tarjeta</option>
          <option>Yape</option>
          <option>Transferencia</option>
        </select>

        <textarea
          placeholder="Observaciones..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
        <button
          onClick={registrarVenta}
          disabled={guardando}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {guardando ? "Guardando..." : "Registrar Venta"}
        </button>
      </div>
    </div>
  );
}
