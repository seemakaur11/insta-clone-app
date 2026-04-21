import React, { useEffect, useState } from 'react';
import "../css/Profile.css";
import PostDetail from '../components/PostDetail';
import ProfilePic from '../components/ProfilePic';

export default function Profile() {
const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
const [pics, setPics] = useState([]);
const [show, setShow] = useState(false);
const [posts, setPosts] = useState([]);
const [user, setUser] = useState("")
const [changePic, setChangePic] = useState(false)

 const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeprofile = ()=>{
    if(changePic){
      setChangePic(false)
    }else{
      setChangePic(true)
    }
  }

useEffect(()=>{
fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
          Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result => {
      setPics(result.post)
      setUser(result.user)
    })
    .catch(err => console.log("err ==",err))
},[])
  return (
    <div className='profile'>
     {/* profile frame */}
     <div className='profile-frame'>
      <div className='profile-pic '>
         <img
            onClick={changeprofile}
            src={user?.Photo ? user.Photo : picLink}
            alt="user"
          />
        </div>
        {/* profile data */}
        <div className='profile-data'>
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className='profile-info' style={{display:"flex"}}>
            <p>{pics ? pics.length : "0"} posts</p>
            <p>{user?.followers? user?.followers.length : "0"} followers</p>
            <p>{user?.following? user?.following.length : "0"} following</p>

          </div>
        </div>

      </div>
      <hr style={{
        width:"90%",
        margin:"auto",
        opacity:"0.8",
        margin:"25px auto"
      }
        
      }/>
      {/* Gallery */}
      <div className='gallery'>
       {pics?.map((pic)=>{
        return <img key={pic._id} src={pic.photo} className='item'
        onClick={()=>{
          toggleDetails(pics)
        }}
        ></img>
       })}

      </div>
      {show &&
      <PostDetail item={posts} toggleDetails={toggleDetails}/>
      }
      {
        changePic &&
        <ProfilePic changeprofile={changeprofile}/>
      }
     </div>
   
  )
}
