import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData)

  

  const  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false) {
      setLoading(false);
      setError(data.message);      
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/sign-in')
    console.log(data)
    

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
    alert("Account successfully created! You can now sign in.");
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center my-7 text-rose-600'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username'onChange={handleChange} />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email'onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password'onChange={handleChange} />
        <button disabled={loading} className='p-3 bg-slate-700 rounded-lg text-white hover:opacity-90 disabled:opacity-70 uppercase'>{loading? 'Loading...': 'Sign Up'}</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 font-semibold">
        <p>Have an account?</p>
        <Link to='/sign-in'><span className='text-blue-700 hover:underline'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
