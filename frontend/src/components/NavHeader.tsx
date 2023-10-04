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

type NavHeaderProps = {
    curCategory: Category;
    setCategory: (category: Category) => void;
} & HeaderProps;

export function NavHeader({
    curCategory,
    setCategory,
    ...props
}: NavHeaderProps) {
    const { classes } = useStyles();

    return (
        <Header {...props} className={classes.root}>
            <Container className={classes.header}>
                <Group>
                    <img
                        src="/favicon/favicon-32x32.png"
                        alt="logo"
                        className={classes.logo}
                    />
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
                                    setCategory(category as Category);
                                }}
                                className={classes.tab}
                                active={category == curCategory}
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
