import { useContext, useState } from 'react'
import {
  accentColor,
  textColor,
  darkBorder,
  NormalBodyText,
  darkerBackground,
  H3Title,
} from '../styles'
//import './styles.css';
import { Circuit, State } from '../types/ceremony'
import { Button } from '@mui/material'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ViewLog from './ViewLog'
import moment from 'moment'
import { CopyIcon } from '../icons'
import Blockies from 'react-blockies'
import state from '../contexts/state'
import { observer } from 'mobx-react-lite'

const HeaderCell = styled.div`
  display: flex;
  flex: 1;
  min-width: 10px;
  align-items: center;
  margin: 1px;
  font-family: Inconsolata;
  font-size: 16px;
  color: inherit;
  padding: 24px;
  background-color: #0e2936;
`

const TableRow = styled.div<{ completed?: boolean }>`
  display: flex;
  width: 100%;
  color: ${(props) => (props.completed ? accentColor : textColor)};
`

const CircuitsTable = observer(() => {
  const { ceremony } = useContext(state) as State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: <></>,
    content: <></>,
  })

  const { ceremonyState, contributionHashes, authenticated } = ceremony
  const { circuitStats } = ceremonyState

  const closeTranscript = () => {
    setModalOpen(false)
  }
  const openTranscript = (title: JSX.Element, content: JSX.Element) => {
    setModalContent({ title, content })
    setModalOpen(true)
  }
  const cellWidths = ['105px', '167px', '156px', '140px', '193px']
  const hashKeys = contributionHashes ? Object.values(contributionHashes) : []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <TableRow>
        <HeaderCell style={{ maxWidth: cellWidths[0] }}>Circuit</HeaderCell>
        <HeaderCell style={{ maxWidth: cellWidths[1] }}>
          Contributions
        </HeaderCell>
        <HeaderCell style={{ maxWidth: cellWidths[2] }}>
          Average Time
        </HeaderCell>
        <HeaderCell style={{ maxWidth: cellWidths[3] }}>Transcript</HeaderCell>
        <HeaderCell style={{ maxWidth: cellWidths[4] }}>My Hash</HeaderCell>
      </TableRow>
      {(circuitStats || []).map((circuit, index) =>
        renderRow(
          circuit,
          index < hashKeys.length ? hashKeys[index] : undefined,
          circuit.name || index.toString(),
          authenticated,
          openTranscript,
          cellWidths
        )
      )}
      <ViewLog
        open={modalOpen}
        close={closeTranscript}
        content={modalContent.content}
        title={modalContent.title}
      />
    </div>
  )
})

const renderRow = (
  circuit: Circuit,
  contributionHash: string | undefined,
  index: string,
  isSignedIn: boolean,
  showTranscript: (title: JSX.Element, body: JSX.Element) => void,
  cellWidths: string[]
) => {
  const renderHash = (hash: string | undefined) => {
    let content = <></>
    if (hash && hash?.length > 0) {
      const hashBlockie = () => (
        <Blockies seed={hash} size={10} scale={4} className="identicon" />
      )
      content = (
        <CopyToClipboard text={hash}>
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {/*<NormalBodyText style={{ color: 'inherit', fontSize: '18px' }}>*/}
            <div style={{ padding: 10 }}>{hashBlockie()}</div>

            {/*</NormalBodyText>*/}
            <div style={{ cursor: 'pointer' }}>{CopyIcon}</div>
          </span>
        </CopyToClipboard>
      )
    }
    return <span>{content}</span>
  }

  const formatDuration = (avgSecs: number) => {
    return moment.duration(avgSecs, 'seconds').humanize()
  }

  const formatTranscript = (circuit: Circuit, index: string) => {
    const { name } = circuit
    // TODO How to get transcript?
    const transcript = ''

    //if (!transcript) return;

    const title = (
      <div>
        <H3Title>Verification Transcript</H3Title>
        <NormalBodyText>{`Circuit ${index}`}</NormalBodyText>
        <NormalBodyText>{`Circuit File: ${name}`}</NormalBodyText>
        {/*<NormalBodyText>{`Constraints: ${numConstraints}`}</NormalBodyText>*/}
      </div>
    )

    const lineStyle = {
      marginBlockStart: '0em',
      marginBlockEnd: '0em',
    }
    const linesToJsx = (content: string) => {
      const lines: string[] = content.split('\n')
      console.log(`lines: ${lines}`)
      const body = lines.map((v) => <p style={lineStyle}>{v}</p>)
      return <div>{body}</div>
    }

    const copyStyle = {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '245px',
      background: darkerBackground,
      borderRadius: '30px',
      marginBottom: '41px',
    }
    const body = (
      <div>
        <CopyToClipboard text={transcript}>
          <span style={copyStyle}>
            <NormalBodyText>Copy to clipboard</NormalBodyText>
            {CopyIcon}
          </span>
        </CopyToClipboard>
        {linesToJsx(transcript || '')}
      </div>
    )

    showTranscript(title, body)
  }

  const completed = !!contributionHash

  return (
    <TableRow key={index} completed={completed}>
      <HeaderCell style={{ maxWidth: cellWidths[0] }}>{index}</HeaderCell>
      <HeaderCell style={{ maxWidth: cellWidths[1] }}>
        {completed ? 'Y' : 'N'}
      </HeaderCell>
      <HeaderCell style={{ maxWidth: cellWidths[2] }}>
        {/* formatDuration(circuit.averageSecondsPerContribution)<<<TODO */}
      </HeaderCell>
      <HeaderCell style={{ maxWidth: cellWidths[3], textAlign: 'center' }}>
        <Button
          style={{
            color: 'inherit',
            font: 'Inconsolata 18px',
            textTransform: 'none',
            textDecoration: 'underline',
          }}
          onClick={() => formatTranscript(circuit, index)}
        >
          View
        </Button>
      </HeaderCell>
      <HeaderCell style={{ maxWidth: cellWidths[4] }}>
        {renderHash(contributionHash)}
      </HeaderCell>
    </TableRow>
  )
}

export default CircuitsTable
