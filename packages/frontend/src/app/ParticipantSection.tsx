import { useContext, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";

import { State } from "../types/ceremony";

import WelcomePanel from "../components/WelcomePanel";
import ProgressPanel from "../components/ProgressPanel";
import LoginPanel from "../components/LoginPanel";
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';


const stepText = (step: string) => (<Typography align="center">{step}</Typography>);

const ParticipantSection = observer(() => {
  const { ceremony } = useContext(state) as State;

  const { authenticated, inQueue } = ceremony;

  let content = (<></>);
  if (!authenticated) {
    content = (<LoginPanel />);
  } else if (!inQueue) {
    // Display welcome text until the 'go ahead' button is clicked.
    content = (<WelcomePanel />);
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