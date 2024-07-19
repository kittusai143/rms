// InterestedModal.js
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postReq,putReq } from '../Api/api';
import { useSelector } from "react-redux";
import './Model.css';

function InterestedModal(props) {
  const url = process.env.REACT_APP_URL;
  const [isModalOpen, setModalOpen] = useState(true);
  const select = useSelector((state) => state?.login?.tasks);
  const handleClose = () => {props.onClose()};
  // console.log(select[0].employeeId);

  const HandleInterested = () => {
    // console.log(props?.rejection)
    if(props?.rejection) {
      putReq(`${url}ResourceAllocProcess/update/${props.value}`, {
        "updatedBy": select[0].employeeId,
        "processStatus": 'Interested', 
      }).then((response) => {
        if (response.data) {
          props.SToast("Resource Allocation request submitted successfully.");
          props.onRefresh();
          props.onClose();
        } else {
          props.EToast("Resource Allocation request failed.");
        }
      })

    } else {
      postReq(`${url}ResourceAllocProcess/create`, {
        "createdBy": select[0].employeeId,
        "processStatus": "Interested",
        "resAllocId": props.EmployeeRow.resource.allocationId,
        "silId": props.EmployeeRow.resource.silId,
      }).then((response) => {
        if (response.data) {
          props.SToast("Resource is marked as Interested successfully.");
          props.onRefresh();
          props.onClose();
        } else {
          props.EToast("Failed to mark resource as Interested.");
        }
      })
    }
  }

  return (
    <>
      <Modal show={isModalOpen} onHide={props.onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Interested</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you Interested in the Resource "{props.resourceName}"</Modal.Body>
        <Modal.Footer>
          <Button className='saveBtn' variant="secondary" onClick={HandleInterested}>
            Yes
          </Button>
          <Button className='cancelBtn' variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InterestedModal;
