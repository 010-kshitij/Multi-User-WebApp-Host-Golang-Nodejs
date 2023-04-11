import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import {setName, setSlug, setIsEditing} from '../../redux/slices/project-slice';
import { useEffect, useState } from 'react'
import { pb } from '../../api';

const DashboardProjectAddEdit = () => {

    const navigate = useNavigate()
    // ----- REDUX STATES -------
    const dispatch = useDispatch()

    const user_id = useSelector((state) => state.user.id);
    const user_username = useSelector((state) => state.user.username);
    const project_id = useSelector((state) => state.project.id);
    const project_name = useSelector((state) => state.project.name);
    const project_slug = useSelector((state) => state.project.slug);
    const project_isEditing = useSelector((state) => state.project.isEditing);

    // ----- COMPONENT STATES -------
    const [error_name, setError_name] = useState('');
    const [error_slug, setError_slug] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [fail_after_request, setFailAfterRequest] = useState('');

    // ----- FORM HANDLERS -------
    const handleProjectNameChange = event => {
        event.preventDefault();
        if(event.target.value === '') {
            dispatch(setName(''));
            setError_name('The name cannot be empty');
            return;
        }
        setError_name('');
        setFailAfterRequest('');
        dispatch(setName(event.target.value));
    }

    const handleProjectSlugChange = async event => {
        event.preventDefault();
        if(event.target.value === '') {
            dispatch(setSlug(''));
            setError_slug('The slug cannot be empty');
            return;
        }

        setError_slug('');
        setFailAfterRequest('');
        dispatch(setSlug(event.target.value));
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if( error_name !== '' ||
            error_slug !== ''
        ) {
            return
        }
        if( project_name === '' || project_slug === '' ) {
            setError_name('The name cannot be empty');
            setError_slug('The slug cannot be empty');
            return;
        }
        const records = await pb.collection('projects').getFullList({
            filter: `slug = "${user_username}/${project_slug}"`,
        });
        console.log(records, project_id);
        if(records.length > 0 && records[0].id !== project_id) {
            dispatch(setSlug(''));
            setError_slug('The slug already exists');
            return;
        }
        setFailAfterRequest('');
        
        try {
            const data = {
                "name": project_name,
                "slug": `${user_username}/${project_slug}`,
                "user": user_id
            };
            if(project_isEditing === false) {
                await pb.collection('projects').create(data);
            }
            else if(project_isEditing === true) {
                await pb.collection('projects').update(project_id , data);
            }
            dispatch(setName(''));
            dispatch(setSlug(''));
            dispatch(setIsEditing(false));
            setSuccessful(true);
        }
        catch(error) {
            if(error.response) {
                setFailAfterRequest(error.message)
            }
        }

    }

    // ----- USE EFFECTS -------
    useEffect(() => {
        document.title = "Dashboard - Add/Edit Project - rtdb";
        if(project_isEditing === false) {
            dispatch(setName(''));
            dispatch(setSlug(''));
        }
        else if(project_isEditing == true) {
            if(project_slug) {
                let slug = project_slug.split("/");
                dispatch(setSlug(slug[1]));
            }
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
            <p className='display-5'>{project_isEditing ? "Edit" : "Add"} Project</p>
            <Row>
                <Col md>
                <br />
                {
                    successful ?
                    <Alert key={'success'} variant={'success'}>
                        Project Successfully {project_isEditing ? "Modified" : "Added"}
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
                            type="text" placeholder="Enter Project Name" 
                            onChange={handleProjectNameChange}
                            value={project_name}
                        />
                        <Form.Text className="text-danger">
                            {error_name}
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control 
                            type="text" placeholder="Enter Unique Project Slug" 
                            onChange={handleProjectSlugChange}
                            value={project_slug}
                        />
                         <Form.Text className="text-muted">
                            Your project path will be - {user_username}/{project_slug}
                        </Form.Text>
                        <br />
                        <Form.Text className="text-danger">
                            {error_slug}
                        </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2 text-center">
                        <Button variant="primary" type="submit">
                            {project_isEditing ? "Edit" : "Add"} Project
                        </Button>
                    </div>
                    <br /><br />
                </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default DashboardProjectAddEdit;