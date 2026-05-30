import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './FowlerPool.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
