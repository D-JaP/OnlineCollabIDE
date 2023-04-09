import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
function ActivateToken() {
    let { token } = useParams();
    const [message,setMessage] = useState();

    useEffect(() => {
        async function activateAccount() {
            try {
                const response = await axios.post("http://localhost:3000/api/v1/activate/" + token,)
                if (response.status === 200) {
                    console.log(response.data.message)
                    setMessage(response.data.message)
                }
            }
            catch (error) {
                setMessage(error.response.data.message)
            }

        }
        activateAccount()
        return () => {

        }
    }, [])
    

    return (
        <div>
            {message}
        </div>
    )
}

export default ActivateToken