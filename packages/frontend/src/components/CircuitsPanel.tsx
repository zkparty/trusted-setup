import * as React from 'react';
import { useState, useEffect, useContext, } from "react";
import {
    NormalBodyText,
    PanelTitle,
  } from "../styles";
import CircuitsTable from './CircuitsTable';
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';
import { State } from '../types/ceremony';

const tableText = (isLoggedIn: boolean, circuitLength: number) => {
  return (
    isLoggedIn ?
     (`Your participation in the ceremony involves contributing a computation
     to ${circuitLength} different circuits. More complex circuits take longer
     to run and you may have to wait if someone before you is completing a computation.
      Your hash is the signature of your contribution.`
     )
    :
     (`All participants will contribute a computation to ${circuitLength} different circuits. There is no limit
     to the number of contributions each circuit can accept - The more the merrier!
     Participants receive a hash for each completed circuit, which acts as a signature of
     their contribution`)
  );
}

const CircuitsPanel = observer(() => {
  const { ceremony } = useContext(state) as State;
  const [viewWidth, setViewWidth] = useState(window.innerWidth);

  const { ceremonyState, project, authenticated } = ceremony;
  const { circuitStats } = ceremonyState;

  useEffect(() => {
    const handleResize = () => setViewWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])


  return (
    <div style={{
      alignSelf: viewWidth < 500 ? 'flex-start' : 'center',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '16px',
      marginRight: '16px',
      minWidth: '500px'
    }}>
      <PanelTitle style={{
         paddingBottom: '6px',
        }}>
        {`Circuits`}
      </PanelTitle>
      <NormalBodyText
        style={{
          maxWidth: viewWidth < 800 ? 'calc(100vw - 32px)' : '800px',
          paddingBottom: '64px'
        }}>
        {tableText(authenticated(), circuitStats.length)}
      </NormalBodyText>
      <CircuitsTable />
    </div>
  )
});

export default CircuitsPanel;