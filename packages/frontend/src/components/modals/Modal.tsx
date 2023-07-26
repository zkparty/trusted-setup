import { Root, Trigger, Portal, Content, Close } from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { ReactNode } from "react";
import styled from 'styled-components';
import { lighterBackground, secondAccent, background } from '../../styles';

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    content: ReactNode;
    trigger: ReactNode;
}

const Modal = ({ open, setOpen, content, trigger }: Props) => {
    return (
        <Root open={open}>
            <Trigger asChild>
                {trigger}
            </Trigger>
            <Portal>
                <Content>
                    <ModalContainer>
                        {content}
                        <CloseButton
                            asChild
                            onClick={() => setOpen(false) }
                        >
                            <Cross2Icon/>
                        </CloseButton>
                    </ModalContainer>
                </Content>
            </Portal>
        </Root>
    )
}

const ModalContainer = styled.div`
    padding-block: 30px;
    padding-inline: 20px;
    position: fixed;
    top: 50%;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${secondAccent};
    width: 700px;
    height: fit-content;
    border-radius: 4px;
    box-shadow: 1px 1px 3px grey;
    background: ${lighterBackground};
`;

const CloseButton = styled(Close)`
    cursor: pointer;
    position: fixed;
    top: 10px;
    right: 10px;
    color: ${background};
`;


export default Modal;
