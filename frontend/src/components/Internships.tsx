import axios from "axios";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import InternshipList from "./InternshipList";
import { useAuthStore } from "../stores/AuthStore";
import { Category, Internship, STATUSES, Statuses } from "../types";
import { toast } from "react-toastify";

export function Internships({
    reference,
    category,
}: {
    reference?: React.MutableRefObject<HTMLDivElement | null> | null;
    category: Category;
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
        } else if (sortBy == "My Applications") {
            const sortByStatus = (a: Internship, b: Internship) => {
                const aLen = statuses[a.internship_id]?.length || 0;
                const bLen = statuses[b.internship_id]?.length || 0;
                if (aLen > 0 && bLen > 0) {
                    return (
                        STATUSES.indexOf(statuses[b.internship_id][bLen - 1]) -
                        STATUSES.indexOf(statuses[a.internship_id][aLen - 1])
                    );
                } else if (aLen > 0 && bLen == 0) {
                    return -1;
                } else if (bLen > 0 && aLen == 0) {
                    return 1;
                }
                return 0;
            };
            setSummerInternships(summerInternshipsCopy.sort(sortByStatus));
            setOffcycleInternships(offcycleInternshipsCopy.sort(sortByStatus));
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
                    <option value="My Applications">My Applications</option>
                </select>
            </div>
            {category == "Offcycle" ? (
                <InternshipList
                    internships={offcycleInternships}
                    statuses={statuses}
                    searchQuery={searchQuery}
                    title="Offcycle"
                    reference={reference}
                />
            ) : (
                <InternshipList
                    internships={summerInternships}
                    statuses={statuses}
                    searchQuery={searchQuery}
                    title="Summer"
                    reference={reference}
                />
            )}
        </>
    );
}
