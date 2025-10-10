import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Categorias from './pages/Categorias'
import Reportes from './pages/Reportes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
  {
    path: "/clientes",
    element: <Clientes/>,
  },
  {
    path: "/productos",
    element: <Productos/>,
  },
  {
    path: "/ventas",
    element: <Ventas/>,
  },
  {
    path: "/categorias",
    element: <Categorias/>,
  },
  {
    path: "/reportes",
    element: <Reportes/>,
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {router}/>
  </StrictMode>,
)
