import { useContext, useEffect, useRef } from "react";
import { Typography } from "@mui/material";

import { State } from "../types/ceremony";

import WelcomePanel from "../components/WelcomePanel";
import ProgressPanel from "../components/ProgressPanel";
import LoginPanel from "../components/LoginPanel";
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from "notistack";


const stepText = (step: string) => (<Typography align="center">{step}</Typography>);

const ParticipantSection = observer(() => {
  const { ceremony } = useContext(state) as State;
  const { enqueueSnackbar } = useSnackbar();

  const { inQueue, loadingInitial, contributionHashes, authenticated } = ceremony;

  const statusUpdate = (message: string) => {
    enqueueSnackbar(message);
  };

  const { contributionUpdates } = ceremony;
  if (contributionUpdates.length > 0) {
    statusUpdate(contributionUpdates[contributionUpdates.length - 1]);
  }


  let content = (<></>);
  if (loadingInitial || !authenticated ) {
    // Display welcome text until the 'go ahead' button is clicked.
    content = (<WelcomePanel />);
  } else if (!inQueue && !(contributionHashes?.length>0)) {
    content = (<LoginPanel />);
  } else {
    content = (<ProgressPanel />);
  };

  return (
    <div>
      {content}
    </div>
  );
});

export default ParticipantSection;