import { InternshipWithStatus, STATUSES, SortBy } from "../types";

export const sortInternships = (
    internships: InternshipWithStatus[],
    sortBy: SortBy | null
): InternshipWithStatus[] => {
    const sortedInternships = [...internships];
    if (sortBy == null || sortBy == "date") {
        sortedInternships.sort(
            (a, b) =>
                new Date(b.date_added).getTime() -
                new Date(a.date_added).getTime()
        );
    } else if (sortBy == "company-name") {
        sortedInternships.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sortBy == "status") {
        sortedInternships.sort((a, b) => {
            if (a.status.length > 0 && b.status.length > 0) {
                // if both have non-pending statuses, sort them by the hierachy of the most updated status
                return (
                    STATUSES.indexOf(b.status[b.status.length - 1]) -
                    STATUSES.indexOf(a.status[a.status.length - 1])
                );
            } else if (a.status.length > 0 && b.status.length == 0) {
                return -1;
            } else if (b.status.length > 0 && a.status.length == 0) {
                return 1;
            }
            return 0;
        });
    }
    return sortedInternships;
};

export const getLastUpdated = (
    summerInternships: InternshipWithStatus[],
    offcycleInternships: InternshipWithStatus[]
): string => {
    if (summerInternships.length == 0 || offcycleInternships.length == 0)
        return "";

    // get list of dates added
    const date: Date = summerInternships
        .concat(offcycleInternships)
        .map((internship) => new Date(internship.date_added))
        // get latest update
        .reduce((acc, date) => (acc > date ? acc : date));
    return new Intl.DateTimeFormat("en-SG", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(date);
};
