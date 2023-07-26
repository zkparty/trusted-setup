import { Button, Dialog,  DialogProps, IconButton, Typography, DialogTitle, DialogContent, DialogActions, DialogTitleClasses, styled } from '@mui/material';
import { createStyles, Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { background, darkerBackground, inverseText, lightBorder, textColor } from '../styles';

function getModalStyle() {
  const top = 0;
  const left = 0;

  return {
    top: `${top}%`,
    left: `${left}%`,
    height: '100%',
    width: '100%',
    backgroundColor: background,
    //opacity: '0.8',
    padding: '50px',
  };
}
  
const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    paper: {
      position: 'absolute',
      transform: `translate(-20%, -5%)`,
      top: '30%',
      left: '40%',
      width: '60%',
      backgroundColor: darkerBackground,
      border: `2px solid ${textColor}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    backDrop: {
      position: 'fixed', /* Stay in place */
      //zIndex: -1, /* Sit on top */
      left: 0,
      top: 0,
      width: '100%', /* Full width */
      height: '100%', /* Full height */
      overflow: 'auto', /* Enable scroll if needed */
      /*backgroundColor: rgb(0,0,0), /* Fallback color */
      /*backgroundColor: background,*/
      backgroundColor: 'rgba(14,41,54,0.8)', /* Black w/ opacity */
      /* opacity: '0.8',*/
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: textColor,
    },
    title: {
      color: textColor,
      backgroundColor: darkerBackground,
    }
  });

export interface DialogTitleProps {
  id: string;
  classes: Partial<DialogTitleClasses>; 
  children?: React.ReactNode;
  onClose: () => void;
}

const ModalDialogTitle = (props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.root} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const ModalDialogContent = styled(DialogContent)(
{
  root: {
    padding: '60px',
    display: 'flex', 
    justifyContent: 'center', 
    color: textColor,
    backgroundColor: background,
    border: `1px solid ${lightBorder}`,
    boxSizing: 'border-box',
    maxWidth: '656px',
  },
});

const ModalDialogActions = styled(DialogActions)((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}));

export default function ContentModal(props: 
  {open: boolean, close: ()=>void, title?: string | JSX.Element, body:JSX.Element}) {
    //const classes = useStyles(styles);

    return (
      <Dialog
          open={props.open}
          onClose={props.close}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          maxWidth='lg'
          scroll='paper'          
      >
      {/*  <div style={{ position: 'fixed', top: 0, right: 0 }}>
          <Button onClick={props.close} style={{ color: textColor }}>
            <CloseIcon />
          </Button>
    </div> */}
        <ModalDialogTitle id='scroll-dialog-title' onClose={props.close} classes={{}}>
          {props.title}
        </ModalDialogTitle>
        <ModalDialogContent dividers={true} >
          {props.body}
        </ModalDialogContent>
      </Dialog>
    );
}
  