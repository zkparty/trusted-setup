import React, { useState, useContext, CSSProperties } from 'react'
//import GitHubIcon from "@mui/material-icons/GitHub";
import { accentColor, lighterBackground } from '../styles'
import { AuthButton, AuthButtonText } from './../styles'

interface Props {
  onClick: () => void
  style?: CSSProperties
}

const Login = (props: Props) => {
  const handleEthereumLogin = async () => {
    // Check cookie
    const COOKIE_NAME = 'signed_signin_message'
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

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {}

  return (
    <div>
      <AuthButton
        onClick={props.onClick}
        style={{ marginTop: '78px', ...props.style }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '24px' }} />
          <AuthButtonText>Join</AuthButtonText>
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
  )
}

export default Login
