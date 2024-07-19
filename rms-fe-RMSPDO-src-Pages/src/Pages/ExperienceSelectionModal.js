// InterestedModal.js
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postReq,putReq } from '../Api/api';
import { useSelector } from "react-redux";
import './Model.css';
import MultiRangeSlider from "multi-range-slider-react";
function ExperienceSelectionModal(props) {
  const [isModalOpen, setModalOpen] = useState(true);
  const select = useSelector((state) => state?.login?.tasks);
  const handleClose = () => {props.onClose()};
  // console.log(select[0].employeeId);
  const [minValue, set_minValue] = useState(props.min_value);
  const [maxValue, set_maxValue] = useState(props.max_value);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  const url = process.env.REACT_APP_URL;
  const HandleOk = () => {
    try {
        // console.log(minValue);
        // console.log(maxValue);
    props.setMaxValue(maxValue);
    props.setMinValue(minValue);   
    props.setSliderValue(minValue+"-"+maxValue);
    props.onClose();
    } catch(e) {
    // console.log(e);
  }
  }
  const HandleClear=()=>
  {
    props.setSliderValue("Select Experience");
    props.setMinValue(0); 
    props.setMaxValue(30);
    props.onClose();
  }
  return (
    <>
      <Modal show={isModalOpen} onHide={props.onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body ><MultiRangeSlider
                min={0}
                max={30}
                step={3}
                minValue={minValue}
                maxValue={maxValue}
                canMinMaxValueSame={true}
                barLeftColor='red'
                barInnerColor='#fec601'
                barRightColor='red'
                thumbLeftColor='lightseagreen'
                thumbRightColor='lightseagreen'
                onInput={(e)=>handleInput(e)}
                style={{ border: 'none', boxShadow: 'none', padding: '15px 10px',marginTop:'2.5%' }}
              />
              <hr></hr>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <div>
    <Button className='saveBtn' variant="secondary" onClick={HandleOk}>
      Ok
    </Button>
    <Button className='cancelBtn' variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
  </div>
  <Button className='clearBtn' variant="secondary" onClick={HandleClear}>
    Clear
  </Button>
</div></Modal.Body>
        {/* <Modal.Footer>
          <Button className='saveBtn' variant="secondary" onClick={HandleOk}>
            Ok
          </Button>
          <Button className='cancelBtn' variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ExperienceSelectionModal;
