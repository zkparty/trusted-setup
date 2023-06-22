import { useContext } from 'react';
import {
  textColor,
  inverseText,
  accentColor,
  background,
  secondAccent,
  lighterBackground,
} from "../styles";
import styled from "styled-components";
import TwitterIcon from '@material-ui/icons/Twitter';
import { observer } from "mobx-react-lite";
import { State } from '../types/ceremony';
import state from '../contexts/state';

const StyledAccentButton = styled.a`
  color: ${inverseText};
  background-color: ${accentColor};
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  border-radius: 4px;
  width: 350px;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 32px;
  text-decoration: none;
`

const StyledButton = styled.a`
  color: ${textColor};
  background: ${lighterBackground};
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  border-radius: 4px;
  width: 216px;
  height: 53px;
  align-items: center;
  display: grid;
  justify-content: center;
  text-decoration: none;
`

const tweetText = (settings: any, url: string): string => {
  const EOL = '\n';
  const body = encodeURIComponent(settings.tweetTemplate.replace('{URL}', url).replaceAll('{EOL}', EOL));

  return `https://twitter.com/intent/tweet?text=${body}`;
}


const AttestationPanel = observer((props: any) => {
  const { ceremony } = useContext(state) as State;
  const { contributionText, project } = ceremony;

  let text=(<></>);
  if (project) {
    if (contributionText()) {
      text = (
        <div style={{ display: 'flex' }}>
          <StyledAccentButton
            href={tweetText(ceremony.project, contributionText())} target='twitter' >
                <TwitterIcon fontSize='large' />
                Share your attestation
          </StyledAccentButton>
          <StyledButton href={contributionText()} target='attestation' >
            View your summary
          </StyledButton>
        </div>
      );
    } else {
      text = (<div style={{ textAlign: 'left' }}>
          Your attestation details have been copied to the clipboard. Please
          paste them to a public gist. &nbsp;
          <a href='https://gist.github.com' 
            target='attestation' 
            style={{ color: 'lightseagreen' }} 
          >Click here</a> to create your gist (opens a new tab).
        </div>);
    }
  }

  return (
    <div style={{ textAlign: 'center' }} >
    {text}
    </div>
  );
});

export default AttestationPanel;
