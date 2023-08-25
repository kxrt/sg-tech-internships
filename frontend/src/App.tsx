import { useMemo, useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga4";
import { Header } from "./components/HeroHeader";
import { Internships } from "./components/Internships";
import { ModalForm } from "./components/ModalForm";

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);

function App() {
  const [openModal, setOpenModal] = useState<boolean>(false);

  useMemo(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const handleOpenModal = (value: boolean) => {
    setOpenModal(value);
    ReactGA.send({
      hitType: "event",
      eventCategory: "Click",
      eventAction: "Open Modal",
    });
  };

  return (
    <>
      {openModal && <ModalForm setOpenModal={handleOpenModal} />}
      <Header setOpenModal={setOpenModal} />
      <Internships />
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
