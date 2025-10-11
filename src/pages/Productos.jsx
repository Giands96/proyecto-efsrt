import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import { Navbar } from "../components/Navbar";
import DataTable from "../components/DataTable";

const columns = ["ID", "Nombre", "Precio", "Stock", "Categoría"];

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("producto")
        .select(`
          id_producto,
          nombre,
          precio,
          stock,
          categoria (nombre)
        `)
        .order("id_producto", { ascending: true });

      if (error) console.error("Error cargando productos:", error);
      else {
        const productosFormateados = data.map((p) => ({
          id_producto: p.id_producto,
          nombre: p.nombre,
          precio: `S/. ${p.precio.toFixed(2)}`,
          stock: p.stock,
          categoria: p.categoria?.nombre || "—",
        }));
        setProductos(productosFormateados);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <DataTable title="Productos" columns={columns} data={productos} />
    </div>
  );
}
