import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import Picture from '../images/Picture.png';
import { Button } from '@mui/material';
import { useRecoilState } from 'recoil';
import { RoomAtom } from '../recoil/RoomAtom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getCookie, setTokenCookie } from '../auth/cookie';

type CreateRoomProps = {
  setOpenCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
};

// 썸네일 등록 버튼 스타일
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateRoomModal: React.FC<CreateRoomProps> = ({ setOpenCreateRoom }) => {
  const token = getCookie('token');

  const [room, setRoom] = useRecoilState(RoomAtom);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [isHobbyActive, setIsHobbyActive] = useState(false);
  const [image, setImage] = useState('');

  const categories = ['study', 'hobby'];
  const activeStates = { study: isStudyActive, hobby: isHobbyActive };

  const [maxUser, setMaxUser] = useState(1);

  const [selectedUserCount, setSelectedUserCount] = useState<number | null>(
    null,
  );

  const navigate = useNavigate();


  // 여기부터
  const [formData, setFormData] = useRecoilState(RoomAtom);

  const updateFormData = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const onChangeCategory = (category: string) => {
    if (category === 'study') {
      setIsStudyActive(true);
      setIsHobbyActive(false);
    } else if (category === 'hobby') {
      setIsStudyActive(false);
      setIsHobbyActive(true);
    }

    updateFormData('category', category);
  }

  const handleUserCountClick = (count: number) => {
    setSelectedUserCount(count);
    setMaxUser(count);
    updateFormData('count', count)
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        setImage(base64 as string);
        updateFormData('file', base64 as string)
      };
    }
  };

  const onSubmitRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // FormData 객체 생성
    const formData = new FormData();

    if (image) {
      console.log('이미지 있음')
      formData.append('file', image);
    }
    
    formData.append('title', room.title);
    formData.append('maxHeadcount', maxUser.toString());
    formData.append('category', isStudyActive ? 'study' : 'hobby');
    formData.append('note', room.note);

  
    console.log('formData title', formData.get('title'));
    console.log('formData maxHeadcount', formData.get('maxHeadcount'));
    console.log('formData category', formData.get('category'));
    console.log('formData note', formData.get('note'));
    console.log('formData file', formData.get('file'));

    try {
      console.log('try')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,  // JWT 토큰을 여기에 삽입해주세요
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL!}/room`,
        formData, config);

        console.log('Room created: ', response.data);
  
      // 성공시 로직
      if (response.data.createdRoom) {
        console.log('성공')
        alert('방만들기 성공!');
        navigate(`/room`);
      } else {
        console.log('실패ddzz', response.data)
      }
    } catch (error) {
      console.log('방 만들기 실패', error);
    }
  };

  return (
    <Container onSubmit={onSubmitRoom}>
      <BackGround />

      <ModalContent col justify="start">
        <Title>방 만들기</Title>
        <Thumbnail image={image}>
          {image ? <ThumbnailImg src={image} /> : <SampleImg src={Picture} />}
        </Thumbnail>
        <ThumbnailButtonGroup gap="10px">
          <Button
            component="label"
            sx={{
              color: 'gray',
              '&:hover': {
                backgroundColor: 'initial', // 여기서 'initial' 대신 원래 배경색을 넣어도 돼
                boxShadow: 'none', // 그림자 효과 제거
              },
            }}
          >
            썸네일 등록
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          
          <button onClick={(() => setImage(''))}>삭제</button>
        </ThumbnailButtonGroup>

        <Content col gap="15px">
          <Group col align="start">
            <Label>방 이름</Label>
            <RoomTitle
              type="text"
              // onChange={e => setRoom({ ...room, title: e.target.value })}
              onChange={e => updateFormData('title', e.target.value)}
            />
          </Group>

          <Group col align="start">
            <Label>목적 정하기</Label>

            <CategoryGroup gap="16px">
              {categories.map(category => (
                <Category
                  key={category}
                  type="button"
                  onClick={() => onChangeCategory(category)}
                  isActive={activeStates[category as 'study' | 'hobby']}
                >
                  {category === 'study' ? '스터디' : '취미'}
                </Category>
              ))}
            </CategoryGroup>
          </Group>

          <Group col align="start">
            <Label>인원설정 (최대 4인 가능)</Label>
            <CategoryGroup gap="16px">
              {[1, 2, 3, 4].map(i => (
                <MaxUser
                  key={i}
                  type="button"
                  onClick={() => handleUserCountClick(i)}
                  isActive={i === selectedUserCount}
                >
                  {i}인
                </MaxUser>
              ))}
            </CategoryGroup>
          </Group>

          <Group col align="start">
            <Label>엉덩이들의 유의사항</Label>
            <Precautions
              onChange={e => setRoom({ ...room, note: e.target.value })}
              placeholder="사용자 입력을 받으려면 여기에 입력하세요."
              style={{
                width: '100%',
                height: '100px',
                padding: '10px',
                borderRadius: '5px',
              }}
            />
          </Group>
        </Content>

        <ButtonGroup col gap="8px">
          <CreateRoomButton>방만들기</CreateRoomButton>
          <CancleButton type="button" onClick={() => setOpenCreateRoom(false)}>
            취소
          </CancleButton>
        </ButtonGroup>
      </ModalContent>
    </Container>
  );
};

const FlexContainer = styled.div<{
  col?: boolean;
  align?: string;
  justify?: string;
  gap?: string;
}>`
  display: flex;
  flex-direction: ${props => (props.col ? 'column' : 'row')};
  align-items: ${props => (props.align ? props.align : 'center')};
  justify-content: ${props => (props.justify ? props.justify : 'center')};
  gap: ${props => props.gap || '0'};
`;

const ThumbnailButtonGroup = styled(FlexContainer)`
  margin-top: 10px;
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Precautions = styled.textarea`
  width: calc(100% - 20px);
  height: 200px;
  resize: none;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-line; /* 엔터를 줄 바꿈으로 해석합니다. */
  overflow-y: auto; /* 내용이 넘치면 스크롤바가 표시되도록 설정할 수 있습니다. */
`;
const MaxUser = styled.button<{ isActive: boolean }>`
  width: 60px;
  height: 50px;
  background-color: ${props => (props.isActive ? 'black' : '#6e6e6e')};
  font-size: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
`;

const CategoryGroup = styled(FlexContainer)``;

const Category = styled.button<{ isActive: boolean }>`
  width: 166px;
  height: 50px;
  background-color: ${props => (props.isActive ? 'black' : '#6e6e6e')};
  font-size: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
`;

const Content = styled(FlexContainer)`
  display: flex;
  width: 654px;
  margin-top: 14px;
`;

const Label = styled.div`
  padding: 10px 0;
`;

const RoomTitle = styled.input`
  width: calc(100%);
  height: 48px;
  padding: 15px;

  border-radius: 5px;
  border: 1px solid var(--gray-07, #757575);
  background: #fff;
`;

const Group = styled(FlexContainer)`
  width: 100%;
`;

const Thumbnail = styled(FlexContainer)<{ image?: string }>`
  width: 234px;
  height: 140px;
  border-radius: 10px;
  background-color: ${props => (props.image ? '' : '#6e6e6e')};
  overflow: hidden;
`;

const ThumbnailText = styled.div`
  color: #fefefe;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 123.5%; /* 29.64px */
  letter-spacing: 0.25px;
`;

const SampleImg = styled.img`
  width: 33px;
  height: 33px;
`;

const Title = styled.div`
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 123.5%; /* 44.46px */
  letter-spacing: 0.25px;

  margin-top: 36px;
  margin-bottom: 22px;
  height: 44px;
`;

const ButtonGroup = styled(FlexContainer)`
  margin-bottom: 16px;
  margin-top: auto;
`;

const CreateRoomButton = styled.button`
  width: 510px;
  height: 50px;
  border: none;
  background-color: rgb(110, 110, 110);
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

const CancleButton = styled.button`
  width: 510px;
  height: 50px;
  border: none;
  background-color: rgba(110, 110, 110, 0);
  cursor: pointer;
  font-size: 24px;
`;

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(
    5px
  ); // 블러 정도 설정. 숫자를 조절해서 블러 정도를 변경할 수 있어.
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(FlexContainer)`
  width: 810px;
  height: 948px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  z-index: 50;
  position: absolute;
`;

const Container = styled.form`
  display: flex;
  flex-direction: col;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: -1000;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
`;

export default CreateRoomModal;
