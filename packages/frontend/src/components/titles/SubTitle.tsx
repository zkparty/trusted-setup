import styled from "styled-components";
import { bodyFont, textColor } from "../../styles";

export const SubTitle = styled.div`
    font-family: ${bodyFont};
    color: ${textColor};
    font-style: normal;
    font-weight: bold;
    font-size: 48px;
    line-height: 140%;
    /* or 67px */

    display: flex;
    align-items: center;
    margin-top: 50px;
`;