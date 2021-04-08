import React, { useEffect } from 'react'
import { history } from "../index"

const TimeOut = ({ createMessage }) => {

    useEffect(() => {
        createMessage("danger", "Session elapsed. You need to log in again")
        history.push("/login");
    }, []);

    return (
        <div>
        </div>
    )
}

export default TimeOut
