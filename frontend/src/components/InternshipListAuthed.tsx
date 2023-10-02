import { Center, SimpleGrid } from "@mantine/core";
import InternshipBoxAuthed from "./InternshipBoxAuthed";
import { Internship, Statuses } from "./Internships";

const InternshipListAuthed = ({
    internships,
    statuses,
    title,
    searchQuery,
    reference,
}: {
    internships: Internship[];
    statuses: Statuses;
    title: string;
    searchQuery: string;
    reference?: React.MutableRefObject<null | HTMLDivElement> | null;
}) => {
    return (
        <>
            <h2
                style={{ textAlign: "center", fontSize: "28px" }}
                ref={reference}
            >
                {title}
            </h2>
            <Center>
                <SimpleGrid
                    cols={2}
                    spacing="md"
                    sx={{
                        justifyContent: "center",
                    }}
                    w={"90%"}
                    breakpoints={[{ maxWidth: "xs", cols: 1, spacing: "sm" }]}
                >
                    {internships
                        .filter(
                            (internship) =>
                                internship.company
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                internship.role
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                        )
                        .map((internship, idx) => {
                            return (
                                <InternshipBoxAuthed
                                    internship={internship}
                                    key={idx}
                                    status={
                                        statuses[internship.internship_id]
                                            ? statuses[internship.internship_id]
                                            : []
                                    }
                                />
                            );
                        })}
                </SimpleGrid>
            </Center>
        </>
    );
};

export default InternshipListAuthed;
