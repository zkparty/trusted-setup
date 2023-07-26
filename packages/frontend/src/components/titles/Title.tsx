import styled from "styled-components";
import { background, textColor, titleFont } from "../../styles";

export const Title = styled.div`
    font-family: ${titleFont};
    font-size: 64px;
    font-weight: normal;
    color: ${background};
    letter-spacing: 0.12em;
    cursor: pointer;
    user-select: none;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: ${textColor};
    margin: 35px;
`;