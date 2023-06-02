import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetchUsers = (dataUrl, tokenAPI) => {
    const [dataUser, setDataUser] = useState([])
    const [fetchErrorUser, setFetchErrorUser] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(false)

    useEffect(() => {
        let isMounted = true
        const source = axios.CancelToken.source()
        

        const fetchData = async(url) =>{
            setIsLoadingUser(true)
            try{
                const response = await axios.get(url, {
                    headers:{
                        Authorization:`Bearer ${tokenAPI}`
                    },
                    cancelToken:source.token
                })
                if(isMounted){
                    setDataUser(response.data)
                    setFetchErrorUser(null)
                }
            }catch(err){
                if(isMounted){
                    setFetchErrorUser(err.message)
                    setDataUser([])
                    
                }
            }finally{
                isMounted && setIsLoadingUser(false)
            }
                
            
        }

        fetchData(dataUrl)

        const cleanUp = () => {
            isMounted = false
            source.cancel()
        }

        return cleanUp
     }, [dataUrl, tokenAPI])

     return {dataUser, fetchErrorUser, isLoadingUser}


}

export default useAxiosFetchUsers