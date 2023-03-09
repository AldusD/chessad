import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import { FormContainer, Header, Space } from "./styles";
import Form from "./Form";
import { useUser } from "../../contexts/UserContext";
import { useSignin } from "../../hooks/api/useAuthentication";

export default function Login({ setSelectedForm }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    
    const { API } = useUser();
    const navigate = useNavigate()
    const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});

    const { mutate: signinForm } = useSignin();
    const login = click => {
      click.preventDefault();
      const { username, email, password } = form;
      const response = signinForm({ username, email, password });
    }

    const login2 = async click => {
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
