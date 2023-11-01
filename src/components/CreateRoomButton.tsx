import React, { useState } from 'react';
import styled from 'styled-components';
import addroom from '../images/main/addroom.svg';
import { getCookie } from '../auth/cookie';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import CreateRoomModal from '../pages/home/components/CreateRoomModal';
import { MdOutlineAddHome } from 'react-icons/md';

type CreateRoomButtonProps = {};

const CreateRoomButton: React.FC<CreateRoomButtonProps> = () => {
  const token = getCookie('token');
  const [openCreateRoom, setOpenCreateRoom] = useState(false);

  const onClickCreateRoomButton = () => {
    setOpenCreateRoom(!openCreateRoom);
  };

  return (
    <>
      <Button onClick={onClickCreateRoomButton}>
        {token ? (
          <>
            <Icon>
              <MdOutlineAddHome />
            </Icon>
            <p>방만들기</p>
          </>
        ) : (
          <Login to="/login">로그인</Login>
        )}
      </Button>
      {openCreateRoom && (
        <CreateRoomModal setOpenCreateRoom={setOpenCreateRoom} />
      )}
    </>
  );
};

const Login = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: #006eff;
`;

const Icon = styled.div`
  color: #006eff;
  font-size: 40px;
  margin-bottom: 5px;
`;

const Button = styled.button`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  position: fixed;
  bottom: 100px;
  right: 100px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 5px solid #006eff;
  box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.25);
  /* transition: 0.5s ease-in-out; */

  &:hover {
    background-color: #006eff;
    border: 5px solid white;
    
    > p {
      color: white;
      font-size: 18px;
      font-weight: 700;
    }
    ${Icon} {
      color: white;
    }
    ${Login} {
      color: white;
    }
  }

  > img {
    width: 45px;
    margin-left: 5px;
  }
  > p {
    color: #006eff;
    font-size: 18px;
    font-weight: 700;
  }
`;
export default CreateRoomButton;
