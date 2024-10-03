import useRouteElements from "./useRouterElement"



export default function App() {

  const rootElement = useRouteElements()

  return (
    <div className="px-5 py-5 text-black">
      {rootElement}
    </div>
  )
}

