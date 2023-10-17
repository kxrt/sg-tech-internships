import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    PaperProps,
    Text,
    createStyles,
} from "@mantine/core";
import { useAuthStore } from "../stores/AuthStore";
import { InternshipWithStatus } from "../types";
import InternshipCardStatus from "./InternshipCardStatus";

const useStyles = createStyles((theme) => ({
    root: {
        containerType: "inline-size",
        border: "1px solid #e0e0e0",
        transition: "0.2s",
        "&:hover": {
            border: "1px solid #6161ff",
        },
    },
    card: {
        display: "grid",
        height: "100%",
        gridTemplateColumns: "1fr auto",
        gridTemplateAreas: '"info button" "info status"',
        gap: theme.spacing.sm,
        "@container (width < 500px)": {
            gridTemplateAreas: '"info info" "status button"',
        },
        "@container (width < 320px)": {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr auto auto",
            gridTemplateAreas: '"info" "status" "button"',
        },
    },
    info: {
        gridArea: "info",
        paddingRight: theme.spacing.md,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
        overflow: "hidden",
        "&>*": {
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
    },
    button: {
        gridArea: "button",
        placeSelf: "end",
        textDecoration: "none",
        "@container (width < 320px)": {
            width: "100%",
        },
    },
}));

type InternshipCardProps = {
    internship: InternshipWithStatus;
} & PaperProps;

const InternshipCard = ({ internship }: InternshipCardProps) => {
    const { classes } = useStyles();

    const user = useAuthStore((state) => state.user);

    return (
        <Paper p={"xl"} radius={"md"} ta={"left"} className={classes.root}>
            <div className={classes.card}>
                <Box className={classes.info}>
                    <Text c="dimmed" fz={"sm"}>
                        {internship.date_added.slice(0, 6)}
                    </Text>
                    <Text fw={"bold"} fz={"lg"}>
                        {internship.company}
                    </Text>
                    <Text>{internship.role}</Text>
                </Box>
                <Link
                    className={classes.button}
                    to={internship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        variant="cta"
                        className="internship-apply-button"
                        fullWidth
                        disabled={!internship.is_open}
                    >
                        {internship.is_open ? "View" : "Closed"}
                    </Button>
                </Link>
                {user ? (
                    <InternshipCardStatus
                        status={internship.status}
                        internship_id={internship.internship_id}
                    />
                ) : (
                    <Link to={"/auth"}>
                        <Text c="dimmed" fz={"xs"} ta={"right"} mt={"xs"}>
                            login to track
                        </Text>
                    </Link>
                )}
            </div>
        </Paper>
    );
};

export default InternshipCard;
