import React, { useState, useEffect, useCallback } from 'react'
import { LoginForm, RegisterForm } from "./UserLoginRegister"
import "./LoginPopup.css"
import Cookies from 'js-cookie'
import axios from 'axios'
import InviteForm from './InviteForm'
import { useAsyncValue, useNavigate } from 'react-router-dom'

function LoginPopup() {
    const [loginPopUpState, setloginPopUpState] = useState(false)
    const [registerPopUpState, setregisterPopUpState] = useState(false)
    const [loggedState, setLoggedState] = useState(false)
    const [email, setEmail] = useState()
    const [invitePopupState, setInvitePopUpState] = useState(false)
    const [dropDownState, setDropdownState] = useState(false)
    const [id_list, setIdList] = useState()
    const navigate = useNavigate()

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
        if (!jwtCookie) return;
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
                const response2 = await axios.get("http://localhost:3000/api/v1/user", { headers: headers })
                let ids = []
                response2.data.forEach((link) => {
                    const link_split = link.split('/')
                    ids.push([link_split[(link_split.length) - 1], link])
                })
                setIdList(ids)


            }
            catch (error) {
                console.log(error)
            }
        }
        authenticateJwt()
        return () => {
        }
    }, []);



    const logout = (event) => {
        event.preventDefault()
        Cookies.remove('jwtToken', { path: '' })
        navigate(0, { replace: true })
    };


    return (
        <div className='nav-bar'>
            <div>
                {!loggedState && (<a href="#" onClick={() => setloginPopUpState(true)} className='loggin-button'>
                    Login
                </a>)}

                {
                    loggedState && (
                        <a className='loggin-button' onClick={() => {
                            if (invitePopupState == true) setInvitePopUpState(false)
                            else setInvitePopUpState(true)
                        }}>Invite</a>
                    )
                }



                {
                    invitePopupState && (
                        <div className='popup-container'>
                            <InviteForm />
                            <button onClick={() => setInvitePopUpState(false)}>Close</button>
                        </div>
                    )
                }
                {loggedState && (
                    <a href="#" onClick={() => {
                        if (dropDownState == true) setDropdownState(false)
                        else { setDropdownState(true) }
                    }} className='loggin-button' id='greeting' >
                        Hi, {email}
                    </a>)
                }

                {
                    dropDownState && (
                        <div className='project-drop'>
                            Recent Projects:
                            
                            <ul>
                                {
                                    id_list.map((element) => {
                                        return <li key={element[0]}><a href={element[1]} className='prj-list-link'>{element[0]}</a></li>
                                    })
                                }
                            </ul>
                            <button onClick={()=>{setDropdownState(false)}}>Close</button>
                        </div>
                    )
                }

                {
                    loggedState && (
                        <a href="#" className='loggin-button' onClick={logout}>Log out</a>
                    )
                }


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