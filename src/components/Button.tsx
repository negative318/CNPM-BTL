import { useCallback } from 'react'

export const Button = () => {
    const onClick = useCallback(() =>{
        console.log("Vite + React + TypeScript + TailwindCSS = :3");
    }, []);
  return (
    <button onClick= {onClick} className='px-2 py-4 font-bold text-white bg-blue-500 hover:bg-blue-600'>aaaaaaaaaaaaaaa</button>
  )
}
