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

const theme = {
    components: {
        Button: {
            variants: {
                cta: () => ({
                    root: {
                        borderRadius: "8px",
                        color: "#fbfbfb",
                        border: "1px solid transparent",
                        padding: "0.4em, 0.8em",
                        fontSize: "1em",
                        fontWeight: 500,
                        fontFamily: "inherit",
                        backgroundColor: "#6161ff",
                        cursor: "pointer",
                        transition:
                            "border-color 0.25s, background-color 0.25s",
                        boxShadow: "0px 10px 15px rgba(97, 97, 255, 0.25)",
                        "&:hover": {
                            borderColor: "#646cff",
                            backgroundColor: "#4046b7",
                        },
                        "&:focus, &:focus-visible": {
                            outline: "4px auto -webkit-focus-ring-color",
                        },
                    },
                }),
            },
        },
    },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
    </MantineProvider>
);
