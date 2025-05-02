import React, { useEffect } from "react";
import axios from "axios";

const Request = () => {

  const fetchRequest=async()=>{
    try{
      const res=await axios.get("http://localhost:4000/user/request/received",{
        withCredentials:true,
      })
      console.log(res.data.data);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchRequest();
  },[])

  const Request = [
    { id: 1, name: "John Doe", image: "https://i.imgur.com/6YQ1Zzt.png" },
    { id: 2, name: "Jane Smith", image: "https://i.imgur.com/6YQ1Zzt.png" },
    { id: 3, name: "Alice Johnson", image: "https://i.imgur.com/6YQ1Zzt.png" },
  ];

  return (
    <div className="bg-black flex flex-col items-center justify-center h-screen">
      <h1 className='text-4xl'>Request</h1>
    </div>  
  )
}

export default Request;
