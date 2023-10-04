import { useMemo, useRef, useState } from "react";
import "./App.css";
import ReactGA from "react-ga4";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/HeroHeader";
import { Internships } from "./components/Internships";
import { ModalForm } from "./components/ModalForm";
import { Footer } from "./components/Footer";

import { AppShell } from "@mantine/core";
import { NavHeader } from "./components/NavHeader";
import AnnoucementModal from "./components/AnnouncementModal";
import { Category } from "./types";

function App() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>("Summer");
    const ref = useRef<null | HTMLDivElement>(null);

    useMemo(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }, []);

    const handleScroll = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <AppShell
                fixed
                header={
                    <NavHeader
                        height={64}
                        curCategory={category}
                        setCategory={setCategory}
                        children={null}
                    />
                }
            >
                {localStorage.getItem("hasViewedAnnouncement") == null && (
                    <AnnoucementModal />
                )}
                {openModal && <ModalForm setOpenModal={setOpenModal} />}
                <Header
                    setOpenModal={setOpenModal}
                    handleScroll={handleScroll}
                />
                <Internships reference={ref} category={category} />
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
            </AppShell>
        </>
    );
}

export default App;
