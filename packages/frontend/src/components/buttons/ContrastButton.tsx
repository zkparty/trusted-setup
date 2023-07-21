import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import ThreeBouncingDots from '../loaders/ThreeBouncingDots';
import { accentColor, inverseText } from '../../styles';
import Button from './Button';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  loadingDotColor?: string;
}

const ContrastButton = ({ loading = false, ...props }: ButtonProps) => {
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
    background-color: ${accentColor};
    color: ${inverseText};
`;

export default ContrastButton;
