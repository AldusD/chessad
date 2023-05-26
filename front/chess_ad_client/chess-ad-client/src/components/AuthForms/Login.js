import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import { FormContainer, Header, Space } from "./styles";
import { FieldError } from '../comons/styles';
import Form from "../comons/Form";
import { useUser } from "../../contexts/UserContext";
import { useSignin } from "../../hooks/api/useAuthentication";

export default function Login({ setSelectedForm }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmation: '', 
        error: false 
    });
    const navigate = useNavigate();
    const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});
    const { 
        mutate: signinForm, 
        data: signinData
    } = useSignin();

    useEffect(() => {
      if (signinData && signinData[0] === '{') navigate('/home'); 
    }, [signinData])

    const login = async() => {
        try {
          const { username, email, password } = form;
          signinForm({ email, password });
        } catch(error) {
          console.log('err', error);
        }
      }
    
    const signin = (click) => {
      click.preventDefault();
      const hasError = getErrors();
      if (!hasError) {
        return login();
      }
      return;
    }

    const getErrors = () => {
        const errors = { email: '', password: '' };
    
        const emailPattern = RegExp( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        if (!emailPattern.test(form.email)) errors.email = 'email must be a valid email';
        if (form.email.length === 0) errors.email = 'email is required';
        if (form.password.length === 0) errors.password = 'password is required';

        setFormErrors(errors);
        if (errors.email || errors.password) return true;
        return false; 
    }
    
    return (
        <FormContainer>
        <Space size={10} />
        <Form direction={'column'} inputSize='70%' >
          {signinData ? 
            <FieldError width={'80%'} >
              {(signinData == 'Unauthorized' || signinData == 'Email or password are incorrect') ? 
                "email and password don't match" 
                : 
                (signinData === 'Unprocessable Entity') ? 
                  'server error, please try again later' 
                  : 
                  "1. e4!"
              } 
            </FieldError> : <></>}
          <div>
            <input name="email" type="email" placeholder="Email" onChange={ e => updateForm(e) } value={form.email}></input> 
            { formErrors.email ? <FieldError width={'80%'}>{formErrors.email}</FieldError> : <></> }
          </div>
          <div>
            <input name="password" type="password" placeholder="Password" onChange={ e => updateForm(e) } value={form.password}></input>
            { formErrors.password ? <FieldError width={'80%'}>{formErrors.password}</FieldError> : <></> }
          </div>
          <button onClick={ e => signin(e) }>Login</button>
        </Form>
        <p onClick={() => setSelectedForm('singup')} >Create account</p> 
        
        </FormContainer>
    );
}
