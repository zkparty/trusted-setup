import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './constants';
import RequireAuth from '../components/helpers/RequireAuth';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import Wait from '../pages/Wait';
import Contribute from '../pages/Contribute';
import Complete from '../pages/Complete';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.SIGNIN,
    element: <SignIn />,
  },
  {
    path: ROUTES.WAIT,
    element: <RequireAuth>
      <Wait />
    </RequireAuth>,
  },
  {
    path: ROUTES.CONTRIBUTE,
    element: <RequireAuth>
      <Contribute />
    </RequireAuth>,
  },
  {
    path: ROUTES.COMPLETE,
    element: <RequireAuth>
      <Complete />
    </RequireAuth>,
  },
]);

export default router;
