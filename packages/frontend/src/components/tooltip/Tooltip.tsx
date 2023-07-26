import { Root, Trigger, Content, Arrow, Portal } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
    sideOffset?: number;
    alignOffset?: number;
    content: ReactNode;
    trigger: ReactNode;
};

const Tooltip = ({ sideOffset, alignOffset, content, trigger }: Props) => {
    return (
        <Root>
            <Trigger asChild>
                {trigger}
            </Trigger>
            <Portal>
                <Content sideOffset={sideOffset} alignOffset={alignOffset}>
                    <Arrow />
                    {content}
                </Content>
            </Portal>
        </Root>
    );
}

export default Tooltip;