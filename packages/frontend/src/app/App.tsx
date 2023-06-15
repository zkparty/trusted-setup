import * as React from 'react';
import { Routes, Route } from 'react-router-dom'
import { createGlobalStyle } from "styled-components";
import { background, textColor } from "../styles";
import { LandingPage } from "./LandingPage";
import { AuthContextProvider } from "../state/AuthContext";
import { SelectionContextProvider } from '../state/SelectionContext';
import { ComputeContextProvider } from '../state/ComputeStateManager';
import Home from '../pages/Home'

type AppProps = {
  project?: string | null
};

const App = (props: AppProps) => {

  return (
    <AuthContextProvider project={props.project || undefined}>
      <SelectionContextProvider>
        <ComputeContextProvider>
            <GlobalStyle />
            <LandingPage />
            <Routes>
              <Route path="/" >
                <Route index element={<Home />} />
              </Route>
            </Routes>
        </ComputeContextProvider>
      </SelectionContextProvider>
    </AuthContextProvider>
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
