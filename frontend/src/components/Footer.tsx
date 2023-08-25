import { createStyles, Container, Group, Anchor, rem } from "@mantine/core";
import kxrtLogo from "../assets/kxrt.svg";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(60),
    marginBottom: rem(30),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const links = [
  { link: "mailto:kvrtikeya@gmail.com", label: "Contact" },
  { link: "https://linkedin.com/in/kvrtikeya", label: "LinkedIn" },
  { link: "https://github.com/kxrt", label: "GitHub" },
];

export function Footer() {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a">
      color="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => {
        event.preventDefault();
        window.open(link.link, "_blank");
      }}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <img
          src={kxrtLogo}
          alt="KXRT"
          width={50}
          onClick={() => window.open("https://bit.ly/kvrtikeya", "_blank")}
          style={{ cursor: "pointer" }}
        />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
