import { create } from "zustand";
import { Internship, InternshipWithStatus, Status, Statuses } from "../types";

interface InternshipState {
    summerInternships: InternshipWithStatus[];
    offcycleInternships: InternshipWithStatus[];
    setInternships: (internships: {
        summer: Internship[];
        offcycle: Internship[];
    }) => void;
    updateStatus: (internship_id: string, status: Status[]) => void;
    updateStatuses: (statuses: Statuses) => void;
}

export const useInternshipStore = create<InternshipState>((set) => ({
    summerInternships: [],
    offcycleInternships: [],
    setInternships: (internships) =>
        set(() => {
            return {
                summerInternships: internships.summer.map((internship) => {
                    const newInternship: InternshipWithStatus = {
                        ...internship,
                        status: [],
                    };
                    return newInternship;
                }),
                offcycleInternships: internships.offcycle.map((internship) => {
                    const newInternship: InternshipWithStatus = {
                        ...internship,
                        status: [],
                    };
                    return newInternship;
                }),
            };
        }),
    updateStatus: (internship_id, status) =>
        set((state) => {
            const newSummerInternships = [...state.summerInternships];
            for (const internship of newSummerInternships) {
                if (internship.internship_id == internship_id) {
                    internship.status = status;
                    return { summerInternships: newSummerInternships };
                }
            }
            const newOffcycleInternships = [...state.offcycleInternships];
            for (const internship of newOffcycleInternships) {
                if (internship.internship_id == internship_id) {
                    internship.status = status;
                    return { offcycleInternships: newOffcycleInternships };
                }
            }
            return state;
        }),
    updateStatuses: (statuses: Statuses) =>
        set((state) => {
            const newSummerInternships = [...state.summerInternships];
            for (const internship of newSummerInternships) {
                if (statuses[internship.internship_id]) {
                    internship.status = statuses[internship.internship_id];
                }
            }
            const newOffcycleInternships = [...state.offcycleInternships];
            for (const internship of newOffcycleInternships) {
                if (statuses[internship.internship_id]) {
                    internship.status = statuses[internship.internship_id];
                }
            }
            return {
                summerInternships: newSummerInternships,
                offcycleInternships: newOffcycleInternships,
            };
        }),
}));
