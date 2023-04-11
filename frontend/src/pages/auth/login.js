import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { setId, setEmail, setIsLoggedIn, setName, setToken, setUsername } from '../../redux/slices/user-slice'
import { useEffect, useState } from 'react'
import { pb } from '../../api';

const AuthLogin = () => {

    const navigate = useNavigate()
    // ----- REDUX STATES -------
    const dispatch = useDispatch()

    const user_username = useSelector((state) => state.user.username)
    const user_token = useSelector((state) => state.user.token)
    const user_isLoggedIn = useSelector((state) => state.user.isLoggedIn)

    // ----- COMPONENT STATES -------
    const [error_username, setError_username] = useState('');
    const [error_token, setError_token] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [fail_after_request, setFailAfterRequest] = useState('');

    // ----- FORM HANDLERS -------
    const handleUserUsernameOrEmailChange = event => {
        event.preventDefault()
        if(event.target.value === '') {
            dispatch(setUsername(''))
            setError_username('The username cannot be empty')
            return
        }
        setError_username('')
        setFailAfterRequest('')
        dispatch(setUsername(event.target.value))
    }

    const handleUserTokenChange = event => {
        event.preventDefault()
        if(event.target.value === '') {
            dispatch(setToken(''))
            setError_token('The Password cannot be empty')
            return
        }
        setError_token('')
        setFailAfterRequest('')
        dispatch(setToken(event.target.value))
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if( error_username !== '' ||
            error_token !== ''
        ) {
            return
        }
        setFailAfterRequest('')
        
        try {
            const authData = await pb.collection('users').authWithPassword(
                user_username,
                user_token,
            );
            dispatch(setId(authData.record.id))
            dispatch(setEmail(authData.record.email))
            dispatch(setName(authData.record.name))
            dispatch(setUsername(authData.record.username))
            dispatch(setToken(authData.token))
            dispatch(setIsLoggedIn(true))
            setSuccessful(true)
        }
        catch(error) {
            if(error.response) {
                if(error.response.code === 400 && Object.keys(error.response.data).length > 0) {
                    Object.keys(error.response.data).forEach(key => {
                        if(key === 'password') {
                            setError_token(error.response.data[key].message)
                        }
                        if(key === 'identity') {
                            setError_username(error.response.data[key].message)
                        }
                    })
                }
                else {
                    setFailAfterRequest(error.message)
                }
            }
        }

    }

    // ----- USE EFFECTS -------
    useEffect(() => {
        document.title = "Login - rtdb"
        if(user_isLoggedIn === true) {
            navigate("/dashboard")
        }
    }, [])

    useEffect(() => {
        if(successful === true) {
            setTimeout(() => {
                navigate("/dashboard")
            }, 1500)
        }
    }, [successful])

    // ----- RENDER -------
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col md>
                <br />
                {
                    successful ?
                    <Alert key={'success'} variant={'success'}>
                        Login Successful
                    </Alert>
                    : <br />
                }
                {
                    fail_after_request !== '' ?
                    <Alert key={'danger'} variant={'danger'}>
                        {fail_after_request}
                    </Alert>
                    : <br />
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username or Email</Form.Label>
                        <Form.Control 
                            type="text" placeholder="Enter Username or Email" 
                            onChange={handleUserUsernameOrEmailChange}
                        />
                        <Form.Text className="text-danger">
                            {error_username}
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" placeholder="Password" 
                            onChange={handleUserTokenChange}
                        />
                        <Form.Text className="text-danger">
                            {error_token}
                        </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2 text-center">
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                        <Link to={`/auth/register`}>Don&quot;t have an account? Register</Link>
                    </div>
                    <br /><br />
                </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default AuthLogin;