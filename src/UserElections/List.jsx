import React from "react"

const List = ({name}) => {
    return(
        <div className="list-item">
            <span className="list-name">{name}</span>
        </div>
    )
}

export default List