import React from "react"
import './Table.css'

const Table = ({locationUuid, id}) => {
    return(
        <div className="table-item">
            <span className="table-id">{id}</span>
            <span className="table-name">{locationUuid}</span>
        </div>
    )
}

export default Table