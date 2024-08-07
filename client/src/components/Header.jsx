import {FaSearch} from "react-icons/fa"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header() {
    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) =>{
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search); //buitin js constructor URLSearchParams
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        if (searchTermFormUrl){
            setSearchTerm(searchTermFormUrl);
        }

    },[location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
              <Link to='/'>
                  <h1 className='font-bold text-lg sm:text-xl flex flex-wrap'>
                      <span className='text-red-700'>Aavaash</span>
                      <span className='text-slate-400'>Estate</span>
                  </h1>
                </Link>
            <form onSubmit={handleSubmit} action="" className='bg-slate-100 p-2 rounded-xl flex items-center'>
                <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                    <FaSearch className="text-slate-600"></FaSearch>
                </button>
            </form>
            <ul className="flex gap-3">
                <Link to='/'><li className="hidden sm:inline font-bold text-slate-700 hover:rounded-lg hover:bg-slate-400 hover:underline p-1">Home</li></Link>
                <Link to='/about'><li className="hidden sm:inline font-bold text-slate-700 hover:bg-slate-400 hover:rounded-lg hover:underline p-1">About</li></Link>
                <Link to='/Profile'>
                    {currentUser ? (
                        <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
                    ): (
                        <li className="sm:inline font-bold text-slate-700 hover:bg-slate-400 hover:rounded-lg hover:underline p-1">Sign-In</li>
                    )}                    
                </Link>
            </ul>
        </div>        
    </header>
  )
}
