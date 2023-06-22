import { useContext } from 'react';
import {
  AuthButton,
  WelcomeTitle,
  SubtleBody,
} from "../styles";
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';
import { State } from '../types/ceremony'

const Acknowledge = ({ contribute }: { contribute: () => void}) =>
  (<div style={{ display: 'grid', marginTop: '78px' }}>
    <AuthButton onClick={contribute}>
      Launch Ceremony
    </AuthButton>
   </div>);

const WelcomePanel = observer((props: any) => {
  const { ceremony } = useContext(state) as State;
  const handleClick = () => {
    ceremony.auth();
  }

  const isRunning = true;

  return (
  <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
    <WelcomeTitle>Welcome.</WelcomeTitle>
    <div style={{ height: '41px' }} />
    {isRunning ? 
      (
        <div>
          <SubtleBody style={{ textAlign: 'center' }}>
            {`Thank you for joining us for our trusted setup ceremony!`}
          </SubtleBody>
          <SubtleBody style={{ textAlign: 'center' }}>
            {`Ready to make your contribution?`}
          </SubtleBody>
          <Acknowledge contribute={handleClick} />
          <div style={{ height: '41px' }} />
          {
            /*<SubtleBody style={{ textAlign: 'center', color: '#aa0000' }}>
            {`Please note: Zkopru has no token and there won't be an airdrop to trusted setup participants`}
            </SubtleBody>
          */
          }
        </div>
      ) : (
        <SubtleBody style={{ textAlign: 'center' }}>
          {`Our ceremony has ended. Stay tuned for an update.`}
        </SubtleBody>
      )
    }
  </div>);
});

export default WelcomePanel;
