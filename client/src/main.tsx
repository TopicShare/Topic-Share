import "@mantine/core/styles.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { useNavigate, BrowserRouter, Route, Routes } from "react-router"
import { MantineProvider } from "@mantine/core"
import "./index.css"
import App from "./App.jsx"
import { CallRoom } from "./components/CallRoom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/callRoom/:callId" element={<CallRoom />}>
          </Route>
          <Route path="/" element={<App />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
