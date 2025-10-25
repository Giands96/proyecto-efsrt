import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";
import {useState, useEffect} from "react"
import { supabase } from "../backend/supabaseClient";

const columns = ["ID", "Nombre", "Descripcion"];

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from("categoria")
        .select("id_categoria,nombre,descripcion")
        .order("id_categoria", { ascending: true });
      if (error) console.error("Error cargando categorias:", error);
      else setCategorias(data);
    };
    fetchCategorias();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar />
      <DataTable title="Categorías" columns={columns} data={categorias} />
    </div>
  );
}
