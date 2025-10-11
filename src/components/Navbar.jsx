import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='min-h-[80px] bg-white flex justify-between px-10 items-center'>
        <span className='text-2xl font-semibold'>Sistema de Ventas</span>
        <div>
          <ul className='flex gap-5 font-semibold'>
            <li className="  rounded-xl transition-colors">
              <Link to="/dashboard" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '>
                Dashboard
              </Link>
            </li>
            <li className=" ">
              <Link to="/productos" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white ' >
                Productos
              </Link>
            </li>
            <li className=" rounded-xl transition-colors ">
              <Link to="/clientes" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '>
                Clientes
              </Link>
            </li>
            <li className="   rounded-xl transition-colors">
              <Link to="/categorias" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '>
                Categorias
              </Link>
            </li>
            <li className="  rounded-xl transition-colors">
              <Link to="/ventas" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '>
                Ventas
              </Link>
            </li>
            <li className="   rounded-xl transition-colors">
              <Link to="/reportes" className='hover:bg-neutral-900 px-4 py-1 rounded-xl transition-colors hover:text-white '>
                Reportes
              </Link>
            </li>
            
          </ul>
        </div>
    </div>
  )
}
