import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { FormContainer, Header, Space } from "./styles";
import Form from "./Form";
import { useUser } from "../../contexts/UserContext";

export default function Login({ setSelectedForm }) {
    // State Variables
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // Logic
    const { API } = useUser();
    const navigate = useNavigate()

    const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});

    const login = async click => {
        click.preventDefault();
        try {
            const bestMove = 0;
            // const login = await axios.post(`${API}/login`, { email: form.email, password: form.password });
            // console.log(login.data)
            
            // localStorage.setItem("token", login.data.token);
            // localStorage.setItem("id", login.data.id);
            // localStorage.setItem("name", login.data.name);
            
            navigate("/home");
        } catch (error) {
            alert(error.message)
            console.error(error);
        }
    }
    
    // UI
    return (
        <FormContainer>
        <Space size={10} />
        <Form>
            <input name="email" type="email" placeholder="Email" onChange={ e => updateForm(e) } value={form.email}></input> 
            <input name="password" type="password" placeholder="Password" onChange={ e => updateForm(e) } value={form.password}></input> 
            <button onClick={ e => login(e) }>Login</button>
        </Form>
        <p onClick={() => setSelectedForm('singup')} >Create account</p> 
        
        </FormContainer>
    );
}
