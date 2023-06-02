import React from 'react'
import { Link, useParams } from 'react-router-dom';


const Tracklist = ({track, userId}) => {
    const {id} = useParams()
    
  return (
   
    <>
    <Link to={`/trackPlayground/${track.id}?userId=${userId}`}>
    
        <img src={track.album.images[0].url} alt='album img'/>
        <p>{track.name}</p>
        <p>{track.artists[0].name}</p>
        
    </Link>
        
        
    </>    
        
       
  )
}

export default Tracklist