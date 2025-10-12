import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Nombre", "DNI", "Teléfono", "Correo", "Acciones"];

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  // 🔹 Eliminar cliente
  const eliminarCliente = async (id) => {
    const { error } = await supabase.from("cliente").delete().eq("id_cliente", id);
    if (error) {
      console.error("Error eliminando cliente:", error);
    } else {
      setClientes((prev) => prev.filter((c) => c.id_cliente !== id));
    }
  };

  // 🔹 Editar cliente
  const editarCliente = async (cliente) => {
    const { error } = await supabase
      .from("cliente")
      .update({
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        correo: cliente.correo,
      })
      .eq("id_cliente", cliente.id_cliente);

    if (error) {
      console.error("Error editando cliente:", error);
    } else {
      setClientes((prev) =>
        prev.map((c) => (c.id_cliente === cliente.id_cliente ? cliente : c))
      );
      setClienteAEditar(null);
    }
  };

  // 🔹 Obtener clientes al montar
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-8">
        <div className="bg-white w-full h-24 rounded-xl flex items-center px-10">
          <button className="bg-white px-4 py-2 rounded-lg border border-neutral-400 text-md shadow-sm hover:shadow-lg transition-all font-semibold hover:cursor-pointer">
            <span>Agregar Cliente</span>
          </button>
        </div>

        {/* 🔹 Pasamos funciones que abren los modales */}
        <DataTable
          title="Clientes"
          columns={columns}
          data={clientes}
          eliminar={(id) => {
            const cliente = clientes.find((c) => c.id_cliente === id);
            setClienteAEliminar(cliente);
          }}
          editar={(cliente) => {
            setClienteAEditar(cliente);
          }}
        />
      </div>

      {/* 🔹 Modal Editar Cliente */}
      {clienteAEditar && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 w-96">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Editar Cliente</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await editarCliente(clienteAEditar);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={clienteAEditar.nombre}
                    onChange={(e) =>
                      setClienteAEditar({ ...clienteAEditar, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1">DNI</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={clienteAEditar.dni}
                    onChange={(e) =>
                      setClienteAEditar({ ...clienteAEditar, dni: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={clienteAEditar.telefono}
                    onChange={(e) =>
                      setClienteAEditar({ ...clienteAEditar, telefono: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-1">Correo</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={clienteAEditar.correo}
                    onChange={(e) =>
                      setClienteAEditar({ ...clienteAEditar, correo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-300 text-gray-700"
                    onClick={() => setClienteAEditar(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal Confirmar Eliminación */}
      {clienteAEliminar && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 w-96">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Eliminar Cliente</h2>
              <p className="mb-6 text-gray-600">
                ¿Estás seguro que deseas eliminar al cliente{" "}
                <span className="font-bold">{clienteAEliminar.nombre}</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 text-gray-700"
                  onClick={() => setClienteAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white"
                  onClick={async () => {
                    await eliminarCliente(clienteAEliminar.id_cliente);
                    setClienteAEliminar(null);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
