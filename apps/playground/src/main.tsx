import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div>Bones UI Playground</div>;
}

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
