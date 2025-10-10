import React from 'react'
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { FiDollarSign } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div>
      <Navbar/>
      <div className='p-10'>
        <Card Icono={FiDollarSign} Titulo={"Ventas Totales"} Monto={5000} />
        <div>Clientes</div>
        <div>Productos</div>
        <div>Generar Reporte</div>
      </div>

    </div>
  )
}
export default Dashboard;