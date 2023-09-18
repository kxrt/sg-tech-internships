import {
    Avatar,
    Button,
    Group,
    Menu,
    Text,
    UnstyledButton,
    createStyles,
} from "@mantine/core";
import { useState } from "react";
import MdLogout from "../assets/MdLogout.svg";
import MdExpandMore from "../assets/MdExpandMore.svg";

const useStyles = createStyles((theme) => ({
    user: {
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        transition: "background-color 100ms ease",

        backgroundColor: theme.white,

        "&:hover": {
            backgroundColor: theme.colors.gray[0],
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

// mock user state
const user = {
    displayName: "MOCK USER",
    photoURL: "",
    email: "mock_user@handsome.com",
};

const UserMenu = () => {
    const { classes, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <>
            {user ? (
                <Menu
                    width={160}
                    position="bottom-end"
                    transitionProps={{ transition: "pop-top-right" }}
                    onClose={() => setUserMenuOpened(false)}
                    onOpen={() => setUserMenuOpened(true)}
                    withinPortal
                >
                    <Menu.Target>
                        <UnstyledButton
                            className={cx(classes.user, {
                                [classes.userActive]: userMenuOpened,
                            })}
                        >
                            <Group spacing={7}>
                                <Avatar
                                    // src={user.photoURL}
                                    // alt={user.displayName}
                                    radius="xl"
                                    size={24}
                                    color="violet"
                                >
                                    MU
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
                        <Menu.Item color="red" icon={<img src={MdLogout} />}>
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <Button
                    type="submit"
                    radius="md"
                    fullWidth
                    style={{
                        backgroundColor: "#6161ff",
                    }}
                >
                    Login
                </Button>
            )}
        </>
    );
};

export default UserMenu;
