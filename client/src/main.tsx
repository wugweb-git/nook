import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/animations.css";
import "./styles/theme.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="wugweb-team-theme">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>
);
