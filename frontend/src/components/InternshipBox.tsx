import { Internship } from "./Internships";

export function InternshipBox({ internship }: { internship: Internship }) {
  return (
    <>
      <div className="internship-box-wrapper">
        <div className="internship-box-left">
          <p style={{ fontWeight: 600 }}>{internship.company}</p>
          <p className="internship-role">{internship.role}</p>
        </div>
        <div className="internship-box-right">
          <button disabled className="internship-date">
            {internship.date_added.slice(0, 6)}
          </button>
          <button
            className="internship-apply-button"
            onClick={() => {
              window.open(internship.link, "blank");
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
