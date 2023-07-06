import React, { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, ListItemText, Menu, MenuProps, MenuItem, IconButton, Toolbar, useScrollTrigger } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { ZKTitle } from "./Title";
import {
  accentColor,
  secondAccent,
  textColor,
  background,
  darkerBackground,
  NormalBodyText,
  subtleText,
  lighterBackground,
} from "../styles";
import Options from './Options';
import { CeremonyProgress } from './ProgressPanel';
import state from '../contexts/state';
import { observer } from 'mobx-react-lite';
import { State } from '../types/ceremony';

const allowOptions = false; // if true, the 'Options' panel is available

interface ScrollProps {
  children: React.ReactElement;
}

function ElevationScroll(props: ScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: {backgroundColor: background},
  });
}

const StyledMenu = styled(Menu, {
  paper: {
    border: `1px solid ${lighterBackground}`,
    background: background,
    color: accentColor,
  },
})`
    elevation: 0,
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
  }
`;

const StyledMenuItem = styled(MenuItem)
  (() => ({
  root: {
    '&:focus': {
      backgroundColor: "unset",
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: textColor,
      },
    },
  },
}));

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//     },
//     menuButton: {
//       marginRight: theme.spacing(2),
//     },
//     title: {
//       flexGrow: 1,
//     },
//   }),
// );

interface MainMenuProps {
  anchorEl: Element | ((element: Element) => Element) | null | undefined; 
  handleClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined; 
  logout: () => void;
}

const MainMenu = observer((props: MainMenuProps) => {
  const [openOptions, setOpenOptions] = useState(false);
  const { ceremony } = useContext(state) as State;

  const enableLogout = (ceremony.authenticated);

  const toggleOptions = () => {
    setOpenOptions(open => {
      if (props.handleClose) props.handleClose({}, 'backdropClick');
      return !open;
    });
  }

  return (
    <span>
      <StyledMenu
        id="customized-menu"
        anchorEl={props.anchorEl}
        keepMounted
        open={Boolean(props.anchorEl)}
        onClose={props.handleClose}
      >
        <StyledMenuItem>
          <ListItemText primary="Logout"  
            onClick={ enableLogout ? props.logout : undefined } 
            style={{ color: (enableLogout ? textColor : subtleText) }} />
        </StyledMenuItem>
        {allowOptions ? (
          <StyledMenuItem>
            <ListItemText primary="Options" onClick={toggleOptions} style={{ color: textColor }} />
          </StyledMenuItem>
          ) : (<div></div>) 
        }
      </StyledMenu>
      <Options open={openOptions} close={toggleOptions} />
    </span>
  );
});

const LoginDetails = observer(() => {
  const { ceremony } = useContext(state) as State;

  const userName = ceremony.authenticated ? ceremony.userId : 'Connect';

  return (<span style={{ color: textColor }}>{userName}</span>);
});

const ButtonAppBar = observer(() => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const { ceremony, ui } = useContext(state) as State;
  //const classes = useStyles();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Toggle menu
    if (menuAnchorEl) {
      handleMenuClose();
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
      
  const handleLogout = () => {
    console.debug('logging out');
    // ceremony.logout ????
    handleMenuClose();
  }

  const displayProgress = ((
    ceremony.inQueue || 
    ceremony.contributing)
    && !ui.progressIsVisible
  );

  const menuIcon = (
      menuAnchorEl ? 
        (<CloseIcon style={{ color: textColor }}/>)
      : (<MenuIcon style={{ color: textColor }}/>)
  );
      
  return (
    <div /*className={root}*/>
      <ElevationScroll>
        <AppBar color='default'>
          <Toolbar>
            <IconButton 
              edge="start" 
              /*className={MenuItemClasses.menuButton} */
              color="inherit" 
              aria-label="menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              >
              {menuIcon}
            </IconButton>
            <MainMenu anchorEl={menuAnchorEl} handleClose={handleMenuClose} logout={handleLogout} />
            <ZKTitle title={ceremony.project} />
            {displayProgress ? 
              <div style={{ display: 'flex' }}>
                {/*<NormalBodyText>Your contribution: </NormalBodyText>*/}
                <CeremonyProgress format='bar' 
                  barColor={(ceremony.inQueue) ? subtleText : accentColor}
                />
              </div> 
            : (<></>)}
            <LoginDetails />
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </div>
  );
});

export default ButtonAppBar;
