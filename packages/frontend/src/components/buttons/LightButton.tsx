import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import ThreeBouncingDots from '../loaders/ThreeBouncingDots';
import { lighterBackground, textColor } from '../../styles';
import Button from './Button';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  loadingDotColor?: string;
}

const LightButton = ({ loading = false, ...props }: ButtonProps) => {
  if (loading) {
    const { loadingText, loadingDotColor } = props;
    delete props.loadingText;
    delete props.loadingDotColor;
    return (
      <StyledButton {...props}>
        {loadingText || <ThreeBouncingDots loadingDotColor={loadingDotColor} />}
      </StyledButton>
    );
  }
  return <StyledButton {...props}>{props.children}</StyledButton>;
};

const StyledButton = styled(Button)`
    background: ${lighterBackground};
    color: ${textColor};
    font-weight: normal;
    font-size: 20px;
`;

export default LightButton;