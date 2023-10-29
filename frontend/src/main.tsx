import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage.tsx";
import { MantineProvider } from "@mantine/core";
import AuthForm from "./features/auth/components/AuthForm.tsx";
import ResetPassword from "./features/auth/components/ResetPassword.tsx";
import { ModalsProvider } from "@mantine/modals";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase.ts";
import { useAuthStore } from "./stores/AuthStore.ts";
import { ErrorPage } from "./ErrorPage.tsx";
import ReactGA from "react-ga4";

ReactGA.initialize(String(import.meta.env.VITE_GA_TRACKING_ID));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      {
        path: "",
        element: <AuthForm />,
      },
      {
        path: "reset",
        element: <ResetPassword />,
      },
    ],
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
            transition: "border-color 0.25s, background-color 0.25s",
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
    Select: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      styles: (theme) => ({
        item: {
          "&[data-selected]": {
            "&, &:hover": {
              backgroundColor: theme.colors.violet[1],
              color: theme.black,
            },
          },
        },
      }),
    },
    Input: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      styles: (theme) => ({
        input: {
          "&:focus, &:focus-within, &:focus-visible": {
            borderColor: "#6161ff",
          },
          "::selection": {
            background: theme.colors.violet[1],
          },
        },
      }),
    },
  },
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    useAuthStore.setState({ user: user });
  } else {
    useAuthStore.setState({ user: null });
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
    <ModalsProvider>
      <RouterProvider router={router} />
    </ModalsProvider>
  </MantineProvider>
);
