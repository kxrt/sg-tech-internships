import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../../config/firebase";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import ReactGA from "react-ga4";

const parseFirebaseAuthError = (errorCode: string): string => {
    return errorCode.substring(5, errorCode.length).replaceAll("-", " ");
};

export const handleGoogleOAuth = () => {
    ReactGA.event({
        category: "User",
        action: "Google Oauth",
    });
    signInWithPopup(auth, googleAuthProvider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            toast.success(`Signed in as: ${user.displayName || user.email}`, {
                position: "bottom-right",
            });
        })
        .catch((error) => {
            if (import.meta.env.MODE == "development") {
                console.log(error);
            }
            toast.error(
                <p>
                    {parseFirebaseAuthError(error.code)}
                    <br />
                    please try again
                </p>,
                {
                    position: "bottom-right",
                }
            );
        });
};

export const handleRegister = (email: string, password: string) => {
    ReactGA.event({
        category: "User",
        action: "Created an Account",
    });
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            toast.success("Your account has been registered", {
                position: "bottom-right",
            });
        })
        .catch((error) => {
            if (import.meta.env.MODE == "development") {
                console.log(error);
            }
            toast.error(
                <p>
                    {parseFirebaseAuthError(error.code)}
                    <br />
                    please try again
                </p>,
                {
                    position: "bottom-right",
                }
            );
        });
};

export const handleLogin = (email: string, password: string) => {
    ReactGA.event({
        category: "User",
        action: "Signed in",
    });
    signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            const user = result.user;
            toast.success(`Signed in as: ${user.displayName || user.email}`, {
                position: "bottom-right",
            });
        })
        .catch((error) => {
            if (import.meta.env.MODE == "development") {
                console.log(error);
            }
            toast.error(
                <p>
                    {parseFirebaseAuthError(error.code)}
                    <br />
                    please try again
                </p>,
                {
                    position: "bottom-right",
                }
            );
        });
};

export const handleResetPassword = (email: string) => {
    ReactGA.event({
        category: "User",
        action: "Reset password",
    });
    sendPasswordResetEmail(auth, email)
        .then(() => {
            toast.success("Password reset email sent", {
                position: "bottom-right",
            });
        })
        .catch((error) => {
            if (import.meta.env.MODE == "development") {
                console.log(error);
            }
            toast.error(
                <p>
                    {parseFirebaseAuthError(error.code)}
                    <br />
                    please try again
                </p>,
                {
                    position: "bottom-right",
                }
            );
        });
};

export const handleLogout = () => {
    ReactGA.event({
        category: "User",
        action: "Logged out",
    });
    modals.openConfirmModal({
        title: "Logout",
        centered: true,
        children: <Text size="sm">Are you sure you want to logout?</Text>,
        labels: { confirm: "Logout", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onCancel: () => {},
        onConfirm: () => signOut(auth),
    });
};
