import styled from "styled-components";
import { bodyFont } from "../../styles";

const Button = styled.button`
    font-family: ${bodyFont};
    font-weight: bold;
    font-size: 24px;
    border-radius: 4px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 30px;
    padding-right: 30px;
    /* min-width: 160px; */
    border: 0px solid #000;
    &:hover {
    cursor: pointer;
    }
`;

export default Button;