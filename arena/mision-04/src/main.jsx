import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./style.css";

// Un unico cliente para toda la app: es el que guarda la cache de las peticiones
const clienteConsultas = new QueryClient({
	defaultOptions: {
		// Un reintento basta: con el servidor apagado, tres hacen esperar demasiado para ver el error
		queries: { retry: 1 },
	},
});

createRoot(document.querySelector("#raiz")).render(
	<StrictMode>
		<QueryClientProvider client={clienteConsultas}>
			<App />
		</QueryClientProvider>
	</StrictMode>,
);
