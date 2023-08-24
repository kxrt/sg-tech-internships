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

export function Internships() {
  const [summerInternships, setSummerInternships] = useState<Internship[]>([]);
  const [offcycleInternships, setOffcycleInternships] = useState<Internship[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios.get("/api/internships").then((response) => {
      setSummerInternships(response.data.data.summer);
      setOffcycleInternships(response.data.data.offcycle);
    });
  }, []);

  return (
    <>
      <div className="top-interactive">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
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
      />
    </>
  );
}
