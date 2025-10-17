import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Nombre", "Precio", "Stock", "Categoría", "Estado", "Acciones"];

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoAñadir, setProductoAñadir] = useState(null);

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("categoria")
      .select("id_categoria, nombre")
      .order("nombre", { ascending: true });
    if (!error) setCategorias(data || []);
  };

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("producto")
      .select(`
        id_producto,
        nombre,
        precio,
        stock,
        estado,
        id_categoria,
        categoria (
          id_categoria,
          nombre
        )
      `)
      .order("id_producto", { ascending: true });

    if (error) {
      console.error("Error al obtener productos:", error);
      return;
    }

    setProductos(
      (data || []).map((p) => {
        const categoriaNombre = p.categoria?.nombre || "Sin categoría";

        return {
          id_producto: p.id_producto,
          id: p.id_producto,
          nombre: p.nombre,
          precio: `S/. ${parseFloat(p.precio).toFixed(2)}`,
          precioNumerico: parseFloat(p.precio),
          stock: p.stock,
          categoría: categoriaNombre,
          categoria: categoriaNombre,
          id_categoria: p.id_categoria,
          estado: p.estado ? "Disponible" : "No disponible",
          estadoBoolean: p.estado
        };
      })
    );
  };

  const añadirProducto = async (producto) => {
    const precioNum = parseFloat(producto.precio);
    
    const { error } = await supabase.from("producto").insert({
      nombre: producto.nombre,
      precio: isNaN(precioNum) ? null : precioNum,
      stock: parseInt(producto.stock),
      id_categoria: producto.id_categoria,
      estado: true,
    });
    
    if (error) {
      console.error("Error al añadir producto:", error);
    } else {
      await fetchProductos();
      setProductoAñadir(null);
    }
  };

  const editarProducto = async (producto) => {
    const precioNum = producto.precioNumerico || parseFloat(String(producto.precio).replace("S/. ", ""));
    const estadoBoolean = producto.estado === "Disponible" || producto.estadoBoolean === true;
    
    const { error } = await supabase
      .from("producto")
      .update({
        nombre: producto.nombre,
        precio: isNaN(precioNum) ? null : precioNum,
        stock: parseInt(producto.stock),
        id_categoria: producto.id_categoria,
        estado: estadoBoolean,
      })
      .eq("id_producto", producto.id_producto);

    if (error) {
      console.error("Error al editar producto:", error);
    } else {
      await fetchProductos();
      setProductoAEditar(null);
    }
  };

  const deshabilitarProducto = async (id) => {
    const { error } = await supabase
      .from("producto")
      .update({ estado: false })
      .eq("id_producto", id);
    
    if (error) {
      console.error("Error al deshabilitar producto:", error);
    } else {
      await fetchProductos();
      setProductoAEliminar(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCategorias();
      await fetchProductos();
    };
    load();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-8">
        <div className="bg-white w-full h-24 rounded-xl flex items-center px-10">
          <button 
            onClick={() => setProductoAñadir({ nombre: "", precio: "", stock: "", id_categoria: "", estado: true })}
            className="bg-white px-4 py-2 rounded-lg border border-neutral-400 text-md shadow-sm hover:shadow-lg transition-all font-semibold cursor-pointer"
          >
            Agregar Producto
          </button>
        </div>

        <DataTable
          title="Productos"
          columns={columns}
          data={productos}
          eliminar={(row) => setProductoAEliminar(row)}
          editar={(row) => setProductoAEditar(row)}
        />
      </div>

      {/* Modal añadir */}
      {productoAñadir && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Agregar Producto</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={productoAñadir.nombre || ""}
                  onChange={(e) =>
                    setProductoAñadir({
                      ...productoAñadir,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded px-3 py-2"
                  value={productoAñadir.precio || ""}
                  onChange={(e) =>
                    setProductoAñadir({
                      ...productoAñadir,
                      precio: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={productoAñadir.stock || ""}
                  onChange={(e) =>
                    setProductoAñadir({
                      ...productoAñadir,
                      stock: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Categoría</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={productoAñadir.id_categoria || ""}
                  onChange={(e) =>
                    setProductoAñadir({
                      ...productoAñadir,
                      id_categoria: e.target.value ? parseInt(e.target.value, 10) : null,
                    })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductoAñadir(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await añadirProducto(productoAñadir);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {productoAEditar && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Editar Producto</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={productoAEditar.nombre || ""}
                  onChange={(e) =>
                    setProductoAEditar({
                      ...productoAEditar,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded px-3 py-2"
                  value={productoAEditar.precioNumerico || String(productoAEditar.precio || "").replace("S/. ", "")}
                  onChange={(e) =>
                    setProductoAEditar({
                      ...productoAEditar,
                      precioNumerico: parseFloat(e.target.value),
                      precio: `S/. ${parseFloat(e.target.value).toFixed(2)}`
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={productoAEditar.stock || ""}
                  onChange={(e) =>
                    setProductoAEditar({
                      ...productoAEditar,
                      stock: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Categoría</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={productoAEditar.id_categoria || ""}
                  onChange={(e) =>
                    setProductoAEditar({
                      ...productoAEditar,
                      id_categoria: e.target.value ? parseInt(e.target.value, 10) : null,
                    })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Estado</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={productoAEditar.estado || "No disponible"}
                  onChange={(e) =>
                    setProductoAEditar({ 
                      ...productoAEditar, 
                      estado: e.target.value,
                      estadoBoolean: e.target.value === "Disponible"
                    })
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="No disponible">No disponible</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductoAEditar(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await editarProducto(productoAEditar);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal deshabilitar */}
      {productoAEliminar && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              ¿Deshabilitar este producto?
            </h2>
            <p className="text-gray-500 mb-6">{productoAEliminar.nombre}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deshabilitarProducto(productoAEliminar.id_producto)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Confirmar
              </button>
              <button
                onClick={() => setProductoAEliminar(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}