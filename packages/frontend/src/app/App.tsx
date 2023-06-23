import * as React from 'react';
import { Routes, Route } from 'react-router-dom'
import { createGlobalStyle } from "styled-components";
import { background, textColor } from "../styles";
import { LandingPage } from "./LandingPage";

type AppProps = {
  project?: string | null
};

const App = (props: AppProps) => {

  return (
    <div>
      <GlobalStyle />
      <LandingPage />
      <Routes>
        <Route path="/" >
          <Route index element={<LandingPage />} />
        </Route>
      </Routes>
      </div>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${background};
    color: ${textColor};
    margin: 0;
    font-family: 'Inconsolata', monospace;
    font-size: 11pt;
  }
`;

export default App;
