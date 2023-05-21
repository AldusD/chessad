import { useParams } from "react-router-dom"

export default function UserPage () {
    const username = useParams().username;
    
    return (
        <>aaa {username}</>
    )
}