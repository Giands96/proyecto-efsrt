import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  const [isActive, setIsActive] = useState(false)

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-neutral-900 text-white px-4 py-1 rounded-xl transition-colors'
      : 'hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '

  return (
    <div className='min-h-[80px] bg-gray-100 flex justify-between px-10 items-center'>
      <span className='text-2xl font-semibold'>Sistema de Ventas</span>
      <nav>
        <ul className='flex gap-5 font-semibold'>
          <li className="rounded-xl transition-colors">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={navLinkClass}>
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/clientes" className={navLinkClass}>
              Clientes
            </NavLink>
          </li>
          <li>
            <NavLink to="/categorias" className={navLinkClass}>
              Categorias
            </NavLink>
          </li>
          <li>
            <NavLink to="/ventas" className={navLinkClass}>
              Ventas
            </NavLink>
          </li>
          <li>
            <NavLink to="/reportes" className={navLinkClass}>
              Reportes
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
