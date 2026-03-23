import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthContext";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackPage from "./pages/Error/fallback";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary FallbackComponent={ErrorFallbackPage}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>
);
