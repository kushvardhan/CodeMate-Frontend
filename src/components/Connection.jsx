import React from "react";

const Connection = () => {

  const fetchConnection=async()=>{
    try{
      const res=await axios.get("/user/request/connections",{
        withCredentials:true,
      })
      console.log(res.data.data);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchConnection();
  },[])

  const connections = [
    { id: 1, name: "John Doe", image: "https://i.imgur.com/6YQ1Zzt.png" },
    { id: 2, name: "Jane Smith", image: "https://i.imgur.com/6YQ1Zzt.png" },
    { id: 3, name: "Alice Johnson", image: "https://i.imgur.com/6YQ1Zzt.png" },
  ];

  return (
    <div className="bg-black flex flex-col items-center justify-center h-screen">
      <h1 className='text-4xl'>Connection</h1>
    </div>  
  )
}

export default Connection;
