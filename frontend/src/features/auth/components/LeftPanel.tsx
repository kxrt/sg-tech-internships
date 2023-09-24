import { Center, Title, Text, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.colors.gray[1],
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
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

const LeftPanel = () => {
    const { classes } = useStyles();
    return (
        <Center className={classes.root} p={"xl"}>
            {/* <Image src={CatIllustration} /> */}
            <Title className={classes.title}>
                Summer 2024{" "}
                <Text component="span" className={classes.highlight} inherit>
                    Internships
                </Text>{" "}
            </Title>
        </Center>
    );
};

export default LeftPanel;
