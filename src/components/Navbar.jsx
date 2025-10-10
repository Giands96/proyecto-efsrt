import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='min-h-[80px] bg-white flex justify-between px-10 items-center'>
        <span>Sistema de Ventas</span>
        <div>
          <ul className='flex gap-5 font-semibold'>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/productos">
                Productos
              </Link>
            </li>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/clientes">
                Clientes
              </Link>
            </li>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/categorias">
                Categorias
              </Link>
            </li>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/ventas">
                Ventas
              </Link>
            </li>
            <li className="hover:bg-neutral-900 hover:text-white px-4 py-1 rounded-xl transition-colors">
              <Link to="/reportes">
                Reportes
              </Link>
            </li>
            
          </ul>
        </div>
    </div>
  )
}
