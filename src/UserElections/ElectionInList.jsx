import React from "react"
import './ElectionInList.css';

const ElectionInList = ({title, startsAt, endsAt}) => {
    return(
        <div className="election-item">
            <span className="election-name">{title}</span>
            <span className="election-date">{startsAt}</span>
            <span className="election-date">{endsAt}</span>
        </div>
    )
}

export default ElectionInList