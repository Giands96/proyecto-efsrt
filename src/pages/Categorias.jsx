import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Nombre", "Descripción"];

const dataEjemplo = [
  { id: 1, nombre: "Procesadores", descripcion: "CPUs de distintas marcas" },
  { id: 2, nombre: "Tarjetas Gráficas", descripcion: "GPUs NVIDIA y AMD" },
];

export default function Categorias() {
  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <DataTable title="Categorías" columns={columns} data={dataEjemplo} />
    </div>
  );
}
