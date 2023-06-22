import React, { useState, useContext } from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import { accentColor, lighterBackground } from "../styles";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { AuthButton, AuthButtonText } from './../styles';
import axios from 'axios';

const Login = () => {

  const handleEthereumLogin = async () => {
    // Check cookie
    const COOKIE_NAME = 'signed_signin_message';
  //   try {
  //     const cookie = localStorage.getItem(COOKIE_NAME);
  //     let signature: string, account: string;
  //     if (cookie) {
  //       const sigData = JSON.parse(cookie);
  //       account = sigData.ethAddress;
  //       signature = sigData.sig;
  //     } else {
  //       // Connect to browser wallet
  //       if (!window.ethereum) {
  //         console.error('Metamask is not installed. Signin aborted.');
  //         return;
  //       }
  //       const SIGNIN_MESSAGE = 'ZKParty sign-in';
  //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       account = accounts[0];
  //       console.debug(`Metamask account: ${account}`);
  //       // Sign message. TODO - put message in a constant that's also reachable from functions
  //       const signinMessage = `0x${Buffer.from(SIGNIN_MESSAGE).toString('hex')}`;
  //       console.log(`msg to be signed: ${signinMessage}`);
  //       signature = await window.ethereum.request({
  //         method: 'personal_sign',
  //         params: [signinMessage, account],
  //       });

  //       // Save cookie
  //       const sigData = { ethAddress: account, sig: signature };
  //       localStorage.setItem(COOKIE_NAME, JSON.stringify(sigData));
  //     }
  //     console.log(`Signature: ${signature}`);

  //     // Get JWT
  }


  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  return (
    <div>
      <AuthButton onClick={handleEthereumLogin} style={{ marginTop: '78px', }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitHubIcon htmlColor="#000" />
          <div style={{ width: '24px' }} />
          <AuthButtonText>Login</AuthButtonText>
        </div>
      </AuthButton>
      {/* <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={authState.manualAttestation}
              onChange={handleOptionChange}
              name="attest"
              color={"primary"}
            />
          }
          label="Manual attestation"
          style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}
        />
      </FormGroup> */}
    </div>
  );
};

export default Login;
