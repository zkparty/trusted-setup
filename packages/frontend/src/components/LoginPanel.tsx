import {
  WelcomeTitle,
  SubtleBody,
  NormalBodyText,
} from "../styles";
import Login from './Login';
import env from '../env';
import { Tooltip, Button } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import state from "../contexts/state";
import { State } from "../types/ceremony";

const LoginPanel = observer((props: any) => {
  const [name, setName] = useState('');
  const { ui, ceremony } = useContext(state) as State;

  return (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px'
    }} >
    <WelcomeTitle>{env.projectName}</WelcomeTitle>
    <div style={{ height: '41px' }} />
    <SubtleBody style={{ textAlign: 'center' }}>
      {`Trusted Setup Ceremony`}
    </SubtleBody>
    <NormalBodyText style={{ marginTop: '8px' }}>
      {`Join ceremony`}
    </NormalBodyText>
    <NormalBodyText style={{ marginTop: '8px' }}>
      <div>
        <Tooltip title="This name will be permanently associated with this contribution. Choose anything you like, it doesn't have to be unique.">
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="contributor name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ width: '4px' }} />
          </div>
        </Tooltip>
      </div>
      {/*`The ceremony is not currently accepting contributions.`*/}  
    </NormalBodyText> 
    <Login onClick={() => ceremony.join(name)}/>
  </div>);
});

export default LoginPanel;
