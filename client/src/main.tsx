import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useNavigate, BrowserRouter, Route, Routes } from "react-router"
import './index.css'
import App from './App.jsx'
import { CallRoom } from './components/CallRoom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/callRoom/:callId" element={<CallRoom />}>
        </Route>
        <Route path="/" element={<App />}>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
