import { FormStyles } from "./styles";

export default function Form(props) {
    return(
        <FormStyles direction={props.direction} inputSize={props.inputSize} >
            { props.children }
        </FormStyles>
    )
}