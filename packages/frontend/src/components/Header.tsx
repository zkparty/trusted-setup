import styled from "styled-components";
import { useState } from "react";
import { textColor, titleFont } from "../styles";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";
import { useAuthStore } from "../stores/auth";

const Header = () => {
    const navigate = useNavigate();
    const { userId } = useAuthStore();
    const [title, setTitle] = useState(import.meta.env.VITE_PROJECT_TITLE);

    const onClickHandler = () => {
        // keep changing the title with random text
        const interval = setInterval(() => {
            setTitle(getRandomText());
        }, import.meta.env.VITE_TITLE_CHANGING_SPEED);

        // get back to normal
        setTimeout(() => {
            clearInterval(interval);
            // set title back to normal with a chance of 30%
            if (Math.random() < import.meta.env.VITE_TITLE_CHANGES_BACK_TO_NORMAL){
                setTitle(import.meta.env.VITE_PROJECT_TITLE);
            }
            navigate(ROUTES.HOME);
        }, import.meta.env.VITE_TITLE_RESET_TIME);
    }

    const onClickUserIdHandler = () => {
        if (userId) return;
        navigate(ROUTES.HOME);
    }

    const getRandomText = () => {
        let result = "";
        const characters =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < import.meta.env.VITE_PROJECT_TITLE.length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
        }
        return result;
    }


    return (
        <Container>
            <RandomTitle onClick={onClickHandler}>
                {title}
            </RandomTitle>
            <p
                style={{ cursor: userId ? "text" : "pointer" }}
                onClick={onClickUserIdHandler}
            >
                {userId ? userId : "Connect wallet"}
            </p>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const RandomTitle = styled.div`
    font-family: ${titleFont};
    color: ${textColor};
    font-size: 24px;
    font-weight: normal;
    text-transform: lowercase;
    cursor: pointer;
    user-select: none;
`;

export default Header;