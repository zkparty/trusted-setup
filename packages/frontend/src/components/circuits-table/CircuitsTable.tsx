import styled from "styled-components";
import { CeremonyState, TranscriptContribution } from "../../types";
import { accentColor, darkBorder, gray1, inverseText, textColor } from "../../styles";
import CircuitSelector from "./CircuitSelector";
import { useEffect, useState } from "react";
import Blockies from 'react-blockies';
import Tooltip from "../tooltip/Tooltip";
import { TooltipContainer } from "../tooltip/TooltipContainer";
import { ClipboardIcon } from '@radix-ui/react-icons';
import LightButton from "../buttons/LightButton";
import Modal from "../modals/Modal";
import ContributionInfo from "../ContributionInfo";

type Props = {
    data: TranscriptContribution[];
    ceremonyState: CeremonyState | undefined;
};

const CircuitsTable = ({ data, ceremonyState }: Props) => {
    const cellWidths = ['35px', '100px', '180px', '200px', '100px', '80px', '80px'];

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedContribution, setSelectedContribution] = useState<TranscriptContribution | null>(null);
    const [selectedCircuit, setSelectedCircuit] = useState<string>('');
    const [contributions, setContributions] = useState<TranscriptContribution[]>([]);

    useEffect(() => {
        if (ceremonyState){
            if (ceremonyState.circuitStats.length > 0) {
                setSelectedCircuit(ceremonyState.circuitStats[0].name);
            }
        }
    }, [ceremonyState]);

    useEffect(() => {
        const filteredContributions = [];
        for (let i = 0, ni = data.length; i < ni; i++) {
            const contribution = data[i];
            if (contribution.circuitName === selectedCircuit) {
                filteredContributions.push(contribution);
            }
        }
        setContributions(filteredContributions);
    }, [selectedCircuit, data]);

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
    }

    const onClickViewHandler = (contribution: TranscriptContribution) => {
        setSelectedContribution(contribution);
        setIsModalOpen(true);
    };

    return (
        <>
            <CircuitSelector ceremonyState={ceremonyState} setCircuit={setSelectedCircuit} />
            <Table>
                <TableRow>
                    <HeaderCell style={{ maxWidth: cellWidths[0] }}>
                        Index
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[1] }}>
                        Name
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[2] }}>
                        User id
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[3] }}>
                        Queue id
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[4] }}>
                        Created at
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[5] }}>
                        Hash
                    </HeaderCell>
                    <HeaderCell style={{ maxWidth: cellWidths[6] }}>
                        More info
                    </HeaderCell>
                </TableRow>
                {contributions.map((contribution) => (
                    <TableRow key={contribution._id}>
                        <HeaderCell style={{ maxWidth: cellWidths[0] }}>
                            {contribution.index}
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[1] }}>
                            {contribution.name}
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[2] }}>
                            {contribution.userId}
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[3] }}>
                            {contribution.queueId}
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[4] }}>
                            <Tooltip
                                sideOffset={5}
                                alignOffset={5}
                                content={
                                    <TooltipContainer width={"fit-content"} >
                                        {new Date(contribution.createdAt).toLocaleString()}
                                    </TooltipContainer>
                                }
                                trigger={
                                    <div>
                                        {contribution.createdAt}
                                    </div>
                                }
                            />
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[5] }}>
                            <Tooltip
                                sideOffset={5}
                                alignOffset={5}
                                content={
                                    <TooltipContainer>
                                        {contribution.hash}
                                    </TooltipContainer>
                                }
                                trigger={
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Blockies
                                            seed={contribution.hash}
                                            size={10}
                                            scale={4}
                                            className="identicon"
                                        />
                                        <ClipboardIcon
                                            width={'20px'}
                                            height={'20px'}
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            onClick={() => {
                                                void copyToClipboard(contribution.hash)
                                            }}
                                        />
                                    </div>
                                }
                            />
                        </HeaderCell>
                        <HeaderCell style={{ maxWidth: cellWidths[6] }}>
                            <ViewButton onClick={ () => { onClickViewHandler(contribution) } }>
                                View
                            </ViewButton>
                        </HeaderCell>
                    </TableRow>
                ))}
            </Table>
            <Modal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                content={
                    <ContributionInfo
                        title={`Contribution for ${selectedCircuit}`}
                        contributions={selectedContribution ? [selectedContribution] : []}
                    />
                }
                trigger={<></>}
            />
        </>
    );
};

const Table = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 50px;
`;

const TableRow = styled.div<{ completed?: boolean }>`
  display: flex;
  width: 100%;
  color: ${({ completed }) => (completed ? accentColor : textColor)};
`;

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
  background-color: ${darkBorder};
`;

const ViewButton = styled(LightButton)`
    background-color: ${gray1};
    font-size: 14px;

    &:hover {
        background-color: ${accentColor};
        color: ${inverseText}
    }
`;


export default CircuitsTable;