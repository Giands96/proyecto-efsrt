import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import { Navbar } from "../components/Navbar";
import DataTable from "../components/DataTable";

const columns = ["ID", "Nombre", "Precio", "Stock", "Categoría", "Acciones"];

export default function Productos() {
  const [productos, setProductos] = useState([]);

  // 🔄 Deshabilitar producto (actualiza estado a false)
  const deshabilitarProducto = async (id) => {
    const { error } = await supabase
      .from("producto")
      .update({ estado: false })
      .eq("id_producto", id);

    if (error) {
      console.error("Error deshabilitando producto:", error);
    } else {
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === id ? { ...p, estado: false } : p
        )
      );
    }
  };

  // 🔁 Cargar productos al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("producto")
        .select(`
          id_producto,
          nombre,
          precio,
          stock,
          estado,
          categoria (
            id_categoria,
            nombre
          )
        `)
        .order("id_producto", { ascending: true });

      if (error) {
        console.error("Error al obtener productos:", error);
      } else {
        const productosFormateados = data.map((p) => ({
          id_producto: p.id_producto,
          nombre: p.nombre,
          precio: `S/. ${parseFloat(p.precio).toFixed(2)}`,
          stock: p.stock,
          categoria: p.categoria?.nombre || "—",
          estado: p.estado,
        }));
        setProductos(productosFormateados);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Lista de Productos</h1>

        <DataTable
          title="Productos"
          columns={columns}
          data={productos.map((p) => [
            p.id_producto,
            p.nombre,
            p.precio,
            p.stock,
            p.categoria,
            <div key={p.id_producto} className="flex gap-2">
              <button
                onClick={() => deshabilitarProducto(p.id_producto)}
                disabled={!p.estado}
                className={`px-3 py-1 rounded ${
                  p.estado
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {p.estado ? "Deshabilitar" : "Inactivo"}
              </button>
            </div>,
          ])}
        />
      </div>
    </div>
  );
}
