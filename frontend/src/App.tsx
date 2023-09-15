import { useMemo, useRef, useState } from "react";
import "./App.css";
import ReactGA from "react-ga4";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/HeroHeader";
import { Internships } from "./components/Internships";
import { ModalForm } from "./components/ModalForm";
import { Footer } from "./components/Footer";
import UserMenu from "./components/UserMenu";

function App() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const ref = useRef<null | HTMLDivElement>(null);

    useMemo(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }, []);

    const handleScroll = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {openModal && <ModalForm setOpenModal={setOpenModal} />}
            <UserMenu />
            <Header setOpenModal={setOpenModal} handleScroll={handleScroll} />
            <Internships reference={ref} />
            <Footer />
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
