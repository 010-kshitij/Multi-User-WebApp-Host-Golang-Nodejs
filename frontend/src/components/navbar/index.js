import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../logo.svg';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { setEmail, setIsLoggedIn, setName, setToken, setUsername } from '../../redux/slices/user-slice';
import {pb} from '../../api';

function AppNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  // ----- REDUX STATES -------
  const dispatch = useDispatch();

  const user_name = useSelector((state) => state.user.name);
  const user_isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // ----- HANDLERS ---------
  const handleLogout = event => {
    event.preventDefault();
    pb.authStore.clear();
    dispatch(setName(''));
    dispatch(setEmail(''));
    dispatch(setUsername(''));
    dispatch(setToken(''));
    dispatch(setIsLoggedIn(false));
  }

  // ----- USE EFFECTS -------
  useEffect(() => {
    if(user_isLoggedIn === false && 
      location.pathname !== '/' &&
      location.pathname !== '/auth/login' &&
      location.pathname !== '/auth/register') {
        navigate('/auth/login')
    }
  }, [user_isLoggedIn]);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <code>rtdb</code>
          </Navbar.Brand>
          {
            user_isLoggedIn ? <>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <em>Signed in as</em>: <strong>{user_name}</strong> - &nbsp;
                <Button variant='outline-light' onClick={handleLogout}>Logout</Button>
              </Navbar.Text>
            </Navbar.Collapse>
            </>
            : <></>
          }
          
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavBar;