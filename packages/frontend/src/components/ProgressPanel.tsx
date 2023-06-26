import { Box, Grid, LinearProgress, LinearProgressProps, Typography } from '@material-ui/core';
import { useContext } from 'react';
import {
  accentColor,
  secondAccent,
  textColor,
  PageContainer,
  lighterBackground,
  NormalBodyText,
  SubtleBody,
  subtleText,
  darkerBackground,
} from "../styles";
import { Player } from '@lottiefiles/react-lottie-player';
import styled from 'styled-components';
import VisibilitySensor from 'react-visibility-sensor-v2';
import AttestationPanel from './AttestationPanel';
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';
import { State, Queue } from '../types/ceremony';

const StyledHeader = styled.div`
  font-family: Inconsolata;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 140%;
  /* or 67px */

  display: flex;
  align-items: flex-end;

  /* Primary / Buttons */

  color: ${accentColor};
`

interface ProgressBarProps extends LinearProgressProps {
  $barcolor?: string,
  $size?: string,
}

const StyledProgressBar = styled(LinearProgress)<ProgressBarProps>`
  padding-top: ${ ({$size}) => {return ($size === 'small') ? '0px' : '5px';} }; 
  border-radius: 20px; 
  background-color: ${darkerBackground};
  border: 2px solid ${darkerBackground};
  width: ${ ({$size}) => { 
    if ($size === 'normal') return '491px'; 
    else return 'default' } }; 

  & > .MuiLinearProgress-barColorPrimary {
    border-radius: 20px;
    background-color: ${({$barcolor: barColor}) => barColor || accentColor};
    border-color: ${({$barcolor: barColor}) => barColor || accentColor};
  }

  &.MuiLinearProgress-root.MuiLinearProgress-colorPrimary {
    background-color: ${darkerBackground};
  }
`;

const stepText = (inQueue: boolean, contributing: boolean): string => {
  if (inQueue) {
    return "Waiting"
  } else if (contributing) {
    return "Computing"
  } else {
    return "Preparing"
  }
}

const queueText = (queue: number) => {
  if (queue > 1) {
    return `No. ${queue} in line`;
  } else if (queue == 1) {
    return 'Next in line';
  } else {
    return 'Your turn';
  } 
}

const queueStatus = (queueLength: number) => {
  let dots = '';
  try {
    dots = ' .'.repeat(Math.max(queueLength, 0));
  } catch (err) {
    if (err instanceof Error)
    console.warn(`Wait queue error: ${err.message}`);
  }
  return (
    <div>
      <NormalBodyText>{queueText(queueLength)}</NormalBodyText>
      <div style={{ color: accentColor, textAlign: 'right' }}>{dots}</div>
    </div>
  );
};

interface ProgressProps {
  progressPct: number,
}

export const CeremonyProgress = observer((props: any) => {
  const { ceremony } = useContext(state) as State;
  const { ceremonyState, contributionUpdates, inQueue, contributing } = ceremony;
  const cctCount = ceremonyState?.circuitStats?.length;
  const cctNum = contributionUpdates?.length;
  const ceremonyPct = (cctCount>0) ? 100 * cctNum / cctCount : 0;
  const { format } = props;

  const prefix = (format && format === 'bar') ?
    (<NormalBodyText style={{ paddingRight: '20px' }} >
      {`C${cctNum} ${stepText(inQueue, contributing)}`}
    </NormalBodyText>)
    :
    (<></>);

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1} style={{ display:'flex', flexDirection:'row', alignItems:'center' }} >
        {prefix}
        <StyledProgressBar 
          variant="determinate" 
          value={ceremonyPct} 
          $size="normal"
          $barcolor={(inQueue) ? subtleText : accentColor}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" style={{ color: subtleText }}>{`${Math.round(
            ceremonyPct
          )}%`}</Typography>
      </Box>
    </Box>
  );
});

const StepProgress = observer(() => {
  const { ceremony } = useContext(state) as State;
  const cctNum = ceremony.contributionHashes.length;
  const cctCount = ceremony.ceremonyState?.circuitStats.length;
  const progressPct = cctNum / cctCount * 100;
  return (
    <StyledProgressBar variant="determinate" value={progressPct} $size='small' />
  );
});

const Animation = () => {
  return (
    <Player autoplay
      loop
      src='./38853-circular-lines-02.json' 
      style={{ height: '419px', width: '423px' }}
      background='transparent'
    >
    </Player>
  );
}

const status = (ceremony: Queue) => {
  const { ceremonyState, queueLength, contributionHashes, contributionUpdates, inQueue, contributing } = ceremony;
  const cctNum = contributionHashes?.length;
  const cctCount = ceremonyState?.circuitStats?.length;
  let header = '';
  let body1 = (<></>);
  let body2 = (<></>);
  if (cctNum >= cctCount) {
    header = 'Contribution Complete.';
    body1 = (
      <div>
        <NormalBodyText>
        You've successfully contributed to {cctCount} circuits.
        </NormalBodyText>
        <br />
        <NormalBodyText>
        Thank you for participating!
        </NormalBodyText>
      </div>);
    body2 = (<AttestationPanel style={{ marginTop: '80px' }}/>);
  } else {
    let statusCell = (<></>);
    if (inQueue) {
      header = 'You are in line.';
      statusCell = queueStatus(queueLength);
    } else if (contributing) {
      header = 'Contribution Active.';
      statusCell = (
        <div>
          {contributionUpdates ? contributionUpdates[contributionUpdates.length - 1] : ''}
          <StepProgress />
        </div>
      );
    } else {
      header = 'Waiting ...';
      statusCell = (<></>)
    }
    body1 = (
      <div style={{ lineHeight: '0px', width: 'max-content' }}>
        <NormalBodyText>
        ATTENTION:
        </NormalBodyText>
        <br />
        <NormalBodyText>
        Closing this browser window will interrupt your contribution.
        </NormalBodyText>
      </div>);
    body2 = (
      <div style={{ marginTop: '80px' }}>
        <Grid item>
          <CeremonyProgress />
        </Grid>
        <Grid item container spacing={6} direction='row' style={{ marginTop:'58px' }} >
          <Grid item container direction='column' style={{ width: '150px' }} >
            <Grid item style={{ height: '34px' }} >
              <SubtleBody style={{ justifyContent: 'left' }}>Circuit</SubtleBody>
            </Grid>
            <Grid item>
              <NormalBodyText>
                {cctNum}/{cctCount}
              </NormalBodyText>
            </Grid>
          </Grid>
          <Grid item container direction='column' style={{ width: '150px' }} >
            <Grid item style={{ height: '34px' }} >
              <SubtleBody style={{ justifyContent: 'left' }}>Status</SubtleBody>
            </Grid>
            <Grid item>
              {statusCell}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  return { header, body1, body2 };
}

const ProgressPanel = observer(() => {
  const { ui, ceremony } = useContext(state) as State;

  const content = status(ceremony);

  return (
    <div>
        <Grid container spacing={4} direction='row' style={{ display: 'flex', paddingTop: '86px' }} >
          <Grid item style={{ width: '45%' }} >
            <Animation />
          </Grid>
          <Grid item container direction='column' style={{ width: '55%', paddingTop: '41px', display: 'flex', justifyContent: 'space-evenly' }} >
            <Grid item>
              <StyledHeader style={{  }}>
                {content.header}
              </StyledHeader>
            </Grid>
            <Grid item>
              <VisibilitySensor onChange={(isVisible: boolean) => ui.setProgressVisibility(isVisible)}>
                {content.body1}
              </VisibilitySensor>
            </Grid>
            <Grid item>
              {content.body2}
            </Grid>
          </Grid>
        </Grid>
    </div>
  );
});

export default ProgressPanel;

