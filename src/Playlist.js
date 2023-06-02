import React from 'react'
import axios from 'axios'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

const Playlist = ({playlist, userId}) => {
  const [playlistItem, setPlaylistItem] = useState([])
  const {id} = useParams()
  const PLAYLISTITEM_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`
  const playlistContentRef = useRef(null)
  const [isContentActive, setIsContentActive] = useState(false);

  const fetchData = async(dataUrl, setFunc) => {
    try{
      const response = await axios.get(dataUrl, {
        headers:{
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      setFunc(response.data)
    }catch(err){
      console.log(err.message)
    }
  }

  useEffect(() => {
    const handlePlaylistContentClick = (e) => {
      const playlistContentElement = playlistContentRef.current
      if(e.target.tagName === 'H4'){
        
        playlistContentElement.classList.toggle('playlist-content-active')
        if(playlistContentElement.classList.contains('playlist-content-active')){
          setIsContentActive(true);
        }else{
          setIsContentActive(false);
        }
        
      
      }
    }
    const playlistContentElement = playlistContentRef.current
    if(playlistContentElement){
      playlistContentElement.addEventListener('click', handlePlaylistContentClick)

    }
    return () => {
      if(playlistContentElement){
        playlistContentElement.removeEventListener('click', handlePlaylistContentClick)
      }
    }

  },[])

  useEffect(() => {
    fetchData(PLAYLISTITEM_ENDPOINT,setPlaylistItem)
  },[])

  

  return (
    <div className='playlist-content' ref={playlistContentRef}>
        <h4 className='playlist-content-name'><i className='icon-angle'>{isContentActive ? <FaAngleUp /> : <FaAngleDown />}</i>{playlist.name}</h4>
        <ul className='playlist-content-track'>
          {playlistItem &&
          playlistItem.items &&
          playlistItem.items.length > 0 &&(
            playlistItem.items.map(item => (

              <li key={item.track.id}>
                <Link to={`/trackPlayground/${item.track.id}?userId=${userId}`}>
                  <img src={item.track.album.images[0].url} alt='album img'/>
                  <p>{item.track.name}</p>
                </Link>
                
              </li>
            ))
          )

          }
        </ul>
    </div>
  )
}

export default Playlist