import { Button } from "@mantine/core";
import { Internship } from "./Internships";
import { Link } from "react-router-dom";

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
                    <Link
                        to={internship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="cta"
                            className="internship-apply-button"
                        >
                            Apply
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
