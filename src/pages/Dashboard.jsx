import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Card } from '../components/Card'
import { Loader } from 'rsuite';
import { createClient } from '@supabase/supabase-js'
import { Graficos } from "../components/Graficos"

const supabase = createClient(
  "https://lhluvsgwylxmmfzfdojd.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY
)

const Dashboard = () => {
  const [Loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState({
    totalVentas: 0,
    totalClientes: 0,
    totalProductos: 0,
    ventasMes: 0,
  })

  const iconoVentas = (
    <svg
      width="33"
      height="32"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.25 12C2.25 6.47715 6.72715 2 12.25 2C17.7728 2 22.25 6.47715 22.25 12C22.25 17.5228 17.7728 22 12.25 22C6.72715 22 2.25 17.5228 2.25 12ZM13 7.375C13 6.96079 12.6642 6.625 12.25 6.625C11.8358 6.625 11.5 6.96079 11.5 7.375V7.845C10.498 8.07236 9.75 8.96845 9.75 10.0392V10.3043C9.75 11.2422 10.3318 12.0817 11.2099 12.411L12.7634 12.9936C13.0561 13.1034 13.25 13.3832 13.25 13.6959V13.9609C13.25 14.3752 12.9142 14.7109 12.5 14.7109H11.8126C11.5019 14.7109 11.25 14.4591 11.25 14.1483C11.25 13.7341 10.9142 13.3983 10.5 13.3983C10.0858 13.3983 9.75 13.7341 9.75 14.1483C9.75 15.1812 10.5092 16.0368 11.5 16.1874V16.625C11.5 17.0392 11.8358 17.375 12.25 17.375C12.6642 17.375 13 17.0392 13 16.625V16.1552C14.002 15.9278 14.75 15.0317 14.75 13.9609V13.6959C14.75 12.758 14.1682 11.9185 13.2901 11.5891L11.7366 11.0066C11.4439 10.8968 11.25 10.6169 11.25 10.3043V10.0392C11.25 9.62503 11.5858 9.28924 12 9.28924H12.6874C12.9981 9.28924 13.25 9.54113 13.25 9.85184C13.25 10.2661 13.5858 10.6018 14 10.6018C14.4142 10.6018 14.75 10.2661 14.75 9.85184C14.75 8.81897 13.9908 7.96341 13 7.81278V7.375Z"
        fill="#323544"
      />
    </svg>
  )

  const iconoProductos = (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.31641 3.25C1.90219 3.25 1.56641 3.58579 1.56641 4C1.56641 4.41421 1.90219 4.75 2.31641 4.75H3.49696C3.87082 4.75 4.18759 5.02534 4.23965 5.39556L5.49371 14.3133C5.6499 15.424 6.60021 16.25 7.72179 16.25L18.0664 16.25C18.4806 16.25 18.8164 15.9142 18.8164 15.5C18.8164 15.0858 18.4806 14.75 18.0664 14.75L7.72179 14.75C7.34793 14.75 7.03116 14.4747 6.9791 14.1044L6.85901 13.2505H17.7114C18.6969 13.2505 19.5678 12.6091 19.8601 11.668L21.7824 5.48032C21.8531 5.25268 21.8114 5.00499 21.6701 4.81305C21.5287 4.62112 21.3045 4.50781 21.0662 4.50781H5.51677C5.14728 3.75572 4.37455 3.25 3.49696 3.25H2.31641ZM5.84051 6.00781L6.64807 11.7505H17.7114C18.0399 11.7505 18.3302 11.5367 18.4277 11.223L20.0478 6.00781H5.84051Z" fill="#323544"/>
<path d="M7.78418 17.75C6.81768 17.75 6.03418 18.5335 6.03418 19.5C6.03418 20.4665 6.81768 21.25 7.78418 21.25C8.75068 21.25 9.53428 20.4665 9.53428 19.5C9.53428 18.5335 8.75068 17.75 7.78418 17.75Z" fill="#323544"/>
<path d="M14.5703 19.5C14.5703 18.5335 15.3538 17.75 16.3203 17.75C17.2868 17.75 18.0704 18.5335 18.0704 19.5C18.0704 20.4665 17.2869 21.25 16.3204 21.25C15.3539 21.25 14.5703 20.4665 14.5703 19.5Z" fill="#323544"/>
</svg>

  )

  const iconoClientes = (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0672 2C9.6678 2 7.72266 3.94514 7.72266 6.34459C7.72266 8.74404 9.6678 10.6892 12.0672 10.6892C14.4667 10.6892 16.4118 8.74404 16.4118 6.34459C16.4118 3.94514 14.4667 2 12.0672 2Z" fill="#323544"/>
<path d="M20.25 19.453C20.2421 19.8615 19.9087 20.1895 19.5001 20.1895H4.50013C4.09157 20.1895 3.75818 19.8624 3.75027 19.454L3.75023 19.452L3.75019 19.4493L3.7501 19.4423L3.75 19.4211C3.74999 19.404 3.75015 19.3807 3.75072 19.3516C3.75187 19.2937 3.75468 19.2127 3.76117 19.1119C3.77413 18.9107 3.80189 18.6292 3.86099 18.2937C3.97867 17.6258 4.22374 16.7262 4.73808 15.8194C5.79641 13.9537 7.92408 12.1895 12.0001 12.1895C16.0762 12.1895 18.2038 13.9537 19.2622 15.8194C19.7765 16.7262 20.0216 17.6258 20.1393 18.2937C20.1984 18.6292 20.2261 18.9107 20.2391 19.1119C20.2456 19.2127 20.2484 19.2937 20.2495 19.3516C20.2501 19.3807 20.2503 19.404 20.2503 19.4211L20.2502 19.4423L20.2501 19.4493L20.25 19.452L20.25 19.453Z" fill="#323544"/>
</svg>

  )

 const [ventasMensuales, setVentasMensuales] = useState([])
  useEffect(() => {
    const fetchResumen = async () => {
      try {
      
        const { data: ventasData, error: ventasError2 } = await supabase
          .from("venta")
          .select("total, fecha")

        if (ventasError2) throw ventasError

        const resumenMensual = {}
        ventasData.forEach((venta) => {
          const mes = new Date(venta.fecha).toLocaleString("es-ES", { month: "long" })
          resumenMensual[mes] = (resumenMensual[mes] || 0) + venta.total
        })

        const ventasResultado = Object.entries(resumenMensual).map(([mes, ventas]) => ({
          name: mes.charAt(0).toUpperCase() + mes.slice(1),
          ventas,
        }))
        setVentasMensuales(ventasResultado)

        const { data: ventas, error: ventasError } = await supabase
          .from('venta')
          .select('total')

        if (ventasError) throw ventasError
        const totalVentas = ventas.reduce((acc, v) => acc + (v.total || 0), 0)

        
        const { count: totalClientes, error: clientesError } = await supabase
          .from('cliente')
          .select('*', { count: 'exact', head: true })
        if (clientesError) throw clientesError

        
        const { count: totalProductos, error: productosError } = await supabase
          .from('producto')
          .select('*', { count: 'exact', head: true })
        if (productosError) throw productosError

        
        const mesActual = new Date().getMonth() + 1
        const anioActual = new Date().getFullYear()
        const { count: ventasMes, error: ventasMesError } = await supabase
          .from('venta')
          .select('*', { count: 'exact', head: true })
          .gte('fecha', `${anioActual}-${mesActual}-01`)
          .lte('fecha', `${anioActual}-${mesActual}-31`)
        if (ventasMesError) throw ventasMesError

        setResumen({
          totalVentas,
          totalClientes,
          totalProductos,
          ventasMes,
        })
      } catch (error) {
        console.error('Error cargando resumen:', error)
      }
    }

    fetchResumen()
    
  }, [])

  return (
    <div>
      <Navbar />
      <div className="p-10 container mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card
            Icono={iconoVentas}
            Titulo={'Ventas Totales'}
            Monto={`S/. ${resumen.totalVentas.toFixed(2)}`}
          />
          <Card
            Icono={iconoClientes}
            Titulo={'Clientes'}
            Monto={resumen.totalClientes}
          />
          <Card
            Icono={iconoProductos}
            Titulo={'Productos'}
            Monto={resumen.totalProductos}
          />
          <Card
            Icono={iconoVentas}
            Titulo={'Ventas del Mes'}
            Monto={resumen.ventasMes}
          />
        </div>
      </div>
      <div className='px-10  container mx-auto'>
        <h2 className='text-xl font-semibold my-4'>Graficos de Ventas</h2>
        <div className='bg-neutral-50 border-1 rounded-xl border-neutral-400  p-5'>
          <Graficos data={ventasMensuales}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
