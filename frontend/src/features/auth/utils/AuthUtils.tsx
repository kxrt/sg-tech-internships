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

const parseFirebaseAuthError = (errorCode: string): string => {
    return errorCode.substring(5, errorCode.length).replaceAll("-", " ");
};

export const handleGoogleOAuth = () => {
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
