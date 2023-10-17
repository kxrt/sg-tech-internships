import { Center, TextInput } from "@mantine/core";

export function SearchBar({
    searchQuery,
    setSearchQuery,
}: {
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
}) {
    return (
        <Center>
            <TextInput
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                size="md"
                w={"50%"}
                sx={{ input: { "&:hover": { border: "2px solid #6161ff" } } }}
            />
        </Center>
    );
}
