import axios from "axios";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import InternshipList from "./InternshipList";
import { useAuthStore } from "../stores/AuthStore";
import { Internship, Statuses } from "../types";
import { toast } from "react-toastify";

export function Internships({
    reference,
}: {
    reference?: React.MutableRefObject<HTMLDivElement | null> | null;
}) {
    const [summerInternships, setSummerInternships] = useState<Internship[]>(
        []
    );
    const [offcycleInternships, setOffcycleInternships] = useState<
        Internship[]
    >([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("A-Z");
    const [statuses, setStatuses] = useState<Statuses>({});
    const user = useAuthStore((state) => state.user);

    // run once on first render
    useEffect(() => {
        // get list of internship positions
        axios.get("/api/internships").then((response) => {
            setSummerInternships(response.data.data.summer);
            setOffcycleInternships(response.data.data.offcycle);
            setSortBy("Date");
        });
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
                        setStatuses(res.statuses);
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
    }, [user]);

    // set last updated date
    useEffect(() => {
        // prevent failure on first render
        if (summerInternships.length == 0 || offcycleInternships.length == 0)
            return;

        // get list of dates added
        const date: Date = summerInternships
            .map((internship) => new Date(internship.date_added))
            .concat(
                offcycleInternships.map(
                    (internship) => new Date(internship.date_added)
                )
            )
            // get latest update
            .reduce((acc, date) => (acc > date ? acc : date));
        setLastUpdated(
            new Intl.DateTimeFormat("en-SG", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }).format(date)
        );
    }, [summerInternships, offcycleInternships]);

    // sort by date or A-Z
    useEffect(() => {
        const summerInternshipsCopy = [...summerInternships];
        const offcycleInternshipsCopy = [...offcycleInternships];
        if (sortBy == "Date") {
            setSummerInternships(
                summerInternshipsCopy.sort(
                    (a, b) =>
                        new Date(b.date_added).getTime() -
                        new Date(a.date_added).getTime()
                )
            );
            setOffcycleInternships(
                offcycleInternshipsCopy.sort(
                    (a, b) =>
                        new Date(b.date_added).getTime() -
                        new Date(a.date_added).getTime()
                )
            );
        } else if (sortBy == "A-Z") {
            setSummerInternships(
                summerInternshipsCopy.sort((a, b) =>
                    a.company.localeCompare(b.company)
                )
            );
            setOffcycleInternships(
                offcycleInternshipsCopy.sort((a, b) =>
                    a.company.localeCompare(b.company)
                )
            );
        }
        // prevent infinite loop of updates
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    return (
        <>
            <div className="top-interactive">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>
            <div>Last updated: {lastUpdated}</div>

            <div className="landing-select-group">
                <label htmlFor="sortBy">Sort By</label>
                <select
                    className="landing-select"
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy}
                >
                    <option value="Date">Most Recent</option>
                    <option value="A-Z">A-Z</option>
                </select>
            </div>
            <InternshipList
                internships={summerInternships}
                statuses={statuses}
                searchQuery={searchQuery}
                title="Summer"
                reference={reference}
            />
            <InternshipList
                internships={offcycleInternships}
                statuses={statuses}
                searchQuery={searchQuery}
                title="Offcycle"
                reference={reference}
            />
        </>
    );
}
