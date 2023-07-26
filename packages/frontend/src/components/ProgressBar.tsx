import {Root, Indicator } from '@radix-ui/react-progress';
import { darkerBackground, secondAccent, subtleText, textColor } from '../styles';
import styled from 'styled-components';
import { Row } from './containers/Row';

type Props = {
    progress: number;
}

const ProgressBar = ({ progress }: Props) => {
    return (
        <Container>
            <StyledRoot value={progress}>
                <StyledIndicator style={{ transform: `translateX(-${100 - progress}%)` }}/>
            </StyledRoot>
            {`${progress.toFixed(0) }%`}
        </Container>
    )
}

const Container = styled(Row)`
    margin-bottom: 30px;
    align-items: center;
    color: ${subtleText};
    gap: 12px;
`;

const StyledRoot = styled(Root)`
    width: 100% !important;
    position: relative;
    overflow: hidden;
    background: ${darkerBackground};
    color: ${textColor};
    border-radius: 99999px;
    width: 300px;
    height: 15px;

    /* Fix overflow clipping in Safari */
    /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
    transform: translateZ(0);
`;

const StyledIndicator = styled(Indicator)`
    background-color: ${secondAccent};
    width: 100%;
    height: 100%;
    transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export default ProgressBar;