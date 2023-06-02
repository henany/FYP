

import { AUTH_ENDPOINT, CLIENT_ID, CLIENT_SECRET, RESPONSE_TYPE, REDIRECT_URI,SCOPES } from './auth/auth'
import LandingPage from './LandingPage';
import UserProfile from './UserProfile';
import TrackPlayground from './TrackPlayground';
import Missing from './Missing';
import { Route, Routes } from 'react-router-dom';
import Structure from './Structure';
import { useState, useEffect } from 'react';
import useAxiosFetchTracks from './hooks/useAxiosFetchTracks';
import useAxiosFetchUsers from './hooks/useAxiosFetchUsers';
import note from './img/noteIcon.png'
import add from './img/addIcon.png'



function App() {
  
  const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me"
  const TRACK_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10"
  
  const [token, setToken] = useState('')
  const [profile, setProfile] = useState([])
  const [topTrack, setTopTrack] = useState({})



  useEffect(() => {
    let token = localStorage.getItem('token')

    if (token) {
      setToken(token);
    } else {
      const hash = window.location.hash;
      if (hash) {
        const token = hash.substring(1).split('&').find(element => element.startsWith('access_token')).split('=')[1];
        setToken(token);
        localStorage.setItem('token', token);
        
      }
    }
 
}, [])

const {dataTrack, fetchErrorTrack, isLoadingTrack} = useAxiosFetchTracks(TRACK_ENDPOINT, token)
const {dataUser, fetchErrorUser, isLoadingUser} = useAxiosFetchUsers(PROFILE_ENDPOINT,token)

  

  useEffect(() => {
    setTopTrack(dataTrack)
  },[dataTrack, token])
  
  useEffect(() => {
    setProfile(dataUser);
  }, [dataUser]);







const handleLogin = () =>{
  window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}&show_dialog=true`
}

const handleLogout = () => {
  setToken("")
  window.localStorage.removeItem("token")
}




  





  return (
    
      <Routes>
        <Route path='/' element={
          <Structure/>
        }>
          <Route index element={
            <LandingPage 
              token={token}
              handleLogin = {handleLogin}
              handleLogout = {handleLogout}
             
              
            />
          }/>

          <Route path='/userProfile'>
            <Route index element={
              <UserProfile 
                token = {token}
                profile = {profile}
                topTrack = {topTrack}
                isLoadingUser = {isLoadingUser}
                fetchErrorUser = {fetchErrorUser}
              />
            }/>
          </Route>

          <Route path = '/trackPlayground/:id'>
            <Route index element={
              <TrackPlayground
                topTrack = {topTrack}
                token = {token}
                fetchErrorTrack = {fetchErrorTrack}
                isLoadingTrack = {isLoadingTrack}
              />
            }/>
          </Route>

          <Route path='*' element={<Missing/>}/>
          


        </Route>

      </Routes>
      
    
  );
}

export default App;
