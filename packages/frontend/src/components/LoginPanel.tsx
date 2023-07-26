import { WelcomeTitle, SubtleBody, NormalBodyText } from '../styles'
import Login from './Login'
import env from '../env'
import { Tooltip, Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import state from '../contexts/state'
import { State } from '../types/ceremony'
import { styled } from 'styled-components'

const LoginPanel = observer((props: any) => {
  const [name, setName] = useState('')
  const { ui, entropy, ceremony } = useContext(state) as State
  const [inputText, setInputText] = useState('')

  const onChangeInput = (e: any) => {
    setInputText(e.target.value)
  }

  const onMoveDiv = (e: any) => {
    const secret = inputText + e.clientX + e.clientY + performance.now()
    entropy.setSecret(`${entropy.secret}${secret}`)
  }

  const onClickJoin = () => {
    ceremony.join(name, entropy.generateEntropy(ceremony.numberOfCircuits))
    console.log('join ceremony')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <WelcomeTitle>{env.projectName}</WelcomeTitle>
      <div style={{ height: '41px' }} />
      <SubtleBody style={{ textAlign: 'center' }}>
        {`Trusted Setup Ceremony`}
      </SubtleBody>
      <NormalBodyText style={{ marginTop: '8px' }}>
        {`Join ceremony:`}
      </NormalBodyText>
      <NormalBodyText style={{ marginTop: '8px' }}>
        <div>
          <Tooltip title="This name will be permanently associated with this contribution. Choose anything you like, it doesn't have to be unique.">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Input
                type="text"
                placeholder="contributor name"
                value={name}
                style={{ height: '30px' }}
                onChange={(e) => setName(e.target.value)}
              />
              <div style={{ width: '4px' }} />
            </div>
          </Tooltip>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {`Enter a secret:`}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Input
              placeholder="secret"
              style={{ marginTop: '8px' }}
              type="password"
              onChange={onChangeInput}
            />
          </div>
          <div style={{ marginBlock: '10px' }}>
            <p style={{ margin: '0px', marginBlock: '5px' }}>
              Move your mouse around in this box:
            </p>
            <div
              style={{
                height: '100px',
                borderRadius: '4px',
                cursor: 'crosshair',
                background: '#95a7ae',
              }}
              onMouseMove={onMoveDiv}
            ></div>
          </div>
        </div>
        {/*`The ceremony is not currently accepting contributions.`*/}
      </NormalBodyText>
      <Login onClick={onClickJoin} style={{ marginTop: '20px' }} />
    </div>
  )
})

const Input = styled.input`
  font-family: inherit;
  font-weight: 700;
  text-align: center;
  height: 30px;

  color: black;
  background: #95a7ae;
  border-radius: 4px;
  border: none;
  padding-block: 3px;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #3c5660 !important;
  }
`

export default LoginPanel
