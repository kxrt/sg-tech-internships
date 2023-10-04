export type Internship = {
    internship_id: string;
    company: string;
    role: string;
    link: string;
    date_added: string;
    is_summer: boolean;
};

export const STATUSES = [
    "Pending", // client side only
    "Applied",
    "HireVue",
    "HireVue Complete",
    "OA",
    "OA Complete",
    "Interview",
    "Interview Complete",
    "Offer",
    "Accepted",
    "Rejected",
    "Declined",
] as const;

export type Statuses = {
    [internship_id: string]: Status[];
};

export type Status = (typeof STATUSES)[number];

export type Category = "Summer" | "Offcycle";
