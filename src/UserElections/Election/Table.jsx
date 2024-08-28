import React from "react"
import './Table.css'

const Table = ({location, id}) => {
    return(
        <div className="table-item">
            <span className="table-id">{id}</span>
            <span className="table-name">{location}</span>
        </div>
    )
}

export default Table