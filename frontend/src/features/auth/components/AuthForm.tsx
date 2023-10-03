import {
    Anchor,
    Box,
    Button,
    Center,
    Divider,
    Group,
    PasswordInput,
    Space,
    Stack,
    TextInput,
    Title,
    Text,
    createStyles,
} from "@mantine/core";
import { upperFirst, useToggle } from "@mantine/hooks";
import {
    handleGoogleOAuth,
    handleLogin,
    handleRegister,
} from "../utils/AuthUtils";
import { useForm } from "@mantine/form";
import GoogleIcon from "../assets/google.svg";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(() => ({
    fill: {
        height: "100%",
        width: "100%",
    },
}));

const AuthForm = () => {
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

    const handleSubmit = (values: typeof form.values) => {
        const { email, password } = values;
        if (type == "login") {
            handleLogin(email, password);
        } else {
            handleRegister(email, password);
        }
    };

    const navigate = useNavigate();

    return (
        <Center className={classes.fill}>
            <Box w={"75%"}>
                <Title align="center" fw={900}>
                    Welcome back!
                </Title>
                <Text color="dimmed" size="sm" align="center" mt="sm">
                    {type === "register"
                        ? "Already have an account? "
                        : "Don't have an account? "}
                    <Anchor
                        size="sm"
                        type="button"
                        onClick={() => toggle()}
                        color="#6161ff"
                    >
                        {type === "register" ? "Login" : "Register"}
                    </Anchor>
                </Text>
                <Space h={"xl"} />
                <Text size="lg" weight={500}>
                    {upperFirst(type)} with
                </Text>

                <Group grow mb="md" mt="md">
                    <Button
                        leftIcon={<img src={GoogleIcon} />}
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

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="hello@worldmail.dev"
                            value={form.values.email}
                            onChange={(event) =>
                                form.setFieldValue(
                                    "email",
                                    event.currentTarget.value
                                )
                            }
                            error={form.errors.email && "Invalid email"}
                            radius="sm"
                        />
                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            value={form.values.password}
                            onChange={(event) =>
                                form.setFieldValue(
                                    "password",
                                    event.currentTarget.value
                                )
                            }
                            error={
                                form.errors.password &&
                                "Password should include at least 6 characters"
                            }
                            radius="sm"
                        />
                        <Anchor
                            component="button"
                            size="sm"
                            color="#6161ff"
                            align="right"
                            onClick={() => {
                                navigate("reset");
                            }}
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
    );
};

export default AuthForm;
