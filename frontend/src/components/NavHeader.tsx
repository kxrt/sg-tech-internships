import {
    createStyles,
    Container,
    rem,
    Text,
    Title,
    Header,
    HeaderProps,
} from "@mantine/core";
import UserMenu from "./UserMenu";

const useStyles = createStyles((theme) => ({
    root: {
        zIndex: 2,
        backgroundColor: "white",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
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

export function NavHeader(props: HeaderProps) {
    const { classes } = useStyles();

    return (
        <Header {...props} className={classes.root}>
            <Container className={classes.header}>
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
                <UserMenu />
            </Container>
        </Header>
    );
}
