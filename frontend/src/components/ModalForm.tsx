import axios from "axios";
import { toast } from "react-toastify";

export function ModalForm({
  setOpenModal,
}: {
  setOpenModal: (openModal: boolean) => void;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const company = formData.get("company");
    const role = formData.get("role");
    const link = formData.get("link");
    const is_summer = formData.get("isSummer")?.toString() === "true";

    axios
      .post("/api/internships", {
        company,
        role,
        link,
        is_summer,
      })
      .then(() => {
        setOpenModal(false);
        toast.success("Submitted!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setOpenModal(false)}>
            &times;
          </span>
          <p>
            Submitting this form will create a request on GitHub to add an
            opportunity to the list below. Processing may take a few hours.
          </p>
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-input"
                required
                placeholder="eg. NUS"
              />
            </div>
            <div className="form-input-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                className="form-input"
                required
                placeholder="eg. Software Engineer Intern"
              />
            </div>
            <div className="form-input-group">
              <label htmlFor="link">Link</label>
              <input
                type="url"
                id="link"
                name="link"
                className="form-input"
                required
                placeholder="https://"
              />
            </div>
            <div className="form-select-group">
              <label htmlFor="isSummer">Type</label>
              <select name="isSummer" id="isSummer" className="form-select">
                <option
                  value=""
                  disabled
                  selected
                  hidden
                  style={{ color: "gray" }}
                >
                  Select
                </option>
                <option value="true">Summer</option>
                <option value="false">Off-Cycle</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
