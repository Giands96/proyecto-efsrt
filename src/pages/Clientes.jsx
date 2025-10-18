import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient";
import DataTable from "../components/DataTable";
import { Navbar } from "../components/Navbar";

const columns = ["ID", "Nombre", "DNI", "Teléfono", "Correo", "Estado", "Acciones"];

export default function Clientes() {



  const [clientes, setClientes] = useState([]);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteAAñadir, setClienteAAñadir] = useState(null);

  

  //  Obtener clientes
  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from("cliente")
      .select("id_cliente, nombre, dni, telefono, correo, estado")
      .order("id_cliente", { ascending: true });

    if (error) {
      console.error("Error al cargar clientes:", error);
    } else {
      const formateados = data.map((c) => ({
        id_cliente: c.id_cliente,
        id: c.id_cliente,
        nombre: c.nombre,
        dni: c.dni,
        teléfono: c.telefono, 
        telefono: c.telefono, 
        correo: c.correo,
        estado: c.estado ? "Activo" : "Desactivado",
        estadoBoolean: c.estado 
      }));
      setClientes(formateados);
    }
  };

  const añadirCliente = async (cliente) =>{
    const { error } = await supabase.from("cliente").insert({
      nombre: cliente.nombre,
      dni: cliente.dni,
      telefono: cliente.telefono,
      correo: cliente.correo,
      estado: true,
    })

    if(error){
      console.error("Error al añadir cliente", error);
    }
    else {
      await fetchClientes()
      setClienteAAñadir(null);
    }
  }

  //  Editar cliente
  const editarCliente = async (cliente) => {
    const estadoBoolean = cliente.estado === "Activo" || cliente.estadoBoolean === true;
    
    const { error } = await supabase
      .from("cliente")
      .update({
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        correo: cliente.correo,
        estado: estadoBoolean,
      })
      .eq("id_cliente", cliente.id_cliente);

    if (error) {
      console.error("Error al editar cliente:", error);
    } else {
      await fetchClientes();
      setClienteAEditar(null);
    }
  };

  //  Desactivar cliente
  const eliminarCliente = async (id) => {
    const { error } = await supabase
      .from("cliente")
      .update({ estado: false })
      .eq("id_cliente", id);

    if (error) {
      console.error("Error al eliminar cliente:", error);
    } else {
      await fetchClientes();
      setClienteAEliminar(null);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-8">
        <div className="bg-white w-full h-24 rounded-xl flex items-center px-10">
          <button onClick={() => setClienteAAñadir ({nombre:"", dni: "", telefono:"", correo: "",estado:true})}
            className="bg-white px-4 py-2 rounded-lg border border-neutral-400 text-md shadow-sm hover:shadow-lg transition-all font-semibold cursor-pointer"
          >
            Agregar Cliente
          </button>
        </div>

        <DataTable
          title="Clientes"
          columns={columns}
          data={clientes}
          eliminar={(row) => setClienteAEliminar(row)}
          editar={(row) => setClienteAEditar(row)}
        />
      </div>

      {/* Modal editar */}
      {clienteAEditar && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Editar Cliente
            </h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={clienteAEditar.nombre || ""}
                  onChange={(e) =>
                    setClienteAEditar({
                      ...clienteAEditar,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">DNI</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={clienteAEditar.dni || ""}
                  onChange={(e) =>
                    setClienteAEditar({
                      ...clienteAEditar,
                      dni: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={clienteAEditar.telefono || clienteAEditar.teléfono || ""}
                  onChange={(e) =>
                    setClienteAEditar({
                      ...clienteAEditar,
                      telefono: e.target.value,
                      teléfono: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Correo</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={clienteAEditar.correo || ""}
                  onChange={(e) =>
                    setClienteAEditar({
                      ...clienteAEditar,
                      correo: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Estado</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={clienteAEditar.estado || "Desactivado"}
                  onChange={(e) =>
                    setClienteAEditar({
                      ...clienteAEditar,
                      estado: e.target.value,
                      estadoBoolean: e.target.value === "Activo"
                    })
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Desactivado">Desactivado</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClienteAEditar(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await editarCliente(clienteAEditar);
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

      {/* Modal eliminar */}
      {clienteAEliminar && (
        <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              ¿Desactivar cliente?
            </h2>
            <p className="text-gray-600 mb-6">{clienteAEliminar.nombre}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => eliminarCliente(clienteAEliminar.id_cliente)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Confirmar
              </button>
              <button
                onClick={() => setClienteAEliminar(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Añadir*/ }
      {
        clienteAAñadir && (
          <div className="bg-black/50  fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <h2>Crear Nuevo Cliente</h2>
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="text-gray-600 mb-1">Nombre</label>
                  <input required type="text" name="name" className="w-full border rounded px-3 py-2" value={clienteAAñadir.nombre || ""}
                  onChange={(e) => {
                    setClienteAAñadir({
                      ...clienteAAñadir,
                      nombre: e.target.value,
                    })
                  }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dni" className="text-gray-600 mb-1">DNI</label>
                  <input maxLength={8} inputMode="numeric" name="dni" className="w-full border rounded px-3 py-2" value={clienteAAñadir.dni || ""}
                  onChange={(e) => {
                    setClienteAAñadir({
                      ...clienteAAñadir,
                      dni: e.target.value,
                    })
                  }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="text-gray-600 mb-1">Telefono</label>
                  <input maxLength={9} inputMode="numeric" name="phone" className="w-full border rounded px-3 py-2" value={clienteAAñadir.telefono || ""}
                  onChange={(e) => {
                    setClienteAAñadir({
                      ...clienteAAñadir,
                      telefono: e.target.value,
                    })
                  }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="correo" className="text-gray-600 mb-1">Correo electronico</label>
                  <input type="email" name="correo" className="w-full border rounded px-3 py-2" value={clienteAAñadir.correo || ""}
                  onChange={(e) => {
                    setClienteAAñadir({
                      ...clienteAAñadir,
                      correo: e.target.value,
                    })
                  }}
                  />
                </div>
                {/*BOTONES DE CERRAR Y GUARDAL MODAL*/ }
               <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClienteAAñadir(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await añadirCliente(clienteAAñadir);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                >
                  Agregar
                </button>
              </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}