
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ReactDom from "react-dom/client";

ReactDom.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
