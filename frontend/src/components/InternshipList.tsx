import { InternshipBox } from "./InternshipBox";
import { Internship } from "./Internships";

export function InternshipList({
  internships,
  title,
  searchQuery,
}: {
  internships: Internship[];
  title: string;
  searchQuery: string;
}) {
  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <div className="internship-list">
        {internships
          .filter(
            (internship) =>
              internship.company
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((internship, idx) => {
            return <InternshipBox internship={internship} key={idx} />;
          })}
      </div>
    </>
  );
}
