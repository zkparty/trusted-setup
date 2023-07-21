import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuthStore } from "../stores/auth";
import apiWSClient from "../api/ws";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";
import Lottie from "lottie-react";
import circularLines from "../assets/circular-lines.json";
import styled from "styled-components";
import { SubTitle } from "../components/titles/SubTitle";
import { accentColor } from "../styles";
import { Description } from "../components/description/Description";
import { SubtleDescription } from "../components/description/SubDescription";
import { Row } from "../components/containers/Row";
import { Column } from "../components/containers/Column";
import ProgressBar from "../components/ProgressBar";


const Wait = () => {
    const navigate = useNavigate();
    const [ progress, setProgress ] = useState(0);
    const { token, numberOfCircuits } = useAuthStore();
    // 1. Keep pinging in the keepalive endpoint
    useEffect(() => {
        const pool = async () => {
            let timeToContribute = false;
            while (!timeToContribute) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const { queueLength, queuePosition, timeoutAt } = await apiWSClient.keepAlive(token!);
                // 2. when ready, set var to true
                if (queuePosition === 0) {
                    timeToContribute = true;
                }
                setProgress(
                    99 - ( (queuePosition * 100) / queueLength )
                );
                const padding = Number(import.meta.env.VITE_WS_KEEPALIVE_PADDING);
                const nextPing = Math.max(0, +(timeoutAt - padding) - +new Date())
                await new Promise((r) => setTimeout(r, nextPing));
            }
            // 3. When it is your turn, navigate to Contribute page
            navigate(ROUTES.CONTRIBUTE);
        };
        void pool();
    }, [token, navigate]);

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
                        You are in line
                    </SubTitle>
                    <ProgressBar
                        progress={progress}
                    />
                    <Description>
                        ATTENTION:
                    </Description>
                    <Description>
                        Please keep this window open in the background while waiting for your turn to contribute.
                    </Description>
                    <Row style={{ gap: '50px' }}>
                        <Column>
                            <SmallSubTitle>
                                Circuit
                            </SmallSubTitle>
                            <Description>
                                0 / {numberOfCircuits}
                            </Description>
                        </Column>
                        <Column>
                            <SmallSubTitle>
                                Status
                            </SmallSubTitle>
                            <Description>
                                Waiting
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

export default Wait;