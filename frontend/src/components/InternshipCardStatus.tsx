import {
    Group,
    Button,
    MultiSelect,
    Badge,
    createStyles,
    GroupProps,
    Image,
} from "@mantine/core";
import EditIcon from "../assets/edit.svg";
import SaveIcon from "../assets/save.svg";
import { STATUSES, Status } from "../types";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/AuthStore";
import axios from "axios";
import { toast } from "react-toastify";
import ReactGA from "react-ga4";
import { useInternshipStore } from "../stores/InternshipStore";

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

const useStyles = createStyles(() => ({
    status: {
        gridArea: "status",
        placeSelf: "center",
        "@container (width < 500px)": {
            placeSelf: "start",
            flexDirection: "row-reverse",
        },
    },
}));

type InternShipCardStatusProps = {
    status: Status[];
    internship_id: string;
} & GroupProps;

const InternshipCardStatus = ({
    internship_id,
    status,
}: InternShipCardStatusProps) => {
    const { classes } = useStyles();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<Status[]>([]);

    const user = useAuthStore((state) => state.user);
    const updateStatus = useInternshipStore((state) => state.updateStatus);

    useEffect(() => {
        setValue(status);
    }, [status]);

    const handleStatusUpdate = async () => {
        // avoid making api call if no changes were made
        if (status == value) {
            return;
        }
        const token = await user?.getIdToken();
        ReactGA.event({
            category: "User",
            action: "Update application status",
        });
        axios
            .post(
                "/api/user/update",
                JSON.stringify({
                    internship_id: internship_id,
                    statuses: value,
                }),

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                toast.success("Status updated successfully", {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                updateStatus(internship_id, value);
            })
            .catch(() => {
                toast.error("Error updating status", {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setValue(status);
            });
    };

    return isEditing ? (
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
            <MultiSelect
                data={STATUSES}
                value={value}
                onChange={(newValue: Status[]) => {
                    newValue.sort(
                        (a, b) => STATUSES.indexOf(a) - STATUSES.indexOf(b)
                    );
                    setValue(newValue);
                }}
                className={classes.status}
                searchable
                clearable
                withinPortal
            ></MultiSelect>
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
                color={
                    COLOR_MAP[
                        value.length ? value[value.length - 1] : "Pending"
                    ]
                }
                h={36}
            >
                {value.length ? value[value.length - 1] : "Pending"}
            </Badge>
        </Group>
    );
};

export default InternshipCardStatus;
