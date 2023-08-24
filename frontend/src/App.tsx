import { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/HeroHeader";
import { Internships } from "./components/Internships";
import { ModalForm } from "./components/ModalForm";

function App() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      {openModal && <ModalForm setOpenModal={setOpenModal} />}
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
