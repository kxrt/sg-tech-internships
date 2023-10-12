import axios from "axios";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import InternshipList from "./InternshipList";
import { useAuthStore } from "../stores/AuthStore";
import { Category, SortBy } from "../types";
import { toast } from "react-toastify";
import { useInternshipStore } from "../stores/InternshipStore";
import { useSearchParams } from "react-router-dom";
import { getLastUpdated, sortInternships } from "../utils/InternshipUtils";
import { Box, Center, Select } from "@mantine/core";

export function Internships({
    reference,
}: {
    reference?: React.MutableRefObject<HTMLDivElement | null> | null;
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const user = useAuthStore((state) => state.user);
    const newSummerInternships = useInternshipStore(
        (state) => state.summerInternships
    );
    const newOffcycleInternships = useInternshipStore(
        (state) => state.offcycleInternships
    );
    const setInternships = useInternshipStore((state) => state.setInternships);
    const updateStatuses = useInternshipStore((state) => state.updateStatuses);
    const [searchParams, setSearchParams] = useSearchParams();

    // run once on first render
    useEffect(() => {
        // get list of internship positions
        axios
            .get("/api/internships")
            .then((response) => {
                setInternships(response.data.data);
            })
            .catch(() => {
                toast.error("Error retrieving internships", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // get user statuses if authenticated
    useEffect(() => {
        const getStatuses = async () => {
            if (user) {
                const token = await user.getIdToken();
                axios
                    .get("/api/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => JSON.parse(response.data.data))
                    .then((res) => {
                        updateStatuses(res.statuses);
                    })
                    .catch(() => {
                        toast.error("Error retrieving statuses", {
                            position: "bottom-right",
                            autoClose: 2000,
                        });
                    });
            }
        };
        getStatuses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <Box pt={"lg"}>
                Last updated:{" "}
                {getLastUpdated(newSummerInternships, newOffcycleInternships)}
            </Box>
            <Center pt={"lg"}>
                <Select
                    label="Sort By"
                    searchable
                    size="md"
                    nothingFound="No options"
                    defaultValue={"date"}
                    data={[
                        { value: "date", label: "Most Recent" },
                        { value: "company-name", label: "A-Z" },
                        { value: "status", label: "My Applications" },
                    ]}
                    value={searchParams.get("sort-by") || "date"}
                    onChange={(value: Category) => {
                        const updatedSearchParams = new URLSearchParams(
                            searchParams.toString()
                        );
                        updatedSearchParams.set("sort-by", value);
                        setSearchParams(updatedSearchParams.toString());
                    }}
                    sx={{
                        input: { "&:hover": { border: "2px solid #6161ff" } },
                    }}
                />
            </Center>
            {searchParams.get("category") == "Offcycle" ? (
                <InternshipList
                    internships={sortInternships(
                        newOffcycleInternships,
                        searchParams.get("sort-by") as SortBy | null
                    )}
                    searchQuery={searchQuery}
                    title="Offcycle"
                    reference={reference}
                />
            ) : (
                <InternshipList
                    internships={sortInternships(
                        newSummerInternships,
                        searchParams.get("sort-by") as SortBy | null
                    )}
                    searchQuery={searchQuery}
                    title="Summer"
                    reference={reference}
                />
            )}
        </>
    );
}
