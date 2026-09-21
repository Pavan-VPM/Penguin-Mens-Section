import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/outfit' // Defaults to weight 400
import '@fontsource/freeman'
import '@fontsource/roboto'
import '@fontsource/roboto/900.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
