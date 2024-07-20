import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInSuccess, signInFailure, signInStart } from '../redux/user/userSlice'
import OAuth from '../components/OAuth.jsx'


export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error} = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData)

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(signInFailure(data.message));      
      return;
    }
    dispatch(signInSuccess(data));
    navigate('/');
    console.log(data)
    

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
    // alert("Account successfully created! You can now sign in.");
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7 text-rose-600'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username'onChange={handleChange} /> */}
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email'onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password'onChange={handleChange} />
        <button disabled={loading} className='p-3 bg-slate-700 rounded-lg text-white hover:opacity-90 disabled:opacity-70 uppercase'>{loading? 'Loading...': 'Sign In'}</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 font-semibold">
        <p>Dont Have an account?</p>
        <Link to='/sign-up'><span className='text-blue-700 hover:underline'>Sign Up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
