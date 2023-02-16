import { FormStyles } from "./styles";

export default function Form(props) {
    return(
        <FormStyles>
            { props.children }
        </FormStyles>
    )
}