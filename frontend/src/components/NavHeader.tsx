import {
    createStyles,
    Container,
    rem,
    Text,
    Title,
    Header,
    HeaderProps,
    Button,
    Group,
    NavLink,
} from "@mantine/core";
import UserMenu from "../features/auth/components/UserMenu";
import { Category } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";

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
        gap: theme.spacing.sm,
    },

    logoGroup: {
        "&:hover": {
            cursor: "pointer",
        },
    },

    logo: {
        height: "32px",
        width: "32px",
        marginLeft: "16px",
    },

    title: {
        fontSize: rem(16),
        letterSpacing: -1,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    highlight: {
        color: "#6161ff",
    },

    tabs: {
        flexWrap: "nowrap",
    },

    tab: {
        '&[data-active="true"]': {
            color: "#6161FF",
        },
    },
}));

const categories: Category[] = ["Summer", "Offcycle"];

export function NavHeader(props: HeaderProps) {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <Header {...props} className={classes.root}>
            <Container className={classes.header}>
                <Group
                    onClick={() => {
                        navigate("/");
                    }}
                    className={classes.logoGroup}
                >
                    <img
                        src="/favicon/favicon-32x32.png"
                        alt="logo"
                        className={classes.logo}
                    />
                    <Title className={classes.title}>
                        2024 Tech{" "}
                        <Text
                            component="span"
                            className={classes.highlight}
                            inherit
                        >
                            Internships
                        </Text>{" "}
                    </Title>
                </Group>
                <Group className={classes.tabs}>
                    {categories.map((category) => {
                        return (
                            <NavLink
                                key={category}
                                label={category}
                                color="violet"
                                // variant="subtle"
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                onClick={() => {
                                    const updatedSearchParams =
                                        new URLSearchParams(
                                            searchParams.toString()
                                        );
                                    updatedSearchParams.set(
                                        "category",
                                        category
                                    );
                                    setSearchParams(
                                        updatedSearchParams.toString()
                                    );
                                }}
                                className={classes.tab}
                                active={
                                    category ==
                                    (searchParams.get("category") || "Summer")
                                }
                                component={Button}
                            />
                        );
                    })}
                </Group>
                <UserMenu />
            </Container>
        </Header>
    );
}
