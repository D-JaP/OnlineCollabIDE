import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'

export default function InviteForm() {
    const [email, setEmail] = useState()
    const [showForm, setShowForm] = useState(true)
    const sender = document.getElementById('greeting').innerHTML.split(' ')[1]
    const link = window.location.href
    const handleSummit = async () => {
        const req_body = {
            sender: sender,
            link: link,
            receiver: email
        }
        const jwtCookie = Cookies.get('jwtToken');
        const headers = {
            'Authorization': 'Bearer ' + jwtCookie
        }
        const response = await axios.post('http://localhost:3000/api/v1/invite',
            req_body,
            {
                headers: headers
            }
        )

        if (response.status == 200){
            setShowForm(false)
        }
        console.log(response.data.message)
    }

    return (
    <form onSubmit={handleSummit} >
        <h2>
        Enter email:
        </h2>

        { showForm && (<input
            type='email'
            placeholder='Enter email to invite'
            value={email}
            onChange={(event)=>{setEmail(event.target.value)}}
        />)}
        
        <button type="submit">Send</button>
        
    </form>
  )
}
