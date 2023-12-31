import React , {useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from  "styled-components";
import "react-toastify/dist/ReactToastify.css";
import loader from "../assets/loader.gif";
import axios from 'axios';
import { setAvatarRoute } from "../utils/APIRoutes";
import {Buffer } from 'buffer';


const SetAvatar = () => {

    const api = 'https://api.multiavatar.com/45678945';
    const Navigate = useNavigate();
    const [avatars , setAvatars] = useState([]);
    const [isLoading , setIsLoading] = useState(true);
    const [selectedAvatar , setSelectedAvatar] = useState(undefined);


    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    useEffect(  () => {
      if(!localStorage.getItem('chat-app-user')){
        Navigate('/login');
      }
    },[])

    const setProfilePicture = async () => {
      if(selectedAvatar===undefined){
        toast.error("Please select an avatar");
      }else{
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        })
        console.log(data);
        if(data.isSet) {
          console.log(`hi`);
            user.isAvatarImageSet = true;
            user.avatarImage=data.image;
            localStorage.setItem("chat-app-user",JSON.stringify(user));
            Navigate('/');
        }else {
          toast.error("Error setting avatar. Please try again",toastOptions);
        }
      }
      
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = [];
          for (let i = 0; i < 4; i++) {
            const image = await axios.get(`${api}/${Math.random() * 1000}`);
            const buffer = Buffer.from(image.data); // Assuming image.data is a Buffer
            data.push(buffer.toString("base64"));
          }
    
          setAvatars(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, []);

  return (
    <>
    {
      isLoading ? <Container>
         <img src={loader} alt="loader" className="loader"/>
      </Container>: (
        
      <Container>
        <div className="title-container">
          <h1>Pick an Avatar as a Profile Picture</h1>
        </div>
        <div className="avatars">
        {
          avatars.map((avatar , index) => {
            return <>
              <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                 <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" className="loader" onClick={() => setSelectedAvatar(index)} />
              </div>
                
               

            </>
          })
        
        }
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
      </Container>
      )
    }
      <ToastContainer/>

    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-items: center;
  background-color: #131324;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars{
      display:flex;
      gap: 2rem;
      .avatar{
        border: 0.4rem solid transparent ;
        padding: 0.4rem;
        border-radius:5rem;
        justify-content: center;
        align-items: center;
        transition : 0.5s ease-in-out;
        img{
          height:6rem;
        }
      }
      .selected {
      border: 0.4rem solid #4e0eff;
    }

    }
    .submit-btn {
    background-color: #9970f0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
