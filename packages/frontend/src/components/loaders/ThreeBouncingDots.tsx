import styled, { keyframes } from 'styled-components';

type Props = {
  loadingDotColor?: string;
};

const ThreeBouncingDots = ({ loadingDotColor }: Props) => {
  return (
    <ContainerDiv>
      <Dot loadingDotColor={loadingDotColor} />
      <Dot
        loadingDotColor={loadingDotColor}
        style={{ animationDelay: '0.2s' }}
      />
      <Dot
        loadingDotColor={loadingDotColor}
        style={{ animationDelay: '0.4s' }}
      />
    </ContainerDiv>
  );
};

const Bouncing = keyframes`
    to {
        opacity: 0.1;
        transform: translateY(-7px);
    }
`;

const Dot = styled.div<{ loadingDotColor?: string }>`
  width: 7px;
  height: 7px;
  margin: 5px 6px;
  border-radius: 50%;
  background-color: ${({ loadingDotColor }) => loadingDotColor || '#a3a1a1'};
  opacity: 1;
  animation: ${Bouncing} 0.6s infinite alternate;
`;

const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px auto;
`;

export default ThreeBouncingDots;
