import { Item, Root } from "@radix-ui/react-toggle-group";
import { CeremonyState } from "../../types";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { SubTitle } from "../titles/SubTitle";
import { bodyFont, lighterBackground, textColor } from "../../styles";

type Props = {
    ceremonyState: CeremonyState | undefined;
    setCircuit: (circuit: string) => void;
}

const CircuitSelector = ({ ceremonyState, setCircuit }: Props) => {
    const [selectedCircuit, setSelectedCircuit] = useState<string>('');
    const [circuits, setCircuits] = useState<string[]>([]);

    useEffect(() => {
        if (!ceremonyState) return;
        const circuits = ceremonyState.circuitStats;
        const names = [];
        for (let i = 0, ni = circuits.length; i < ni; i++) {
            const name = circuits[i].name;
            names.push(name);
        }
        setCircuits(names);
        setSelectedCircuit(names[0]);
    }, [ceremonyState]);

    const onValueChangeHandler = (value: string) => {
        if (value){
            setCircuit(value);
            setSelectedCircuit(value);
        }
    }

    return (
        <>
            <Root type="single" onValueChange={onValueChangeHandler}>
                {circuits.map((circuit) => (
                    <StyledItem key={circuit} value={circuit}>
                        {circuit}
                    </StyledItem>
                ))}
            </Root>
            <Title>{selectedCircuit}</Title>
        </>
    );
};

const StyledItem = styled(Item)`
    border: none;
    margin: 0px;
    padding: 0px;
    margin-right: 5px;
    border-radius: 4px;

    padding-block: 4px;
    padding-inline: 8px;
    background: ${lighterBackground};
    color: ${textColor};
    font-family: ${bodyFont};
    font-weight: normal;
    font-size: 20px;
    cursor: pointer;
`;

const Title = styled(SubTitle)`
    margin-top: 0px;
    font-size: 16px;
`;

export default CircuitSelector;