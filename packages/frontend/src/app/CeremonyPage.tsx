import { useState, useRef, useContext } from "react";
import styled from "styled-components";
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import {
  textColor,
  lighterBackground,
  accentColor,
  PageContainer,
  CeremonyTitle,
  Center
} from "../styles";
import { CeremonyEvent, State } from "../types/ceremony";
import { Typography } from "@material-ui/core";
import moment from "moment";
import './styles.css';
import ViewLog from '../components/ViewLog';
import { useSnackbar } from "notistack";
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';

const CeremonyDetailsTable = styled.table`
  text-align: right;
  font-size: 11pt;
  width: 100%;

  td.title {
    padding-left: 10px;
    color: ${accentColor};
  }
  td.content {
    padding-left: 10px;
    float: left;
    color: ${textColor};
  }
`;

const NotFoundContainer = styled.div`
  width: 512px;
  background-color: ${lighterBackground};
  padding: 16px;
  border-radius: 4px;
  text-align: center;
`;

const CeremonyDetailsContainer = styled.div`
  width: 512px;
  background-color: ${lighterBackground};
  padding: 16px;
  border-radius: 4px;
`;

const CeremonyDetailsSubSection = styled.div`
  width: 100%;
  display: inline-block;
  padding: 16px;
  box-sizing: border-box;
`;

export const CeremonyPage = observer((props: {onClose: ()=> void }) => {
  const { ceremony, ui } = useContext(state) as State
  const [loaded, setLoaded] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const viewLogContent = useRef('');
  const viewLogIndex = useRef('');
  const [viewLogOpen, setOpenViewLog] = useState(false);

   const statusUpdate = (event: CeremonyEvent) => {
    enqueueSnackbar(event.message);
  };

  const gridRows = ceremony?.contributionUpdates.map(v => {
    return {
      ...v, 
      id: v.queueIndex,
      timestamp: v.timeCompleted ? moment(v.timeCompleted.toDate()).format('lll') : '',
      duration: `${Math.round(moment.duration(v.duration, 'seconds').asMinutes())}m`,
    }
  });

  // const contributionStats = (): {completed: number, waiting: number, lastVerified: number, transcript: string} => {
  //   let result = {completed: 0, waiting: 0, lastVerified: -1, transcript: ''};
  //   ceremony?.contributionUpdates.forEach(c => {
  //     switch (c.status) {
  //       case 'COMPLETE': {
  //         result.completed++;
  //         if (c.verification && c.queueIndex && c.queueIndex > result.lastVerified) {
  //           result.lastVerified = c.queueIndex;
  //           result.transcript = c.verification;
  //         }
  //         break;
  //       }
  //       case 'WAITING': result.waiting++; break;
  //     }
  //   });
  //   return result;
  // }

  //const contribStats = contributionStats();
  const { ceremonyState } = ceremony;
  const { circuitStats } = ceremonyState;

  const handleClose = () => {
    ceremony?.stopKeepAlive();
  };

  const closeViewLog = () => {
    setOpenViewLog(false);
  }

  const openViewLog = (content: string, index: any) => {
    console.debug(`verify view clicked ${index}`);
    viewLogContent.current = content;
    viewLogIndex.current = index;
    setOpenViewLog(true);
  }

  return (
    <>
      {ceremony ? (
        <PageContainer >
          <div>
            <br />
            <div style={{ width: '80%', display: 'flex' }}>
              <div style={{ marginLeft: 'auto' }}>
                <CeremonyDetails 
                  index={ui.selectedIndex} 
                  openViewLog={openViewLog} />
              </div>
            </div>
            <br />
            <ContributionsGrid contributions={gridRows || []} openViewer={openViewLog} />
            <ViewLog open={viewLogOpen} 
              close={closeViewLog} 
              content={viewLogContent.current} 
              title={`Verification transcript for contributor number ${viewLogIndex.current}`}
            />
          </div>
        </PageContainer>
      ) : (
        <PageContainer>
          <br />
          <NotFoundContainer>
            {loaded ? "Ceremony not found." : "Loading..."}
          </NotFoundContainer>
        </PageContainer>
      )}
    </>
  );
});

const CeremonyDetails = observer((props: { 
    index: number, 
    openViewLog: (c: string, i: any)=>void,
 }) => {

  const { ceremony } = useContext(state) as State;
  const { ceremonyState } = ceremony;
  const { circuitStats } = ceremonyState;
  const circuit = circuitStats[props.index];

  return (
    <CeremonyDetailsContainer>
      <CeremonyTitle>{circuit.name}</CeremonyTitle>
      <CeremonyDetailsSubSection>
        <Center>
          <CeremonyDetailsTable>
            <tbody>
              <tr>
                <td className='title'>Status</td>
                <td className='content'>{status}</td>
              </tr>
              <tr>
                <td className='title'>Contributions</td>
                <td className='content'>{circuit.contributionCount} completed</td>
              </tr>
              <tr>
                <td className='title'>Circuit File</td>
                <td className='content'>{circuit.name}</td>
              </tr>
              <tr>
                <td className='title'>Verification Transcript</td>
                <td className='content'>
                  <button 
                    onClick={() => {props.openViewLog(''/*TODO get transcript*/, circuit.contributionCount)}}
                    style={{ backgroundColor: lighterBackground, color: textColor, borderStyle: 'solid' }}
                  >view</button>
                </td>
              </tr>
            </tbody>
          </CeremonyDetailsTable>
        </Center>
      </CeremonyDetailsSubSection>
    </CeremonyDetailsContainer>
  );
});

const getColumns = (openViewer: (s: string, n: any)=>void): GridColDef[] => {
//  const cols = 
  return (
  [
    { field: 'queueIndex', headerName: '#', description: 'Queue position', type: 'number', width: 50, sortable: true },
    { field: 'timestamp', headerName: 'Time', width: 180, sortable: true },
    { field: 'status', headerName: 'Status', width: 120, sortable: false },
    { field: 'duration', headerName: 'Duration', type: 'string', width: 90, sortable: false },
    { field: 'hash', 
      headerName: 'Hash',
      description: 'The hash resulting from this contribution',
      sortable: false,
      width: 120,
    },
    { field: 'gistUrl', 
      headerName: 'Attestation',
      description: 'Link to the attestation',
      sortable: false,
      width: 80,
      renderCell: (params: GridCellParams) => {
        const v = params.value?.toString();
        return (
          v ? 
            <a href={v} target='_blank' style={{ color: textColor }}>link</a>
          : <></>
        )},
    },
    { field: 'verification', 
      headerName: 'Verification',
      description: 'The verification log',
      sortable: false,
      width: 80,
      renderCell: (params: GridCellParams) => {
        const v = params.value;
        const r = params.row;
        return (
          v ? 
            <button 
              onClick={() => {
                openViewer(v?.toString(), params.row(1, 'queueIndex'))
              }}
              style={{ backgroundColor: lighterBackground, color: textColor, borderStyle: 'none' }}
            >view</button>
          : <></>
        )},
    },
  ]
  );
};

const ContributionsGrid = observer((props: { contributions: any[], openViewer: (s: string, i:any)=> void }): JSX.Element => {
  const { ceremony } = useContext(state) as State;
  const { ceremonyState } = ceremony;
  const cols: GridColDef[] = getColumns(props.openViewer);
  return (
    <div style={{ height: 450, width: 800 }}>
      <Typography variant="h5" style={{ color: accentColor, background: lighterBackground }}>Contributions</Typography>
      <DataGrid 
        rows={ceremonyState.circuitStats} 
        columns={cols} 
        autoPageSize
        rowHeight={40}
        sortingMode='server'
      />
    </div>
  );
});
