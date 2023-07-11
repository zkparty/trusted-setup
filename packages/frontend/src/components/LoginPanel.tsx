import { WelcomeTitle, SubtleBody, NormalBodyText } from '../styles'
import Login from './Login'
import env from '../env'
import { Tooltip, Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import state from '../contexts/state'
import { State } from '../types/ceremony'

const LoginPanel = observer((props: any) => {
  const [name, setName] = useState('')
  const { ui, entropy, ceremony } = useContext(state) as State
  const [inputText, setInputText] = useState('')
  const [mouseCoordinate, setMouseCoordinate] = useState([0, 0])

  const onChangeInput = (e: any) => {
    setInputText(e.target.value)
    console.log(e.target.value)
  }

  const onMoveDiv = (e: any) => {
    // TODO-NICO: we need to save all coordinates and their timestamp
    setMouseCoordinate([e.clientX, e.clientY])
    console.log(e.clientX, e.clientY)
  }

  const onClickJoin = () => {
    const secret = inputText + mouseCoordinate[0] + mouseCoordinate[1]
    entropy.setSecret(secret)
    ceremony.join(name)
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
        {`Join ceremony`}
      </NormalBodyText>
      <NormalBodyText style={{ marginTop: '8px' }}>
        <div>
          <Tooltip title="This name will be permanently associated with this contribution. Choose anything you like, it doesn't have to be unique.">
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                placeholder="contributor name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div style={{ width: '4px' }} />
            </div>
          </Tooltip>
        </div>
        {
          <>
            <h3 style={{ marginBlock: '15px' }}>Entropy section</h3>
            <div style={{ display: 'flex', marginBlock: '10px' }}>
              <p style={{ margin: '0px', marginRight: '5px' }}>
                Enter a secret:
              </p>
              <input type="password" onChange={onChangeInput} />
            </div>
            <div style={{ marginBlock: '10px' }}>
              <p style={{ margin: '0px', marginBlock: '5px' }}>
                Move your move around the square below:
              </p>
              <div
                style={{
                  width: '300px',
                  height: '100px',
                  cursor: 'crosshair',
                  background: 'grey',
                }}
                onMouseMove={onMoveDiv}
              ></div>
            </div>
          </>
        }
        {/*`The ceremony is not currently accepting contributions.`*/}
      </NormalBodyText>
      <Login onClick={onClickJoin} style={{ marginTop: '20px' }} />
    </div>
  )
})

export default LoginPanel
