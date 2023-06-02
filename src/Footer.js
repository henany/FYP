import React from 'react'
import Marquee from "react-fast-marquee";
import { useEffect,useRef } from 'react';
const Footer = () => {
  const messageWindow = useRef()
  

  useEffect (() => {
   
    

    const handleMessageWindow = (e) => {
      const messageWindowElement = messageWindow.current
      if(e.target.classList.contains('close')){
        messageWindowElement.querySelector('.footer_content-message').style.height = '0'
      }else{
              messageWindowElement.querySelector('.footer_content-message').style.height = '100vh'

      }
    }

    const messageWindowElement = messageWindow.current

    if(messageWindowElement){
      messageWindowElement.addEventListener('click',handleMessageWindow)
    }

    return () => {
      if(messageWindowElement){
        messageWindowElement.removeEventListener('click',handleMessageWindow)
      }

      
    }

  })


  return (
    <div>
      <div className="footer_demo">
        <Marquee
            className="footer_demo-marquee"
            autoFill={true}
            direction={'right'}
            rate={50}>
            <p className="footer_demo-marquee_para">Demo&ensp;Demo&ensp;</p>
        </Marquee>
      </div>
      <div className="footer_content" ref={messageWindow}>
        <Marquee
            className="footer_content-marquee"
            autoFill={true}
            rate={20}>
            <p className="footer_content-marquee_para">About this project, find out how you can play with it! </p>
        </Marquee>
        <div className="footer_content-message">
          <p className='title close'>X</p>
          <h3 className='title'>A message from henan</h3>
          <p className='content_blue'>This project is designed to provide artists a different approach to search music</p>
          <p className='content_blue'>The goal is to let you find music from other perspective that you rarely notice</p>
          <p className='content_yellow'>Muscial softwares have been developed a lot, there are many existing search functions for users</p>
          <p className='content_yellow'>People can use the name, tracks' album or their favoriate tastes to explore more music</p>
          <p className='content_yellow'>Also, majority platforms can help users generate recommanded music playlist</p>
          <p className='content_red'>At here you can find out a new interaction with musical features: danceability, acousticness, energy and valence</p>
          <p className='content_red'>Try to use your favoriate musical feature to explore music</p>
          <p className='content_red'>Hope you enjoy it!</p>
        </div>
      </div>
    </div>
    
  )
}

export default Footer