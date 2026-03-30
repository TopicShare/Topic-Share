import "@mantine/core/styles.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { useNavigate, BrowserRouter, Route, Routes } from "react-router"
import { createTheme, MantineProvider } from "@mantine/core"
import "./index.css"
import App from "./App.jsx"
import { CallRoom } from "./components/CallRoom"

const theme = createTheme({
  colors: {
    dark: [
      "#C1C2C5", // dark.0 - text
      "#A6A7AB", // dark.1
      "#909296", // dark.2
      "#5C5F66", // dark.3
      "#373A40", // dark.4
      "#2C2E33", // dark.5
      "#1a1f2e", // dark.6 - card bg ← match your navy
      "#141821", // dark.7 - page bg
      "#0f1319", // dark.8
      "#0a0d12", // dark.9
    ],
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
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
