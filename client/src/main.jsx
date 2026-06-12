import { createRoot } from 'react-dom/client'
import './index.css'
import AuthRoutes from './routes/AuthRoutes'
import { Provider } from "react-redux"
import { store } from './store/Store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthRoutes />
  </Provider>
)
