import React from "react"

const List = ({position, partyName, formulaNumber}) => {
    return(
        <div className="list-item">
            <span className="list-name">{position}</span>
            <span className="list-name">{partyName}</span>
            <span className="list-name">{formulaNumber}</span>
        </div>
    )
}

export default List