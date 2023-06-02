import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <main>
        <main className='missing'>
            <h2>Page Not Found</h2>
            <p>Well thats disappointing</p>
            <p>
                <Link to='/'>Visit Our Homepage</Link>
            </p>
        </main>
    </main>
    
  )
}

export default Missing