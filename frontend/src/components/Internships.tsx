import axios from "axios";
import { useEffect, useState } from "react";
import { InternshipList } from "./InternshipList";

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

  useEffect(() => {
    axios.get("/api/internships").then((response) => {
      console.log(response);
      setSummerInternships(response.data.data.summer);
      setOffcycleInternships(response.data.data.offcycle);
    });
  }, []);

  return (
    <>
      <InternshipList internships={summerInternships} title="Summer" />
      <InternshipList internships={offcycleInternships} title="Offcycle" />
    </>
  );
}
