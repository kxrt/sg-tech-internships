import { InternshipBox } from "./InternshipBox";
import { Internship } from "./Internships";

export function InternshipList({
  internships,
  title,
  searchQuery,
  reference,
}: {
  internships: Internship[];
  title: string;
  searchQuery: string;
  reference?: React.MutableRefObject<null | HTMLDivElement> | null;
}) {
  return (
    <>
      <h2 style={{ textAlign: "center", fontSize: "28px" }}>{title}</h2>
      <div className="internship-list" ref={reference}>
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
