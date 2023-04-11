import { Alert, Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import AppListItem from "../../components/dashbord/list-item";
import {setName, setSlug, setIsEditing} from '../../redux/slices/project-slice';
import { useNavigate } from "react-router-dom";
import { pb } from '../../api';
import { useDispatch } from "react-redux";

const DashboardProjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ------ STATES ------
    const [projects, setProjects] = useState([]);

    // ------ HANDLERS -----
    const handleAddButton = event => {
        event.preventDefault();
        navigate('/dashboard/project/modify');
    }

    // ------ USE EFFECT --
    useEffect(() => {
        document.title = "Dashboard - Projects - rtdb"

        const promise = pb.collection('projects').getFullList({
            sort: '-created',
        });
        promise.then(records => {
            setProjects(records);
        }).catch(error => {
            console.log(error);
        });

        dispatch(setName(''));
        dispatch(setSlug(''));
        dispatch(setIsEditing(false))
    }, [])

    // ------ RENDER ------
    return <>
        <Container>
            <Row>
                <Col md={10}>
                    <p className="display-6">
                        Projects
                    </p>
                </Col>
                <Col>
                    <Button variant="success" className="mt-2"
                        onClick={handleAddButton}
                    >
                        + Add Project
                    </Button>
                </Col>
            </Row>
            
            <hr />
            {
                projects.length < 1 ?
                <Alert variant="secondary">
                    There are no Projects
                </Alert>
                :
                <ListGroup as="ol" numbered>
                {
                    projects.map(project => {
                        return <AppListItem key={project.id} project={project} />
                    })
                }
                </ListGroup>
            }
        </Container>
    </>
}
export default DashboardProjects;