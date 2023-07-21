import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth";
import { useEntropyStore } from "../stores/entropy";
import apiWSClient from "../api/ws";
import apiHTTPClient from "../api/http";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";
import Header from "../components/Header";
import Lottie from "lottie-react";
import { Row } from "../components/containers/Row";
import circularLines from "../assets/circular-lines.json";
import { Column } from "../components/containers/Column";
import { SubTitle } from "../components/titles/SubTitle";
import { accentColor } from "../styles";
import { Description } from "../components/description/Description";
import styled from "styled-components";
import { SubtleDescription } from "../components/description/SubDescription";

const Contribute = () => {
    const navigate = useNavigate();
    const [ status, setStatus ] = useState('Next in line');
    const [ currentCircuit, setCurrentCircuit ] = useState(0);
    const { token, userId, userName, numberOfCircuits } = useAuthStore();
    const { secrets, setSecrets } = useEntropyStore();

    const formatHash = (b: Uint16Array | null) => {
        if (!b) return null
        const a = new DataView(b.buffer, b.byteOffset, b.byteLength)
        let S = ''
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            S += a
              .getUint32(i * 16 + j * 4)
              .toString(16)
              .padStart(8, '0')
          }
        }
        return S
    }

    useEffect(() => {
        const contribute = async () => {
            setStatus('Getting ceremony info');
            const userInfo = await apiWSClient.getUserInfo(token!);
            if (userInfo.userId !== userId) {
                // TODO: handle error in notification?
                throw new Error('User ID mismatch');
            }
            const circuits = Object.entries(userInfo.latestContributions)
            const uploadPromises: Promise<void>[] = [];
            try {
                for (let i = 0, ni = circuits.length; i < ni; i++) {
                    setCurrentCircuit(i + 1);
                    const circuitName = circuits[i][0];
                    const circuitId = circuits[i][1];
                    // 1. Download circuit
                    setStatus(`Downloading circuit ${circuitName}`)
                    const circuit = await apiHTTPClient.getCircuit(token!, circuitName, circuitId);
                    // Read more about using snarkjs in browser here: https://rubydusa.medium.com/how-to-build-a-react-app-with-snarkjs-fe3a3aa03da8
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const snarkjs = window.snarkjs;
                    const out = { type: 'mem', data: null }
                    // 2. Compute contribution
                    setStatus(`Computing contribution for ${circuitName}`)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    const hash = await snarkjs.zKey.contribute(
                        circuit,
                        out,
                        userName || userId,
                        secrets[i],
                    ) as Uint16Array;
                    console.log(formatHash(hash))
                    setStatus(`Uploading contribution ${circuitName}`)
                    // 4. Upload contribution and save promise to track it
                    uploadPromises.push(
                        apiHTTPClient.uploadContribution(token!, circuitName, out.data)
                    );
                }
                setStatus('Clearing up')
                // 5. Wait for all promises to resolve
                await Promise.all(uploadPromises);
                // 6. Delete secrets from local storage
                setSecrets([]);
                // 7. Navigate to complete page
                navigate(ROUTES.COMPLETE);
            } catch (error) {
                console.log(error);
                // TODO: notify in a snackbar
            }
        };
        void contribute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header/>
            <Row>
                <Lottie
                    animationData={circularLines}
                    autoplay={true}
                    loop={true}
                />
                <Column>
                    <SubTitle style={{ color: accentColor, paddingBottom: '50px' }}>
                        Contributing
                    </SubTitle>
                    <Description>
                        ATTENTION:
                    </Description>
                    <Description>
                        Closing this browser window will interrupt your contribution.
                    </Description>
                    <Row style={{ gap: '50px' }}>
                        <Column>
                            <SmallSubTitle>
                                Circuit
                            </SmallSubTitle>
                            <Description>
                                {currentCircuit} / {numberOfCircuits}
                            </Description>
                        </Column>
                        <Column>
                            <SmallSubTitle>
                                Status
                            </SmallSubTitle>
                            <Description>
                                {status}
                            </Description>
                        </Column>
                    </Row>
                </Column>
            </Row>
        </>
    )
}

const SmallSubTitle = styled(SubtleDescription)`
    text-align: left;
`;

export default Contribute;