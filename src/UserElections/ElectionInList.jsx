import React from "react"
import './ElectionInList.css';

const ElectionInList = ({name, startDate, endDate}) => {
    return(
        <div className="election-item">
            <span className="election-name">{name}</span>
            <span className="election-date">{startDate}</span>
            <span className="election-date">{endDate}</span>
        </div>
    )
}

export default ElectionInList