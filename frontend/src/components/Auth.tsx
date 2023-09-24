import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
    TextInput,
    Text,
    Paper,
    Group,
    Button,
    Divider,
    Anchor,
    Stack,
    Container,
    Title,
    Space,
    Center,
    Box,
    createStyles,
    SimpleGrid,
    rem,
    PasswordInput,
} from "@mantine/core";
import GoogleIcon from "../assets/google.svg";
import {
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleAuthProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const useStyles = createStyles((theme) => ({
    leftPanel: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.colors.gray[1],
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },
    fill: {
        height: "100%",
        width: "100%",
    },
    title: {
        fontSize: rem(24),
        letterSpacing: -1,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan("xs")]: {
            fontSize: rem(16),
            textAlign: "left",
        },
    },

    highlight: {
        color: "#6161ff",
    },
}));

export default function Auth() {
    const { classes } = useStyles();
    const [type, toggle] = useToggle(["login", "register"]);

    const form = useForm({
        initialValues: {
            email: "",
            name: "",
            password: "",
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: (val) =>
                val.length <= 6
                    ? "Password should include at least 6 characters"
                    : null,
        },
    });

    const navigate = useNavigate();

    onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
            navigate("/");
        }
    });

    const handleGoogleOAuth = () => {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                if (credential != null) {
                    const token = credential.accessToken;
                    console.log(token);
                }
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                // The email of the user's account used.
                const email = error.customData.email;

                console.log(errorCode, errorMessage, email);
                // ...
            });
    };

    const handleSubmit = (values: typeof form.values) => {
        console.log("asdas");
        const { email, password } = values;
        if (type == "login") {
            handleLogin(email, password);
        } else {
            handleRegister(email, password);
        }
    };

    const handleRegister = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    };

    const handleLogin = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                toast.dismiss();
                // ...
            })
            .catch((error) => {
                console.log(error);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                toast.error("Invalid login credentials.\nPlease try again", {
                    position: "bottom-right",
                });
            });
    };

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
                            // withBorder
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
                                <Center className={classes.leftPanel} p={"xl"}>
                                    {/* <Image src={CatIllustration} /> */}
                                    <Title className={classes.title}>
                                        Summer 2024{" "}
                                        <Text
                                            component="span"
                                            className={classes.highlight}
                                            inherit
                                        >
                                            Internships
                                        </Text>{" "}
                                    </Title>
                                </Center>
                                <Center className={classes.fill}>
                                    <Box w={"75%"}>
                                        <Title align="center" fw={900}>
                                            Welcome back!
                                        </Title>
                                        <Text
                                            color="dimmed"
                                            size="sm"
                                            align="center"
                                            mt={5}
                                        >
                                            {type === "register"
                                                ? "Already have an account? "
                                                : "Don't have an account? "}
                                            <Anchor
                                                size="sm"
                                                type="button"
                                                onClick={() => toggle()}
                                                color="#6161ff"
                                            >
                                                {type === "register"
                                                    ? "Login"
                                                    : "Register"}
                                            </Anchor>
                                        </Text>
                                        <Space h={"xl"} />
                                        <Text size="lg" weight={500}>
                                            {upperFirst(type)} with
                                        </Text>

                                        <Group grow mb="md" mt="md">
                                            <Button
                                                leftIcon={
                                                    <img src={GoogleIcon} />
                                                }
                                                variant="default"
                                                color="gray"
                                                onClick={handleGoogleOAuth}
                                            >
                                                Continue with Google
                                            </Button>
                                        </Group>

                                        <Divider
                                            label="Or continue with email"
                                            labelPosition="center"
                                            my="lg"
                                        />

                                        <form
                                            onSubmit={form.onSubmit(
                                                handleSubmit
                                            )}
                                        >
                                            <Stack>
                                                <TextInput
                                                    required
                                                    label="Email"
                                                    placeholder="hello@worldmail.dev"
                                                    value={form.values.email}
                                                    onChange={(event) =>
                                                        form.setFieldValue(
                                                            "email",
                                                            event.currentTarget
                                                                .value
                                                        )
                                                    }
                                                    error={
                                                        form.errors.email &&
                                                        "Invalid email"
                                                    }
                                                    radius="md"
                                                />
                                                <PasswordInput
                                                    required
                                                    label="Password"
                                                    placeholder="Your password"
                                                    value={form.values.password}
                                                    onChange={(event) =>
                                                        form.setFieldValue(
                                                            "password",
                                                            event.currentTarget
                                                                .value
                                                        )
                                                    }
                                                    error={
                                                        form.errors.password &&
                                                        "Password should include at least 6 characters"
                                                    }
                                                    radius="md"
                                                />
                                                <Anchor
                                                    component="button"
                                                    size="sm"
                                                    color="#6161ff"
                                                    align="right"
                                                >
                                                    Forgot your password?
                                                </Anchor>
                                            </Stack>
                                            <Button
                                                type="submit"
                                                radius="md"
                                                fullWidth
                                                mt={"xl"}
                                                color="violet"
                                                variant="filled"
                                            >
                                                {upperFirst(type)}
                                            </Button>
                                        </form>
                                    </Box>
                                </Center>
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
