import { Internship } from "./Internships";

export function InternshipBox({ internship }: { internship: Internship }) {
  return (
    <>
      <div
        className="internship-box"
        onClick={() => {
          window.open(internship.link, "blank");
        }}
      >
        <h3>{internship.company}</h3>
        <p>
          {internship.role.slice(0, 40)}
          {internship.role.length > 39 ? "..." : ""}
        </p>
        <a href={internship.link} target="_blank" rel="noreferrer">
          <p>Apply</p>
        </a>
        <p>{internship.date_added}</p>
      </div>
    </>
  );
}
