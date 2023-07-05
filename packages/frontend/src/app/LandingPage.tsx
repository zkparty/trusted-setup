import { useContext } from "react";
import ButtonAppBar from "../components/ButtonAppBar";
import ParticipantSection from "./ParticipantSection";

import {
  PageContainer,
} from "../styles";
//import AddCeremonyPage from "./AddCeremony";
import { CeremonyPage } from "./CeremonyPage";
import Footer from './../components/Footer';
import AboutPanel from './../components/AboutPanel';
import './styles.css';
import { Box, Modal } from '@mui/material';
import CircuitsPanel from "../components/CircuitsPanel";
import state from '../contexts/state';
import { State } from "../types/ceremony";
import { observer } from "mobx-react-lite";
import { SnackbarProvider } from "notistack";

export const LandingPage = observer(() => {
    const { ui } = useContext(state) as State;

    return (
      <SnackbarProvider maxSnack={5} preventDuplicate>
        <ButtonAppBar />
        <PageContainer>
          <Box style={{ height: '608px' }} >
            <ParticipantSection />
          </Box>
          <AboutPanel />
          <div style={{ height: '140px' }} />
          <CircuitsPanel  />
          <Modal
            open={ui.openModal}
            onClose={ui.closeModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {(<CeremonyPage onClose={ui.closeModal} />)}
          </Modal>
        </PageContainer>
        <Footer />
      </SnackbarProvider>
  );
});
