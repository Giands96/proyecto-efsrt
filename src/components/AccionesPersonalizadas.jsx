const AccionesPersonalizadas = ({ row }) => (
  <div className="flex gap-2">
    {/* Ver detalle */}
    <button
      onClick={() => verDetalleVenta(row)}
      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition cursor-pointer"
      title="Ver Detalle"
    >
      <Eye size={16} className="text-blue-600" />
    </button>

    
  </div>
);
