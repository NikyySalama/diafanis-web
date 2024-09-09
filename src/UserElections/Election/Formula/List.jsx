import React from "react"

const List = ({position, partyName, formulaNumber}) => {
    return(
        <div className="list-item">
            <span className="list-data">{position}</span>
            <span className="list-data">{partyName}</span>
            <span className="list-data">{formulaNumber}</span>
        </div>
    )
}

export default List