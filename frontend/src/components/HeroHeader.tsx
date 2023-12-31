import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Indicator,
} from "@mantine/core";
import GitHubIcon from "../assets/github.svg";
import Plus from "../assets/plus.svg";
import { Dots } from "./Dots";

const useStyles = createStyles((theme) => ({
  wrapper: {
    zIndex: 1,
    position: "relative",
    paddingTop: rem(120),
    paddingBottom: rem(40),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(50),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color: "#6161ff",
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,
    },
  },
}));

export function Header({
  setOpenModal,
}: // handleScroll,
{
  setOpenModal: (openModal: boolean) => void;
  handleScroll: () => void;
}) {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          🇸🇬 2024 Tech{" "}
          <Text component="span" className={classes.highlight} inherit>
            Internships
          </Text>{" "}
          🇸🇬
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Access and share the latest <b>summer/offcycle 2024</b> software
            engineering and other tech internship opportunities in Singapore!
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            component="a"
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
            leftIcon={<img src={Plus} />}
            onClick={() => setOpenModal(true)}
            style={{ backgroundColor: "#6161ff", color: "white" }}
          >
            Add Opportunity
          </Button>
          <Button
            component="a"
            href="https://github.com/kxrt/Singapore-Summer2024-TechInternships"
            target="_blank"
            rel="noreferrer"
            size="lg"
            variant="default"
            className={classes.control}
            leftIcon={<img src={GitHubIcon} />}
          >
            GitHub
          </Button>
          <div>
            <Indicator
              inline
              label="Coming soon!"
              color="gray"
              position="top-center"
              size="xs"
            >
              <Button
                component="a"
                size="lg"
                variant="default"
                className={classes.control}
                disabled
              >
                Process Tracking
              </Button>
            </Indicator>
          </div>
        </div>
      </div>
    </Container>
  );
}
