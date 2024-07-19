import React, { useEffect, useState } from "react";
import { Input, Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { postReq, putReq } from "../Api/api";
import styled from 'styled-components';

const StyledModalFooter = styled(Modal.Footer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 55px;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s;

  &.saveBtn {
    background-color: #007bff;
    border-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
      border-color: #004085;
    }
  }

  &.cancelBtn {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;

    &:hover {
      background-color: #5a6268;
      border-color: #545b62;
    }
  }
`;

const StyledModalBody = styled(Modal.Body)`
  overflow-x: hidden;
  padding: 20px;
  background-color: #f8f9fa;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StyledListItem = styled.li`
  background: ${props => (props.selected ? '#d1e7dd' : '#fff')};
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ItemName = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
`;

const BenchExit = ({ onClose, SToast, EToast ,fetchData}) => {
    const url = process.env.REACT_APP_URL;
    const [isModalOpen, setModalOpen] = useState(true);
    const [date, setDate] = useState();
    const [available, setAvailable] = useState([]);
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [API, setAPI] = useState({
        techGroups: [],
        roles: [],
        skills: [],
        yearsOfExp: [],
        locations: [],
        domains: [],
        availability: [],
        availForeCastWeeks: null
    });
    const [filteredGroups, setFilteredGroups] = useState();

    const fetchAvailable = async () => {
        try {
            const response = await postReq(`${url}ResAlloc/filter`, API);
            if (response) {
                // console.log(response.data);
                const activeResources = response?.data?.filter((resource) => resource.resource.status === "Active");
                setAvailable(activeResources);
                setFilteredGroups(activeResources);
            }
        } catch (error) {
            console.error("Error fetching available resources:", error);
        }
    }

    useEffect(() => {
        fetchAvailable();
    }, []);

    useEffect(() => {
        handleSearchClick(input);
    }, [input]);

    function handleSearchClick(searchVal) {
        const trimmedSearchVal = searchVal.trim();
        if (trimmedSearchVal === "") {
            setAvailable(filteredGroups);
            return;
        }
        const filterBySearch = filteredGroups?.filter((group) =>
            group?.resource?.name.toLowerCase().includes(trimmedSearchVal.toLowerCase())
        );

        setAvailable(filterBySearch);
    }

    const handleItemClick = (index) => {
        setSelectedItem(index);
        setDate(true);
    };
const submitexit=async(selectedItem)=>{
    
// console.log(available[selectedItem].resource.allocationId,available[selectedItem])
await putReq(`${url}ResAlloc/updateStatus/${available[selectedItem]?.resource?.allocationId}`,{
    status:"Exit"
}).then((res)=>
{
    if(res)
    {
        onClose();
        fetchData();
        SToast(`${available[selectedItem]?.resource?.name} marked as bench-exit`)

    }
})
}
    return (
        <div className="AllocationContainer">
            <Modal show={isModalOpen} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Mark Bench Exit</Modal.Title>
                </Modal.Header>
                <StyledModalBody>
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value) }}
                        placeholder="Search Resource Name ..."
                        style={{
                            borderRadius: "25px",
                            paddingRight: "40px",
                            marginBottom: "1%"
                        }}
                    />
                    <StyledList>
                        {available?.map((res, index) => (
                            <StyledListItem
                                key={index}
                                selected={selectedItem === index}
                                onClick={() => handleItemClick(index)}
                            >
                                <ItemName>{res?.resource?.name}</ItemName>
                            </StyledListItem>
                        ))}
                    </StyledList>
                </StyledModalBody>
                <Modal.Footer>
                    <StyledModalFooter>
                        <ButtonsContainer>
                            {date && (
                                <>
                                    {/* <DateContainer>
                                        <label>Exit Date</label>
                                        <input type="date" />
                                    </DateContainer> */}
                                    <StyledButton className="saveBtn" onClick={()=>{submitexit(selectedItem)}}>
                                        Submit
                                    </StyledButton>
                                    <StyledButton className="cancelBtn" onClick={() => onClose()}>
                                        Cancel
                                    </StyledButton>
                                </>
                            )}
                        </ButtonsContainer>
                    </StyledModalFooter>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BenchExit;
