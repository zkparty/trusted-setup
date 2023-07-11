import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Typography,
} from '@mui/material'
import * as React from 'react'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { State } from '../types/ceremony'
import state from '../contexts/state'
import env from '../env'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         paper: {
//             position: 'absolute',
//             width: 600,
//             backgroundColor: 'black',
//             border: '2px solid #fff',
//             boxShadow: theme.shadows[5],
//             padding: theme.spacing(2, 4, 3),
//         },
//         checkbox: {
//             color: 'white',
//         },
//         'checkbox:disabled': {
//             color: 'white',
//             opacity: 0.5,
//         }
//     }),
// );

// TODO - is this still needed?
const Options = observer((props: any) => {
  const { ui, ceremony } = useContext(state) as State
  //const classes = useStyles();

  const { authenticated, userId } = ceremony

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {}

  const manualAttest = (
    <div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={false}
              onChange={handleOptionChange}
              name="attest"
              disabled={authenticated}
              /*className={classes.checkbox}*/
            />
          }
          label="Manual attestation"
          classes={
            {
              /*root: classes.checkbox,
                        disabled: classes['checkbox:disabled'],*/
            }
          }
          style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}
        />
      </FormGroup>
    </div>
  )

  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={getModalStyle()} /*className={classes.paper}*/>
        {manualAttest}
        <br />
      </div>
    </Modal>
  )
})

export default Options
