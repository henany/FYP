import React from 'react'
import { Link } from 'react-router-dom'





const LandingPage = ({token, handleLogin, handleLogout}) => {



    

    
  return (
    <div className='landingPage'>
        <div className='beginExperience'>
           {!token && <button onClick={() => handleLogin()}>Login</button>}
          <Link to='/userProfile' className='begin' > 
              {token &&<button >BEGIN EXPERIENCE</button>}
          </Link> 
          {token && <a className='logout' onClick={() => handleLogout()}>Logout</a>}

        
        </div>
       
        
        
    </div>
  )
}

export default LandingPage