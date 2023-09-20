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
} from "@mantine/core";
import GoogleIcon from "../assets/google.svg";

const useStyles = createStyles((theme) => ({
    leftPanel: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.colors.violet[3],
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },
    fill: {
        height: "100%",
        width: "100%",
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
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: (val) =>
                val.length <= 6
                    ? "Password should include at least 6 characters"
                    : null,
        },
    });

    return (
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
                            <Box className={classes.leftPanel}>
                                {/* left panel */}
                            </Box>
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
                                            leftIcon={<img src={GoogleIcon} />}
                                            variant="default"
                                            color="gray"
                                        >
                                            Continue with Google
                                        </Button>
                                    </Group>

                                    <Divider
                                        label="Or continue with email"
                                        labelPosition="center"
                                        my="lg"
                                    />

                                    <form onSubmit={form.onSubmit(() => {})}>
                                        <Stack>
                                            <TextInput
                                                required
                                                label="Email"
                                                placeholder="hello@mantine.dev"
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
                                        </Stack>
                                    </form>

                                    <Button
                                        type="submit"
                                        radius="md"
                                        fullWidth
                                        mt={"xl"}
                                        sx={{
                                            backgroundColor: "#6161ff",
                                        }}
                                    >
                                        {upperFirst(type)}
                                    </Button>
                                </Box>
                            </Center>
                        </SimpleGrid>
                    </Paper>
                </Center>
            </Container>
        </Container>
    );
}
