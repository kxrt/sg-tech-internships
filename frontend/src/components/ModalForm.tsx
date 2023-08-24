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
            <div className="form-input-group">
              <div className="form-radio-group">
                <label htmlFor="isSummer">Summer</label>
                <input
                  type="radio"
                  id="isSummer"
                  name="isSummer"
                  value="true"
                  className="form-input"
                  defaultChecked
                />
              </div>
              <div className="form-radio-group">
                <label htmlFor="isSummer">Off-Cycle</label>
                <input
                  type="radio"
                  id="isSummer"
                  name="isSummer"
                  value="false"
                  className="form-input"
                />
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
