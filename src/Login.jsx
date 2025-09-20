import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from './utils/userSlice';
import { useNavigate } from 'react-router-dom';




const Login = () => {
 const [emailId, setEmailId] = useState("Sujal@gmail.com");
 const [password, setPassword] = useState("Sujal@2025");
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const handleLogin = async ()=> {
      try {
        const res = await axios.post ("http://localhost:3000/login",{
        emailId,
        password,
      },{
        withCredentials: true
      });
      dispatch(addUser(res.data));
      return navigate("/");
    }
      catch (err){
        console.error(err);
      }
 };
  return (
   <div className='flex justify-center my-10'><div className="card bg-base-100 w-96 shadow-sm border-2 my-2">
  <div className="card-body">
    <h2 className="card-title">Login</h2>
    <div>
      <fieldset className="fieldset">
  <legend className="fieldset-legend">Email ID</legend>
  <input type="text" value={emailId} onChange={(e)=> setEmailId(e.target.value)} placeholder="Type here" className="input border-2 shadow-sm bg-base-300 my-0.5" />
</fieldset>
    </div>
    <div>
      <fieldset className="fieldset">
  <legend className="fieldset-legend">Password</legend>
  <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Type here" className="input border-2 shadow-sm bg-base-300 my-0.5" />
</fieldset>
    </div>
    <div className="card-actions justify-end">
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  </div>
</div></div>
  )
}

export default Login