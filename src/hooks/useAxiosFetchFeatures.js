import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetchFeatures = (dataUrl, tokenAPI) => {
    const [dataFeature, setDataFeature] = useState([])
    const [fetchErrorFeature, setFetchErrorFeature] = useState(null)
    const [isLoadingFeature, setIsLoadingFeature] = useState(false)

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()

        const fetchData = async(url) =>{
            setIsLoadingFeature(true)
            try{
                const response = await axios.get(url, {
                    headers:{
                        Authorization:`Bearer ${tokenAPI}`
                    },
                    cancelToken:source.token
                })
                if(isMounted){
                    setDataFeature(response.data)
                    setFetchErrorFeature(null)
                }
            }catch(err){
                if(isMounted){
                    setFetchErrorFeature(err.message)
                    setDataFeature([])
                    
                }
            }finally{
                isMounted && setIsLoadingFeature(false)
            }
                
            
        }

        fetchData(dataUrl)

        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp
     }, [dataUrl, tokenAPI])

     return {dataFeature, fetchErrorFeature, isLoadingFeature}


}

export default useAxiosFetchFeatures