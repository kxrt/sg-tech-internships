import axios from "axios";
import { useEffect, useState } from "react";
import { InternshipList } from "./InternshipList";
import { SearchBar } from "./SearchBar";

export type Internship = {
  company: string;
  role: string;
  link: string;
  date_added: string;
};

export function Internships({
  reference,
}: {
  reference?: React.MutableRefObject<HTMLDivElement | null> | null;
}) {
  const [summerInternships, setSummerInternships] = useState<Internship[]>([]);
  const [offcycleInternships, setOffcycleInternships] = useState<Internship[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // run once on first render
  useEffect(() => {
    // get list of internship positions
    axios.get("/api/internships").then((response) => {
      setSummerInternships(response.data.data.summer);
      setOffcycleInternships(response.data.data.offcycle);
    });
  }, []);

  // set last updated date
  useEffect(() => {
    // prevent failure on first render
    if (summerInternships.length == 0 || offcycleInternships.length == 0)
      return;

    // get list of dates added
    const date: Date = summerInternships
      .map((internship) => new Date(internship.date_added))
      .concat(
        offcycleInternships.map((internship) => new Date(internship.date_added))
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

  return (
    <>
      <div className="top-interactive">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div>Last updated: {lastUpdated}</div>
      <InternshipList
        internships={summerInternships}
        searchQuery={searchQuery}
        title="Summer"
      />
      <br />
      <InternshipList
        internships={offcycleInternships}
        searchQuery={searchQuery}
        title="Offcycle"
        reference={reference}
      />
    </>
  );
}
