import {
    Paper,
    Container,
    Center,
    createStyles,
    SimpleGrid,
} from "@mantine/core";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LeftPanel from "./components/LeftPanel";

const useStyles = createStyles(() => ({
    fill: {
        height: "100%",
        width: "100%",
    },
}));

export default function AuthPage() {
    const { classes } = useStyles();

    const navigate = useNavigate();

    onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
            navigate("/");
        }
    });

    return (
        <>
            <Container fluid bg={"violet.1"}>
                <Container
                    size={"lg"}
                    p={"xl"}
                    sx={{ textAlign: "left" }}
                    h={"100svh"}
                >
                    <Center className={classes.fill}>
                        <Paper
                            h={"100%"}
                            mah={"40rem"}
                            shadow="md"
                            radius={"md"}
                            w={"100%"}
                            sx={{ overflow: "hidden" }}
                        >
                            <SimpleGrid
                                cols={2}
                                breakpoints={[{ maxWidth: "md", cols: 1 }]}
                                className={classes.fill}
                            >
                                <LeftPanel />
                                <Outlet />
                            </SimpleGrid>
                        </Paper>
                    </Center>
                </Container>
            </Container>
            <ToastContainer
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}
