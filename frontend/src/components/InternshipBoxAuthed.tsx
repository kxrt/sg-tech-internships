import { Link } from "react-router-dom";
import { Internship } from "./Internships";
import {
    Badge,
    Box,
    Button,
    Group,
    Image,
    Paper,
    Select,
    Text,
    createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";
import EditIcon from "../assets/edit.svg";
import SaveIcon from "../assets/save.svg";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "../stores/AuthStore";

const STATUSES = [
    "Pending",
    "Applied",
    "HireVue",
    "HireVue Complete",
    "OA",
    "OA Complete",
    "Interview",
    "Interview Complete",
    "Offer",
    "Accepted",
    "Rejected",
    "Declined",
];

const COLOR_MAP: { [key: string]: string } = {
    Pending: "gray",
    Applied: "blue",
    HireVue: "orange",
    "HireVue Complete": "blue",
    OA: "orange",
    "OA Complete": "blue",
    Interview: "orange",
    "Interview Complete": "blue",
    Offer: "green",
    Accepted: "green",
    Rejected: "red",
    Declined: "red",
};

const useStyles = createStyles((theme) => ({
    root: {
        containerType: "inline-size",
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
    status: {
        gridArea: "status",
        placeSelf: "center",
        "@container (width < 500px)": {
            placeSelf: "start",
            flexDirection: "row-reverse",
        },
    },
}));

const InternshipBoxAuthed = ({
    internship,
    status,
}: {
    internship: Internship;
    status: string;
}) => {
    const { classes } = useStyles();
    const [value, setValue] = useState<string>(status ? status : "Pending");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setValue(status ? status : "Pending");
    }, [status]);

    const user = useAuthStore((state) => state.user);

    const handleStatusUpdate = async () => {
        const token = await user?.getIdToken();
        axios
            .post(
                "/api/user/update",
                JSON.stringify({
                    internship_id: internship.internship_id,
                    status: value,
                }),

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
            })
            .catch(() => {
                toast.error("Error updating status", {
                    position: "bottom-right",
                });
                setValue(status ? status : "Pending");
            });
    };

    return (
        <Paper
            withBorder
            p={"xl"}
            radius={"md"}
            ta={"left"}
            className={classes.root}
        >
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
                    >
                        View
                    </Button>
                </Link>
                {user ? (
                    isEditing ? (
                        <Group noWrap className={classes.status}>
                            <Button
                                color="gray"
                                variant="light"
                                p={4}
                                h="fit-content"
                                onClick={() => {
                                    setIsEditing(false);
                                    handleStatusUpdate();
                                }}
                            >
                                <Image src={SaveIcon} height={16} width={16} />
                            </Button>
                            <Select
                                data={STATUSES}
                                value={value}
                                onChange={(newValue) => {
                                    setValue(
                                        newValue == null ? "Pending" : newValue
                                    );
                                }}
                                className={classes.status}
                                searchable
                                clearable
                                withinPortal
                                placeholder="Pending"
                                styles={(theme) => ({
                                    item: {
                                        "&[data-selected]": {
                                            "&, &:hover": {
                                                backgroundColor:
                                                    theme.colors.violet[1],
                                                color: theme.black,
                                            },
                                        },

                                        // applies styles to hovered item (with mouse or keyboard)
                                        "&[data-hovered]": {},
                                    },
                                })}
                            ></Select>
                        </Group>
                    ) : (
                        <Group className={classes.status}>
                            <Button
                                color="gray"
                                variant="light"
                                p={4}
                                h="fit-content"
                                onClick={() => {
                                    setIsEditing(true);
                                }}
                            >
                                <Image src={EditIcon} height={16} width={16} />
                            </Button>
                            <Badge
                                radius="md"
                                size="lg"
                                color={COLOR_MAP[value]}
                                h={36}
                            >
                                {value}
                            </Badge>
                        </Group>
                    )
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

export default InternshipBoxAuthed;
