import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useAxiosFetchRecommendFeatures = ({dataUrl, tokenAPI}) => {
    const [dataRecommendFeature, setDataRecommendFeature] = useState([])
    const [fetchErrorRecommendFeature, setFetchErrorRecommendFeature] = useState(null)
    const [isLoadingRecommendFeature, setIsLoadingRecommendFeature] = useState(false)
    
    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()
//         const trackIds = ['3n3Ppam7vgaVa1iaRUc9Lp', '3twNvmDtFQtAd5gMKedhLD', '7xGfFoTpQ2E7fRF5lN10tr'];
// const trackIdsString = trackIds.join(',');
//         const ids = "7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"
//         const url = 'https://api.spotify.com/v1/audio-features'
//         const config = {
//             headers: {Authorization:`Bearer ${tokenAPI}`},
//             params:{
//                 ids:trackIdsString
//             }
            
                
            
                
//             ,
//             cancelToken:source.token

//         }

        const fetchData = async (url) => {
            setIsLoadingRecommendFeature(true)
            try{
                const response = await axios.get(url, {
                    headers:{
                        Authorization:`Bearer ${tokenAPI}`
                    },
                    cancelToken:source.token
                }).then(response => {
                    if(isMounted){
                        setDataRecommendFeature(response.data)
                        setFetchErrorRecommendFeature(null)
                    }
                }

                )
                
            }
            catch(err){
                if(isMounted){
                    setFetchErrorRecommendFeature(err.message)
                    setDataRecommendFeature([])
                    
                }

            }finally{
                isMounted && setIsLoadingRecommendFeature(false)

            }

        }
        fetchData(dataUrl)
        
        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp


    }, [dataUrl, tokenAPI])
    return {dataRecommendFeature, fetchErrorRecommendFeature, isLoadingRecommendFeature}
    
  
}

export default useAxiosFetchRecommendFeatures