import {
    Title,
    TextInput,
    Group,
    Anchor,
    Center,
    Box,
    Button,
    Text,
    createStyles,
    Space,
} from "@mantine/core";
import LeftArrowIcon from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import { handleResetPassword } from "../utils/AuthUtils";
import { useForm } from "@mantine/form";

const useStyles = createStyles(() => ({
    fill: {
        height: "100%",
        width: "100%",
    },
    back: {
        "&>*:hover": {
            textDecoration: "underline",
        },
    },
}));

const ResetPassword = () => {
    const { classes } = useStyles();

    const form = useForm({
        initialValues: {
            email: "",
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
        },
    });

    const navigate = useNavigate();
    return (
        <Center className={classes.fill}>
            <Box w={"75%"}>
                <Title align="center" fw={900}>
                    Forgot your password?
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={"sm"}>
                    Enter your email to get a reset link
                </Text>
                <Space h={"xl"} />
                <form
                    onSubmit={form.onSubmit(({ email }) => {
                        handleResetPassword(email);
                    })}
                >
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
                    <Group mt="lg">
                        <Button
                            type="submit"
                            radius="sm"
                            fullWidth
                            color="violet"
                            variant="filled"
                        >
                            Reset password
                        </Button>
                        <Anchor
                            c="dimmed"
                            size="sm"
                            onClick={() => {
                                navigate("/auth");
                            }}
                            mt={"md"}
                            className={classes.back}
                        >
                            <Center inline>
                                <img src={LeftArrowIcon} />
                                <Text ml={5}>Back to the login page</Text>
                            </Center>
                        </Anchor>
                    </Group>
                </form>
            </Box>
        </Center>
    );
};

export default ResetPassword;
