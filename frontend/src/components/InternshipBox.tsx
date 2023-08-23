import { Internship } from "./Internships";

export function InternshipBox({ internship }: { internship: Internship }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "40%",
          paddingBlock: "0.5%",
          paddingInline: "2%",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          e.currentTarget.style.border = "1px solid #6161ff";
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          e.currentTarget.style.border = "1px solid #e0e0e0";
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            whiteSpace: "nowrap",
            width: "80%",
            transition: "0.2s",
          }}
        >
          <p style={{ fontWeight: "600" }}>{internship.company}</p>
          <p
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "70%",
              textAlign: "left",
            }}
          >
            {internship.role}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <button
            onClick={() => {
              window.open(internship.link, "blank");
            }}
            style={{
              boxShadow: "0px 10px 15px rgba(97, 97, 255, 0.3)",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
