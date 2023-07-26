import Header from "../components/Header";
import { Title } from "../components/titles/Title";
import { Container } from "../components/containers/Container";
import { SmallContainer } from "../components/containers/SmallContainer";
import { SubtleDescription } from "../components/description/SubDescription";
import { Description } from "../components/description/Description";
import styled from "styled-components";
import { subtleText } from "../styles";
import { ChangeEvent, useState, MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";
import ContrastButton from "../components/buttons/ContrastButton";
import { useEntropyStore } from "../stores/entropy";
import useSWR from "swr";
import apiHTTPClient from "../api/http";
import { randomBytes } from "@noble/hashes/utils";
import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { CURVE } from "@noble/bls12-381";
import ThreeBouncingDots from "../components/loaders/ThreeBouncingDots";
import { useAuthStore } from "../stores/auth";

const SignIn = () => {
    const navigate = useNavigate()
    const { signIn, signOut } = useAuthStore()
    const { entropy, setEntropy, setSecrets } = useEntropyStore()
    const [name, setName] = useState('')
    const [inputText, setInputText] = useState('')
    const { data: ceremonyState, isLoading: isLoadingCeremonyState } = useSWR('/ceremony', apiHTTPClient.getCeremony);

    useEffect(() => {
        signOut();
    }, [signOut]);

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }

    const onMoveDiv = (e: MouseEvent) => {
        const secret =
            inputText + String(e.clientX) + String(e.clientY) + String(performance.now());
        setEntropy(`${entropy}${secret}`)
    }

    const generateEntropy = (numberOfCircuits: number) => {
        const generatedEntropyAsBytes = Uint8Array.from(
            entropy.split('').map((x) => x.charCodeAt(0))
        )
        const secrets = []
        for (
        let i = 0, ni = generatedEntropyAsBytes.length;
        i < ni;
        i += numberOfCircuits
        ) {
        const entropyChunk = generatedEntropyAsBytes.slice(
            i,
            i + numberOfCircuits
        )
        const randomEntropyAsBytes = randomBytes(32)
        const entropyAsBytes = new Uint8Array(
            entropyChunk.length + randomEntropyAsBytes.length
        )
        entropyAsBytes.set(entropyChunk)
        entropyAsBytes.set(randomEntropyAsBytes, entropyChunk.length)
        /*
        In order to reduce modulo-bias in the entropy (w.r.t. the curve order):
        it is expanded out (and mixed) to at least 48 bytes before being reduced mod curve order.
        This exact technique is the RECOMMENDED means of obtaining a ~uniformly random F_r element according to
        the IRTF BLS signature specs: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature-05#section-2.3
        */
        const salt = randomBytes(32)
        const expandedEntropy = hkdf(sha256, entropyAsBytes, salt, '', 48)
        const hex96 = expandedEntropy.reduce(
            (str, byte) => str + byte.toString(16).padStart(2, '0'),
            ''
        )
        const expandedEntropyInt = BigInt('0x' + hex96)
        const secretInt = expandedEntropyInt % CURVE.r
        const secretHex = secretInt.toString(16).padStart(32, '0')
        secrets.push(secretHex)
        }
        return secrets

    }

    const onClickJoin = async () => {
        // 1. get the number of circuits in the ceremony
        const numberOfCircuits = ceremonyState?.circuitStats.length || 0;
        // 2. generate entropy for the n circuits
        setSecrets( generateEntropy(numberOfCircuits) );
        // 3. join ceremony by creating a user in db
        const { token, userId }= await apiHTTPClient.userRegister();
        if (!token) throw new Error('Failed to register user');
        // 4. join ceremony queue
        const joinState = await apiHTTPClient.joinCeremony(token);
        if (!joinState) throw new Error('Failed to join ceremony');
        // 5. save user info in local storage
        signIn(
            token,
            userId,
            name,
            joinState.timeoutAt,
            joinState.active,
            joinState.queuePosition,
            numberOfCircuits,
        )
        // 6. navigate to wait page
        navigate(ROUTES.WAIT)
    }

    return (
        <>
            <Header/>
            <Container>
                <Title style={{ marginBottom: '0px' }}>
                    {import.meta.env.VITE_PROJECT_TITLE}
                </Title>
                <SmallContainer style={{ gap: '10px' }}>
                    <SubtleDescription
                        style={{
                            fontSize: '40px',
                            fontWeight: '700',
                        }}
                    >
                        Trusted Setup Ceremony
                    </SubtleDescription>
                    <InputContainer>
                        <StyledDescription>
                            Join ceremony:
                        </StyledDescription>
                        <Input
                            type="text"
                            placeholder="contributor name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <StyledDescription>
                            Enter a secret:
                        </StyledDescription>
                        <Input
                            placeholder="secret"
                            type="password"
                            onChange={onChangeInput}
                        />
                    </InputContainer>
                    <StyledDescription>
                        Move your mouse around this box:
                    </StyledDescription>
                    <MouseMoveDiv onMouseMove={onMoveDiv}/>
                    {
                        isLoadingCeremonyState ? (
                            <ThreeBouncingDots/>
                        ) : (
                            <ContrastButton
                                onClick={() => { void onClickJoin() }}
                                style={{ width: 'fit-content', alignSelf: 'center' }}
                            >
                            Join
                        </ContrastButton>
                        )
                    }
                </SmallContainer>
            </Container>
        </>
    )
}

const StyledDescription = styled(Description)`
    margin-bottom: 5px;
    font-size: 20px;
    text-align: center;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const Input = styled.input`
  font-family: inherit;
  font-weight: 700;
  text-align: center;
  height: 30px;

  color: black;
  background: ${subtleText};
  border-radius: 4px;
  border: none;
  padding-block: 3px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #3c5660 !important;
  }
`;

const MouseMoveDiv = styled.div`
    height: 100px;
    border-radius: 4px;
    cursor: crosshair;
    background: ${subtleText};
`;

export default SignIn;