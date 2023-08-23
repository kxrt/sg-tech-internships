import { InternshipBox } from "./InternshipBox";
import { Internship } from "./Internships";

export function InternshipList({
  internships,
  title,
}: {
  internships: Internship[];
  title: string;
}) {
  return (
    <>
      <h2 style={{ textAlign: "left" }}>{title}</h2>
      <div className="internship-list">
        {internships.map((internship) => {
          return <InternshipBox internship={internship} />;
        })}
      </div>
    </>
  );
}
