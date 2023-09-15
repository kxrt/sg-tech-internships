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
} from "@mantine/core";
import GoogleIcon from "../assets/google.svg";

export default function Auth() {
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
        <Container size={420} style={{ textAlign: "left" }} my={40}>
            <Title
                align="center"
                sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                })}
            >
                Welcome back!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                {type === "register"
                    ? "Already have an account? "
                    : "Don't have an account? "}
                <Anchor
                    size="sm"
                    component="button"
                    type="button"
                    onClick={() => toggle()}
                >
                    {upperFirst(type)}
                </Anchor>
            </Text>

            <Paper radius="md" p="xl" withBorder mt={30}>
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
                                    event.currentTarget.value
                                )
                            }
                            error={form.errors.email && "Invalid email"}
                            radius="md"
                            style={{
                                borderColor: "#6161ff",
                            }}
                        />
                    </Stack>
                </form>

                <Button
                    type="submit"
                    radius="md"
                    fullWidth
                    mt={"xl"}
                    style={{
                        backgroundColor: "#6161ff",
                    }}
                >
                    {upperFirst(type)}
                </Button>
            </Paper>
        </Container>
    );
}
