import {
    Title,
    Text,
    Button,
    Container,
    Group,
    createStyles,
    rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: rem("80px"),
        paddingBottom: rem("80px"),
    },

    label: {
        textAlign: "center",
        fontWeight: 900,
        fontSize: rem("38px"),
        lineHeight: 1,
        marginBottom: theme.spacing.xl,

        [theme.fn.smallerThan("sm")]: {
            fontSize: rem("32px"),
        },
    },

    description: {
        maxWidth: rem("500px"),
        margin: "auto",
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },

    title: {
        textAlign: "center",
        fontWeight: 900,
        fontSize: rem("38px"),

        [theme.fn.smallerThan("sm")]: {
            fontSize: rem("32px"),
        },
    },

    button: {
        justifyContent: "center",
    },
}));

export function ErrorPage() {
    const { classes } = useStyles();
    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>
                You have found a secret place.
            </Title>
            <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
            >
                Unfortunately, this is only a 404 page. You may have mistyped
                the address, or the page has been moved to another URL.
            </Text>
            <Group className={classes.button}>
                <Button variant="subtle" size="md">
                    Take me back to home page
                </Button>
            </Group>
        </Container>
    );
}
