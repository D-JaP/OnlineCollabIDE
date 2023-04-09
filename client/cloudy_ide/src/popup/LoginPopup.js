import React, { useState, useEffect } from 'react'
import { LoginForm, RegisterForm } from "./UserLoginRegister"
import "./LoginPopup.css"
import Cookies from 'js-cookie'
import axios from 'axios'
import InviteForm from './InviteForm'


function LoginPopup() {
    const [loginPopUpState, setloginPopUpState] = useState(false)
    const [registerPopUpState, setregisterPopUpState] = useState(false)
    const [loggedState, setLoggedState] = useState(false)
    const [email, setEmail] = useState()
    const [invitePopupState, setInvitePopUpState] = useState(false)
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setloginPopUpState(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        const jwtCookie = Cookies.get('jwtToken');
        const headers = {
            'Authorization': 'Bearer ' + jwtCookie
        }
        async function authenticateJwt() {
            try {

                const response = await axios.post("http://localhost:3000/api/v1/auth", {}, { headers: headers })

                if (response.status === 200) {
                    setLoggedState(true)
                    setEmail(response.data.email)
                }
            }
            catch (error) {

            }
        }
        authenticateJwt()
        return () => {
        }
    }, []);



    return (
        <div className='nav-bar'>
            <div>
                {!loggedState && (<a href="#" onClick={() => setloginPopUpState(true)} className='loggin-button'>
                    Login
                </a>)}

                {
                    loggedState && (
                        
                            <a className='loggin-button' onClick={() => {
                                if (invitePopupState==true) setInvitePopUpState(false)
                                else setInvitePopUpState(true)
                            }}>Invite</a>
                        )
                }
                {
                    invitePopupState && (
                        <div className='popup-container'>
                            <InviteForm />
                        </div>
                    )
                }
                {loggedState && (
                    <a href="#" onClick={() => setloginPopUpState(false)} className='loggin-button' id='greeting' >
                        Hi, {email}
                    </a>)}

                {loginPopUpState && (
                    <div className="popup-container">
                        <div className="popup">
                            <LoginForm />
                            <button onClick={() => setloginPopUpState(false)}>Close</button>
                            <p id='login-response'></p>
                        </div>
                    </div>
                )}
            </div>

            <div>
                {!loggedState && (<a href="#" onClick={() => setregisterPopUpState(true)} className='register-button'>
                    Register
                </a>)}
                {registerPopUpState && (
                    <div className="popup-container">
                        <div className="popup">
                            <RegisterForm />
                            <button onClick={() => setregisterPopUpState(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>

        </div>

    )
}

export default LoginPopup