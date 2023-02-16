import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { FormContainer, Header, Space } from "./styles";
import Form from "./Form";
import { useUser } from "../../contexts/UserContext";

export default function SignupPage({ setSelectedForm }) {
        // State Variables
        const [form, setForm] = useState({
            name: '',
            email: '',
            password: '',
            confirmation: ''
        });
    
        // Logic
        const { API } = useUser(); 
        const navigate = useNavigate();

        const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});
        
        const signup = async click => {
            click.preventDefault();
            
            try {
                const signup = await axios.post(`${API}/signup`,form);
                console.log(signup.data)
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
        // UI
    return (
        <FormContainer>
        <Space size={5} />
        <Form>
            <input name="username" type='text' placeholder="Username" onChange={e => updateForm(e) } value={form.name}></input>
            <input name="email" type="email" placeholder="Email" onChange={ e => updateForm(e) } value={form.email}></input> 
            <input name="password" type="password" placeholder="Password" onChange={ e => updateForm(e) } value={form.password}></input>
            <input name="confirmation" type="password" placeholder="Confirm your password" onChange={ e => updateForm(e) } value={form.confirmation}></input> 
            <button onClick={ e => signup(e) }>Sign-up</button>
        </Form>
        <p onClick={() => setSelectedForm('login')} >Login to your account</p>        
        </FormContainer>
    )
}
