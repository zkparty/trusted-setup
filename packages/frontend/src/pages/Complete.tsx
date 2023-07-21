import useSWR from "swr";
import Header from "../components/Header";
import CircuitsTable from "../components/circuits-table/CircuitsTable";
import { Container } from "../components/containers/Container";
import { LargeContainer } from "../components/containers/LargeContainer";
import ThreeBouncingDots from "../components/loaders/ThreeBouncingDots";
import { SubTitle } from "../components/titles/SubTitle";
import { Title } from "../components/titles/Title";
import apiHTTPClient from "../api/http";
import { styled } from "styled-components";
import Modal from "../components/modals/Modal";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth";
import { TranscriptContribution } from "../types";
import ContributionInfo from "../components/ContributionInfo";

const Complete = () => {
    const { userId } = useAuthStore();
    const [userContributions, setUserContributions] = useState<TranscriptContribution[]>();
    const [openModal, isOpenModal ] = useState(true);
    const { data: transcript, isLoading: isLoadingTranscript } = useSWR('/transcript', apiHTTPClient.getTranscript);
    const { data: ceremonyState, isLoading: isLoadingCeremonyState } = useSWR('/ceremony', apiHTTPClient.getCeremony);

    useEffect(() => {
        if (!transcript) return;
        const contributions = [];
        for (let i = 0, ni=transcript.length; i < ni; i++) {
            const contribution = transcript[i];
            if (contribution.userId === userId){
                contributions.push(contribution);
            }
        }
        setUserContributions(contributions);
    }, [userId, transcript]);



    return (
        <>
            <Header/>
            <Container>
                <Title>Completed.</Title>
                <LargeContainer style={{ marginTop: '0px' }}>
                    <CustomSubTitle>Circuits</CustomSubTitle>
                    {isLoadingTranscript || isLoadingCeremonyState ?
                        <ThreeBouncingDots/>
                    :
                        <CircuitsTable
                            data={transcript || []}
                            ceremonyState={ceremonyState}
                        />
                    }
                </LargeContainer>
            </Container>
            <Modal
                open={openModal}
                setOpen={isOpenModal}
                content={
                    <ContributionInfo
                        title="Your contribution"
                        contributions={userContributions || [] as TranscriptContribution[]}
                    />
                }
                trigger={<></>}
            />
        </>
    )
}

const CustomSubTitle = styled(SubTitle)`
    text-align: start;
    width: 100%;
    margin-top: 0px;
`;


export default Complete;