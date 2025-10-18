import React, { useState, useEffect } from 'react';
import { PdfDocument } from '../components/PdfDocument';
import { Navbar } from '../components/Navbar';
import { supabase } from '../backend/supabaseClient'; // o tu cliente API

const Reportes = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [datosReporte, setDatosReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para traer datos desde la API según el tipo de reporte
  const fetchReporte = async (tipo) => {
    setLoading(true);
    let titulo = '';
    let columnas = [];
    let filas = [];

    try {
      switch (tipo) {
        case 'ventas': {
          titulo = 'Reporte de Ventas';
          columnas = ['ID', 'Cliente', 'Fecha', 'Total', 'Método de Pago'];

          const { data, error } = await supabase
            .from('venta')
            .select(`id_venta, cliente(nombre), fecha, total, metodo_pago`);

          if (error) throw error;

          filas = data.map((v) => [
            v.id_venta,
            v.cliente?.nombre || '—',
            v.fecha,
            `S/. ${v.total.toFixed(2)}`,
            v.metodo_pago,
          ]);
          break;
        }

        case 'productos': {
          titulo = 'Reporte de Productos';
          columnas = ['ID', 'Nombre', 'Categoría', 'Stock', 'Precio'];

          const { data, error } = await supabase
            .from('producto')
            .select(`id_producto, nombre, categoria(nombre), stock, precio`);

          if (error) throw error;

          filas = data.map((p) => [
            p.id_producto,
            p.nombre,
            p.categoria?.nombre || '—',
            p.stock,
            `S/. ${p.precio.toFixed(2)}`,
          ]);
          break;
        }

        case 'clientes': {
          titulo = 'Reporte de Clientes';
          columnas = ['ID', 'Nombre', 'DNI', 'Teléfono', 'Correo'];

          const { data, error } = await supabase
            .from('cliente')
            .select('id_cliente, nombre,dni, telefono,correo');

          if (error) throw error;

          filas = data.map((c) => [
            c.id_cliente,
            c.nombre,
            c.dni,
            c.telefono,
            c.correo,
            
          ]);
          break;
        }

        default:
          throw new Error('Tipo de reporte no válido');
      }

      // Guardamos los datos listos para el PDF
      setDatosReporte({ titulo, columnas, filas });
    } catch (err) {
      console.error('Error al obtener reporte:', err.message);
      setDatosReporte(null);
    } finally {
      setLoading(false);
    }
  };

  //  Cuando cambia el tipo de reporte, se hace la llamada a la API
  useEffect(() => {
    if (reporteSeleccionado) {
      fetchReporte(reporteSeleccionado);
    }
  }, [reporteSeleccionado]);

  return (
    <div className="">
      <Navbar />
      <div className='container mx-auto py-4'>
        <h1 className="text-2xl font-bold mb-6">Generación de Reportes</h1>

      {/* Selector de tipo de reporte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['ventas', 'productos', 'clientes'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setReporteSeleccionado(tipo)}
            className={`p-4 rounded-lg border ${
              reporteSeleccionado === tipo
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            Reporte de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>
      </div>
      

      {/* Estado de carga */}
      {loading && <p className="text-gray-500">Cargando datos...</p>}

      {/* Visualización del reporte */}
      {!loading && datosReporte && (
        <PdfDocument
          tipo={reporteSeleccionado}
          titulo={datosReporte.titulo}
          columnas={datosReporte.columnas}
          filas={datosReporte.filas}
        />
      )}
    </div>
  );
};

export default Reportes;
