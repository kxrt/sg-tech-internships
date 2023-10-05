import {
  Button,
  Divider,
  Group,
  List,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

import PlusIcon from "../assets/plus.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AnnoucementModal = () => {
  const [opened, setOpened] = useState<boolean>(true);
  const close = () => {
    setOpened(false);
    localStorage.setItem("hasViewedAnnouncement", "true");
  };

  const navigate = useNavigate();

  return (
    <Modal opened={opened} onClose={close} title="What's new">
      <Stack spacing={"md"}>
        <Divider />
        {/* <Stack spacing={"lg"}> */}
        <Text>Hey, welcome back!</Text>
        <Text fw={"bold"}>You can now track your application statuses.</Text>

        <List
          withPadding
          icon={
            <ThemeIcon color="green" size={"sm"}>
              <img src={PlusIcon} alt="" height={18} />
            </ThemeIcon>
          }
          spacing={"sm"}
          center
        >
          <List.Item>
            <Text>View your application status at a glance</Text>
          </List.Item>
          <List.Item>
            <Text>Update your application status with a click of a button</Text>
          </List.Item>
          <List.Item>
            <Text>
              View internships by category by clicking the tabs on the top
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              We're aware the card view doesn't show the updated status if you
              search right after updating, but it will show the updated status
              if you refresh the page - we're working on a fix for this
            </Text>
          </List.Item>
        </List>
        {/* </Stack> */}
        <Divider />
        <Group ml={"auto"}>
          <Text color="dimmed" fz={"sm"}>
            Try it out now!
          </Text>
          <Button
            variant="cta"
            px={"3rem"}
            onClick={() => {
              close();
              navigate("/auth");
            }}
          >
            Login
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AnnoucementModal;
