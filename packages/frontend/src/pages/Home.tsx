import Header from "../components/Header";
import { background } from "../styles";
import ContrastButton from "../components/buttons/ContrastButton";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { SubTitle } from "../components/titles/SubTitle";
import { Title } from "../components/titles/Title";
import { Description } from "../components/description/Description";
import { SubtleDescription } from "../components/description/SubDescription";
import CircuitsTable from "../components/circuits-table/CircuitsTable";
import useSWR from "swr";
import apiHTTPClient from "../api/http";
import ThreeBouncingDots from "../components/loaders/ThreeBouncingDots";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";
import { SmallContainer } from "../components/containers/SmallContainer";
import { LargeContainer } from "../components/containers/LargeContainer";
import { Container } from "../components/containers/Container";

const Home = () => {
    const navigate = useNavigate();

    const { data: transcript, isLoading: isLoadingTranscript } = useSWR('/transcript', apiHTTPClient.getTranscript);
    const { data: ceremonyState, isLoading: isLoadingCeremonyState } = useSWR('/ceremony', apiHTTPClient.getCeremony);

    const onClickLaunchCeremony = () => {
        navigate(ROUTES.SIGNIN);
    };

    return (
        <>
            <Header/>
            <Container>
                <Title>Welcome.</Title>
                <SmallContainer>
                    <SubtleDescription>
                        Thank you for joining us for our trusted setup ceremony! Ready to make your contribution?
                    </SubtleDescription>
                    <ContrastButton
                        onClick={onClickLaunchCeremony}
                    >
                        Launch Ceremony
                    </ContrastButton>

                    <SubTitle>about {import.meta.env.VITE_PROJECT_TITLE} </SubTitle>
                    <Description>
                        The zkparty trusted ceremony is a multi-party computation (MPC) protocol that allows a group of
                        participants to generate a public key for a zero-knowledge proof system without any one
                        participant learning the secret key. This is done by having each participant generate a secret key share,
                        and then combining these shares to generate the public key.
                    </Description>
                    <ContrastButton
                        style={{
                            width: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Read More
                        <ExternalLinkIcon
                            width={'25px'}
                            height={'25px'}
                            style={{
                                color: background,
                                marginLeft: '10px',
                            }}
                        />
                    </ContrastButton>
                </SmallContainer>
                <LargeContainer>
                    <SubTitle style={{ textAlign: 'start', width: '100%' }} >Circuits</SubTitle>
                    <Description>
                    All participants will contribute a computation to undefined different circuits.
                    There is no limit to the number of contributions each circuit can accept - The more the merrier!
                    Participants receive a hash for each completed circuit, which acts as a signature of their contribution.
                    </Description>
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
        </>
    );
};


export default Home;