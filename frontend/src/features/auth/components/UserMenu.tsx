import {
    Avatar,
    Button,
    Group,
    Menu,
    Text,
    UnstyledButton,
    createStyles,
} from "@mantine/core";
import MdLogout from "../assets/MdLogout.svg";
import MdExpandMore from "../assets/MdExpandMore.svg";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/AuthUtils";
import { useAuthStore } from "../../../stores/AuthStore";

const useStyles = createStyles((theme) => ({
    user: {
        flexWrap: "nowrap",
        color: theme.black,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        transition: "background-color 100ms ease",

        backgroundColor: theme.colors.gray[0],

        "&:hover": {
            backgroundColor: theme.colors.gray[1],
        },
    },

    userActive: {
        backgroundColor: theme.white,
    },

    userName: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },
}));

const UserMenu = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    return (
        <>
            {user ? (
                <Menu
                    width={160}
                    position="bottom-end"
                    transitionProps={{ transition: "pop-top-right" }}
                >
                    <Menu.Target>
                        <UnstyledButton className={classes.user}>
                            <Group spacing={7}>
                                <Avatar
                                    src={user.photoURL}
                                    alt={
                                        user.displayName
                                            ? user.displayName
                                            : "profile photo"
                                    }
                                    radius="xl"
                                    size={24}
                                    color="violet"
                                >
                                    {user.displayName
                                        ? user.displayName[0]
                                        : "?"}
                                </Avatar>
                                <Text
                                    weight={500}
                                    size="sm"
                                    sx={{ lineHeight: 1 }}
                                    mr={3}
                                    className={classes.userName}
                                >
                                    {user.displayName
                                        ? user.displayName
                                        : user.email}
                                </Text>
                                <img src={MdExpandMore} />
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            color="red"
                            icon={<img src={MdLogout} />}
                            onClick={() => {
                                handleLogout();
                            }}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <Button
                    type="submit"
                    radius="md"
                    style={{
                        backgroundColor: "#6161ff",
                    }}
                    onClick={() => {
                        navigate("auth");
                    }}
                >
                    Login
                </Button>
            )}
        </>
    );
};

export default UserMenu;
