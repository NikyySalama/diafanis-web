import { useEffect } from 'react';
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const CustomPieChart = ({pieData}) => {
    useEffect(() => {
        console.log('PieData actualizada:', pieData);
    }, [pieData]);

    return(<ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Legend />
        </PieChart>
    </ResponsiveContainer>);
};

export default CustomPieChart;