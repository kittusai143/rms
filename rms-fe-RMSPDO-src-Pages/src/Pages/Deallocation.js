import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { putReq } from '../Api/api';
import { useSelector } from "react-redux";
import '../CSS/Deallocation.css';
import { Input } from 'reactstrap';

function Deallocation(props) {
  const url = process.env.REACT_APP_URL;
  const [isModalOpen, setModalOpen] = useState(true);
  const [resourcename, setResourceName] = useState();
  const [resultid, setResultId] = useState();
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [extend, setExtend] = useState(false);
  const [deallocation, setDeallocation] = useState(false);
  const [extendedDate, setExtendedDate] = useState();
  const [isDefault, setIsDefault] = useState(true);

  const select = useSelector((state) => state?.login?.tasks);
  const handleClose = () => {
    setErrors({});
    props.onClose();
    setIsDefault(true);
    setDeallocation(false);
    setExtend(false);
  };
  // const validateSave = () => {
  //   const errors = {};
  //  if (startdate > enddate) {
  //     errors["end date"] = "End date must be greater than start date";
  //   }
  //   return errors;
  // };

  const findResourceUsingItem = () => {
    const res = props.groups?.find((obj) => obj?.id === props.ItemId);
    const result = res?.item?.processes?.find(obj =>
      ((obj.createdBy === select[0].employeeId) || (select[0].empRoleName === "PMO Analyst")) && (obj.processStatus === "Allocated" || obj.processStatus === "De-Allocation Rejected"))
    setResultId(result?.id);
    setResourceName(res);
  };

  useEffect(() => {
    findResourceUsingItem();
  }, []);

  const HandleDeallocation = async () => {
    let errors = {};
    if (reason.trim() !== "" || (extend && extendedDate && new Date(extendedDate) > (new Date(resourcename.item.processes[0].allocEndDate)))) {
      setErrors({});
      await putReq(`${url}ResourceAllocProcess/update/${resultid}`, {
        updatedBy: select[0].employeeId,
        processStatus: deallocation ? 'De-Allocation Requested' : extend ? 'Allocation Extension Requested' : '',
        ...(deallocation && { deAllocReason: reason }),
        ...(extend && { extendedDate: extendedDate })
      }).then((response) => {
        if (response) {
          props.onRefresh();
          if (deallocation) {
            props.SToast("Resource De-Allocation request submitted successfully.");
            setDeallocation(false);
          } else if (extend) {
            props.SToast("Resource Allocation extension request submitted successfully.");
            setExtend(false);
          }
          props.onClose();
        } else {
          if (deallocation) {
            props.EToast("Resource De-Allocation request failed.");
          } else if (extend) {
            props.EToast("Resource Allocation extension request failed.");
          }
        }
      });
    } else {
      if (extend && extendedDate < ((resourcename?.item.processes[0]?.allocEndDate))) {
        errors["validateEnterDate"] = (extend) ? 'Please choose a date that falls after the current allocation end date' : '';
      }
      else {
        errors["text"] = extend ? 'Select the End-Date' : 'Enter the Reason';
      }
      setErrors(errors);
    }
  };
  // console.log(new Date(resourcename?.item?.processes[0]?.extendedDate))
  return (
    <>
      <Modal show={isModalOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isDefault && 'Select Action'}
            {deallocation && 'De-Allocation'}
            {extend && 'Extend Allocation End-date'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isDefault && (
            <div style={{ marginRight: '12%' }}>
              <Button onClick={() => { setDeallocation(true); setIsDefault(false); }}>
                De-Allocation
              </Button>
              <Button onClick={() => { setExtend(true); setIsDefault(false); }}>
                Project Extension
              </Button>
            </div>
          )}
          <div>
            {deallocation && `De-Allocate the Resource "${resourcename?.title}"`}
            {extend && `Extend Project enddate for the Resource "${resourcename?.title}"`}
          </div>
          {extend && (
            <div>
              {`Current Project enddate: ${(new Date(resourcename?.item?.processes[0]?.allocEndDate)).toLocaleDateString()}`}
            </div>
          )}
          {(deallocation || extend) && (
            <div className='mt-2'>
              <label htmlFor="textarea-disabled">{deallocation ? 'Reason:' : 'Extended End-Date:'}</label>
              {deallocation && <Input type='textarea' className="input" id="textarea-disabled" onChange={(e) => setReason(e.target.value)}></Input>}
              {extend && <Input type='date' className="input" min={resourcename ? (new Date(resourcename.item.processes[0].allocEndDate)).toISOString().split('T')[0] : ''} onChange={(e) => setExtendedDate(e.target.value)}></Input>}
            </div>
          )}
          {errors["text"] && (
            <p style={{
              width: '100%',
              marginTop: '0.20rem',
              fontSize: '0.800em',
              color: 'var(--bs-form-invalid-color)'
            }}>
              {errors["text"]}
            </p>
          )}
          {errors["validateEnterDate"] && (
            <p style={{
              width: '100%',
              marginTop: '0.20rem',
              fontSize: '0.800em',
              color: 'var(--bs-form-invalid-color)'
            }}>
              {errors["validateEnterDate"]}
            </p>
          )}
        </Modal.Body>
        {!isDefault && (
          <Modal.Footer>
            <Button className='saveBtn' variant="secondary" onClick={() => { HandleDeallocation() }}>
              Submit
            </Button>
            <Button className='cancelBtn' variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default Deallocation;
