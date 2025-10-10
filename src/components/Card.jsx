import React from 'react'

export const Card = ({Titulo, Icono, Monto }) => {

    const formatMonto = (monto) => {
        if ( monto == null) return null 
        if (typeof monto === 'number') {
            return `S/. ${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)}`
        }

    
    }


  return (
    <div>
        <div className='bg-white p-5 rounded-lg shadow-md flex items-center gap-5'>
            <div className='text-3xl text-neutral-400'>
                {Icono}
            </div>
            <div>
                <div className='text-sm text-neutral-500'>
                    {Titulo}
                </div>
                <div className='text-2xl font-bold'>
                    {formatMonto(Monto)}
                </div>
            </div>
        </div>
    </div>
  )
}
