import { useContext, useState } from 'react';
import { PopOutIcon } from '../icons';
import { 
  PanelTitle, 
  AuthButton, 
  AuthButtonText 
} from '../styles';
import About from './About';
import ViewLog from './ViewLog';

import env from '../env';
import { observer } from 'mobx-react-lite';
import state from '../contexts/state';
import { State } from '../types/ceremony';

const AboutPanel = observer((props: any) => {
  const { ceremony } = useContext(state) as State;
  // TODO Use state.ui?
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {setModalOpen(false)};
  const openModal = () => {
    setModalOpen(true);
  }

  const { project, authenticated } = ceremony;

  const leftPanel = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '50px',
      marginBottom: '50px',
      marginRight: '8xp',
    }}>
      <PanelTitle>{`about ${project || env.projectName}`}</PanelTitle>
      {  }
      <div style={{ display: 'flex' }}>
        <AuthButton
          onClick={openModal}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AuthButtonText>
              Read More
            </AuthButtonText>
            <div style={{ width: '24px' }} />
            {PopOutIcon}
          </div>
        </AuthButton>
      </div>
    </div>
  )

  const aboutModal = (modalOpen) ?
    <ViewLog
      open={modalOpen}
      close={closeModal}
      content={(<About isParticipant={authenticated()} />)}
      title={`About the ${project || env.projectName} trusted setup`} />
  :
    (<></>);

  return (
    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
      {leftPanel}
      <div style={{ flex: 1, height: '1px', minWidth: '0px', maxWidth: '264px' }} />
      {aboutModal}
    </div>
  );
});

export default AboutPanel;
