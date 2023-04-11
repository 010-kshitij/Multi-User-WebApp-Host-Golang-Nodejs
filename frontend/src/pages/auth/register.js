import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { setEmail, setName, setToken, setUsername } from '../../redux/slices/user-slice'
import { useEffect, useState } from 'react'
import { pb } from '../../api';

const AuthRegister = () => {

    const navigate = useNavigate();
    // ----- REDUX STATES -------
    const dispatch = useDispatch();

    const user_name = useSelector((state) => state.user.name);
    const user_username = useSelector((state) => state.user.username);
    const user_email = useSelector((state) => state.user.email);
    const user_token = useSelector((state) => state.user.token);
    const user_isLoggedIn = useSelector((state) => state.user.isLoggedIn);


    // ----- COMPONENT STATES -------
    const [error_name, setError_name] = useState('');
    const [error_username, setError_username] = useState('');
    const [error_email, setError_email] = useState('');
    const [error_token, setError_token] = useState('');
    const [error_confirmtoken, setError_confirmtoken] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [fail_after_request, setFailAfterRequest] = useState('');

    // ----- FORM HANDLERS -------
    const handleUserNameChange = event => {
        event.preventDefault()
        if(event.target.value === '') {
            dispatch(setName(''))
            setError_name('The name cannot be empty')
            return
        }
        setError_name('')
        setFailAfterRequest('')
        dispatch(setName(event.target.value))
    }

    const handleUserUsernameChange = event => {
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

    const handleUserEmailChange = event => {
        event.preventDefault()
        if(event.target.value === '') {
            dispatch(setEmail(''))
            setError_email('The email cannot be empty')
            return
        }
        setError_email('')
        setFailAfterRequest('')
        dispatch(setEmail(event.target.value))
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

    const handleUserConfirmTokenChange = event => {
        event.preventDefault()
        if(event.target.value !== user_token) {
            setError_confirmtoken('This value doesn\'t matches with Password')
            return
        }
        setError_confirmtoken('')
        setFailAfterRequest('')
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if(error_name !== '' ||
            error_username !== '' ||
            error_email !== '' ||
            error_token !== '' ||
            error_confirmtoken !== ''
        ) {
            return
        }
        setFailAfterRequest('')
        
        const data = {
            "username": user_username,
            "email": user_email,
            "emailVisibility": true,
            "password": user_token,
            "passwordConfirm": user_token,
            "name": user_name
        };
        try {
            await pb.collection('users').create(data);
            dispatch(setToken(''))
            setSuccessful(true);
        }
        catch(error) {
            if(error.response) {
                if(error.response.code === 400) {
                    Object.keys(error.response.data).forEach(key => {
                        if(key === 'password') {
                            setError_token(error.response.data[key].message)
                        }
                        if(key === 'email') {
                            setError_email(error.response.data[key].message)
                        }
                        if(key === 'username') {
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
        document.title = "Register - rtdb"
        if(user_isLoggedIn === true) {
            navigate("/dashboard")
        }
    }, [])

    useEffect(() => {
        if(successful === true) {
            setTimeout(() => {
                navigate("/auth/login")
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
                    Registration Successful
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
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" placeholder="Enter Name" 
                            onChange={handleUserNameChange}
                        />
                        <Form.Text className="text-danger">
                            {error_name}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" placeholder="Enter Username" 
                            onChange={handleUserUsernameChange}
                        />
                        <Form.Text className="text-danger">
                            {error_username}
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="text" placeholder="Enter Email" 
                            onChange={handleUserEmailChange}
                        />
                        <Form.Text className="text-danger">
                            {error_email}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" placeholder="Password" 
                            onChange={handleUserConfirmTokenChange}
                        />
                        <Form.Text className="text-danger">
                            {error_confirmtoken}
                        </Form.Text>
                    </Form.Group>
                    
                    <div className="d-grid gap-2 text-center">
                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                        <Link to={`/auth/login`}>Already have an account? Login</Link>
                    </div>
                    <br /><br />
                </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default AuthRegister;