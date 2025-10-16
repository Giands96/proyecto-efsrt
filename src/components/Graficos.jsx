import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export const Graficos = ({ data }) => {
  // Si no hay datos, muestra mensaje
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Cargando datos...
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] bg-white  rounded-2xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          {/* Degradado suave para el área */}
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>

          {/* Líneas de cuadrícula */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Ejes */}
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />

          {/* Tooltip personalizado */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#6B7280' }}
            formatter={(value) => [`S/. ${value.toFixed(2)}`, 'Ventas']}
          />

          {/* Línea y área con degradado */}
          <Area
            type="monotone"
            dataKey="ventas"
            stroke="#6366F1"
            fill="url(#colorVentas)"
            strokeWidth={3}
            animationDuration={1200}
            dot={{ r: 4, fill: '#6366F1' }}
            activeDot={{ r: 6, fill: '#4F46E5' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
