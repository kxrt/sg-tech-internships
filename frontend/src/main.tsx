import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/Auth.tsx";
import { MantineProvider } from "@mantine/core";
// import ReactGA from "react-ga4";

// ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
    </MantineProvider>
);
