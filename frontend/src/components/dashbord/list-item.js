import { Button, ButtonGroup } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { useSelector, useDispatch } from 'react-redux';
import {setId, setName, setSlug, setIsEditing} from '../../redux/slices/project-slice';
import {useEffect} from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import {pb} from '../../api';

function AppListItem({key, project}) {
  const navigate = useNavigate();
  // ----- REDUX STATES -----
  const dispatch = useDispatch();
  const project_isEditing = useSelector((state) => state.project.isEditing);

  // ----- HANDLE EVENTS -----
  const handleEditButton = event => {
    event.preventDefault();
    dispatch(setId(project.id)); 
    dispatch(setName(project.name)); 
    dispatch(setSlug(project.slug)); 
    dispatch(setIsEditing(true));
    navigate('/dashboard/project/modify');
  }

  const handleDeleteButton = async event => {
    event.preventDefault();
    let shallDelete = window.confirm('Are you sure you wat to delete this project?');
    if(shallDelete === true) {
      await pb.collection('projects').delete(project.id);
      window.location.reload();
    }
  } 

  // ----- USE EFFECT ----
  
  // ----- RENDER -----
  return (
      <ListGroup.Item
        key={key}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{project.name}</div>
          {project.slug}
        </div>
        <ButtonGroup aria-label="Basic example">
            <Button variant="warning" onClick={handleEditButton}>Edit</Button>
            <Button variant="danger" onClick={handleDeleteButton}>Delete</Button>
        </ButtonGroup>
      </ListGroup.Item>
  );
}

export default AppListItem;