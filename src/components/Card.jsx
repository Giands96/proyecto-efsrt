import { useEffect , useState } from 'react';

export const Card = ({Titulo, Icono, Monto }) => {

const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='w-[20rem] '>
        
        <div className='bg-white p-5 rounded-xl border-1 border-neutral-300 shadow-sm flex items-center justify-between gap-5 min-h-[10rem]'>
            <div className='text-3xl text-neutral-400'>
                {Icono}
            </div>
            <div className='flex flex-col '>
                <div className='text-md text-neutral-500'>
                    {Titulo}
                </div>
                <div className='text-2xl font-bold flex items-center gap-8'>
                    {Monto}
                    
                </div>
                
            </div>
            <div className=''>
                      {Loading ? <span className="loader"></span> : null}
            </div>
            
        </div>
    </div>
  )
}
