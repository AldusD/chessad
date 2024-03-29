import { useState } from "react";

import { FormContainer, Space } from "./styles";
import { FieldError } from '../comons/styles';
import Form from "../comons/Form";
import { useSignup } from "../../hooks/api/useAuthentication";

export default function SignupPage({ setSelectedForm }) {
  const [form, setForm] = useState({
      username: '',
      email: '',
      password: '',
      confirmation: ''
  });
  const [formErrors, setFormErrors] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmation: '', 
    error: false 
   });
  const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});
  const { 
    mutate: signupForm, 
    data: signupData
  } = useSignup();

  const getErrors = () => {
    const errors = { username: '', email: '', password: '', confirmation: '' };
    
    const blockSpecialChars = RegExp(/^[A-Za-z0-9 ]+$/);
    const emailPattern = RegExp( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (!blockSpecialChars.test(form.username)) errors.username = 'username can not contain special characters';
    if (form.username.length < 4) errors.username = 'username must be at least 4 characters long';
    if (form.username.length === 0) errors.username = 'username is required';
    if (!emailPattern.test(form.email)) errors.email = 'email must be a valid email';
    if (form.email.length === 0) errors.email = 'email is required';
    if (form.password.length === 0) errors.password = 'password is required';
    if (form.confirmation.length === 0) errors.confirmation = 'confirmation is required';
    if (form.confirmation !== form.password) errors.confirmation = 'passwords must be the same';

    setFormErrors(errors);
    if (errors.username || errors.email || errors.password || errors.confirmation) return true;
    return false; 
  }

  const register = async() => {
    try {
      const { username, email, password } = form;
      await signupForm({ username, email, password });
    } catch(error) {
      console.log('err', error);
    }
  }

  const signup = (click) => {
    click.preventDefault();
    const hasError = getErrors();
    if (!hasError) {
      return register();
    }
    return;
  }

  return (
      <FormContainer>
      <Space size={5} />
      <Form direction='column' inputSize='70%' >
        {signupData ? <FieldError width={'80%'} >{signupData} </FieldError> : <></>}
        <div>
          <input name="username" type='text' placeholder="Username" onChange={e => updateForm(e) } value={form.name}></input>
          { formErrors.username ? <FieldError width={'80%'}>{formErrors.username}</FieldError> : <></> }
        </div>
        <div>
          <input name="email" type="email" placeholder="Email" onChange={ e => updateForm(e) } value={form.email}></input> 
          { formErrors.email ? <FieldError width={'80%'}>{formErrors.email}</FieldError> : <></> }
        </div>
        <div>
          <input name="password" type="password" placeholder="Password" onChange={ e => updateForm(e) } value={form.password}></input>
          { formErrors.password ? <FieldError width={'80%'}>{formErrors.password}</FieldError> : <></> }
        </div>
        <div>
          <input name="confirmation" type="password" placeholder="Confirm password" onChange={ e => updateForm(e) } value={form.confirmation}></input> 
          { formErrors.confirmation ? <FieldError width={'80%'}>{formErrors.confirmation}</FieldError> : <></> }
        </div>
        <button onClick={ e => signup(e) }>Sign-up</button>
      </Form>
      <p onClick={() => setSelectedForm('login')} >Login to your account</p>    
      </FormContainer>
  )
}
