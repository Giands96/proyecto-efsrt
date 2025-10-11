import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Nombre", "DNI", "Teléfono", "Correo"];

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("cliente")
        .select("id_cliente, nombre, dni, telefono, correo")
        .order("id_cliente", { ascending: true });

      if (error) console.error("Error cargando clientes:", error);
      else setClientes(data);
    };

    fetchClientes();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <div className="p-8">
        <DataTable title="Clientes" columns={columns} data={clientes} />
      </div>
      
    </div>
  );
}
