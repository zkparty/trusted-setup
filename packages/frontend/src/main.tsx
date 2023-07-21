import './index.css'
import ReactDOM from 'react-dom/client'
import router from './router/router.tsx'
import { RouterProvider } from 'react-router-dom'
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TooltipProvider delayDuration={0}>
    <RouterProvider router={router} />
  </TooltipProvider>
)
