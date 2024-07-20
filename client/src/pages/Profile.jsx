import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center text-rose-700 my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-3'>
        <img src={currentUser.avatar} alt="Profile photo" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username'/>
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email'/>
        <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70'>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-rose-800 cursor-pointer font-semibold'>Delete account</span>
        <span className='text-rose-800 cursor-pointer font-semibold'>Sign out</span>
      </div>
      
    </div>
  )
}
