import React from "react"
import './Table.css'

const Table = ({id, address, city}) => {
    return(
        <div className="table-item">
            <span className="table-id">{id}</span>
            <span className="table-address">{address}</span>
            <span className="table-city">{city}</span>
        </div>
    )
}

export default Table