import { createRoot } from 'react-dom/client'
import './index.css'
import AuthRoutes from './routes/AuthRoutes'


createRoot(document.getElementById('root')).render(
  <AuthRoutes />
)
