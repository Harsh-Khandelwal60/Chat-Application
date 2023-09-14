import React,{useState , useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utils/APIRoutes';

const Chat = () => {
  const Navigate = useNavigate();
  const [contacts , setContacts] = useState([]);
  const [currentUser , setCurrentUser] = useState(undefined);
  useEffect( () => {
    if(!localStorage.getItem('chat-app-user')){
      Navigate('/login');
    }else{
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
    }
  },[])
  useEffect(() => async () =>  {
      if(currentUser) {
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }else{
          Navigate('/setAvatar');
        }
      }
  },[currentUser])

  return (
    <>
      <Container>
        <div className='container'>
            <hi>chat</hi>
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (min-width: 360px) and (max-width: 480px) {
      grid-template-columns: 25% 75%;
    }
  }
`;

export default Chat;
