import styled from "styled-components";
import { SubTitle } from "./titles/SubTitle";
import { SubtleDescription } from "./description/SubDescription";
import { Description } from "./description/Description";
import { TranscriptContribution } from "../types";
import { background, titleFont } from "../styles";

type Props = {
    title: string;
    contributions: TranscriptContribution[];
}

const ContributionInfo = ({ title, contributions }: Props) => {
    return (
        <Container>
            <SubTitle style={{ marginTop: '0px' }}>{title}</SubTitle>

            {contributions.length !== 0 && <>
                <UserInfoSection>
                    <SectionTitle>Index: </SectionTitle>
                    <Description>{contributions[0].index}</Description>
                </UserInfoSection>

                <UserInfoSection style={{ marginBottom: '30px' }}>
                    <SectionTitle>User id: </SectionTitle>
                    <Description>{contributions[0].userId}</Description>
                </UserInfoSection>
            </>}

            {contributions.map((contribution) => (
                <ContributionSection key={contribution._id}>
                    <CircuitNameTitle>
                        {`${contribution.circuitName} circuit`}
                    </CircuitNameTitle>



                    <SectionTitle>Hash: </SectionTitle>
                    <Description style={{ wordBreak: 'break-all' }}>
                        {contribution.hash}
                    </Description>
                </ContributionSection>
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserInfoSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
`;

const ContributionSection = styled.div`
    margin-bottom: 40px;
`;

const SectionTitle = styled(SubtleDescription)`
    text-align: left;
    color: ${background};
`;

const CircuitNameTitle = styled(SectionTitle)`
    font-family: ${titleFont};
    margin-bottom: 0px;
    font-size: 20px;
`;

export default ContributionInfo;