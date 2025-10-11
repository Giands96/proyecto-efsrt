import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Cliente", "Fecha", "Total", "Método", "Observaciones"];

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

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
          id_venta: v.id_venta,
          cliente: v.cliente?.nombre || "—",
          fecha: new Date(v.fecha).toLocaleDateString("es-PE"),
          total: `S/. ${v.total.toFixed(2)}`,
          metodo_pago: v.metodo_pago,
          observaciones: v.observaciones || "",
        }));
        setVentas(formateadas);
      }
    };

    fetchVentas();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <div className="p-8">
        <DataTable title="Ventas" columns={columns} data={ventas} />
      </div>
      
    </div>
  );
}
