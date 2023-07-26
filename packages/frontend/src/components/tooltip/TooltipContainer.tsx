import styled from "styled-components";
import { lighterBackground } from "../../styles";

export const TooltipContainer = styled.div<{ width?: string }>`
    word-break: break-all;
    border-radius: 4px;
    background: ${lighterBackground};
    padding-block: 7px;
    padding-inline: 14px;
    width: ${({ width }) => width || "400px"};
`;