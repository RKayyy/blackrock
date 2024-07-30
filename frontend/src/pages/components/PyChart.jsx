import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Tooltip, Cell, LabelList } from 'recharts';

const PieChart = ({ data, outerRadius, colors }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <RechartsPieChart width={700} height={700}>
            <Pie
                activeIndex={activeIndex}
                data={data}
                dataKey="students"
                outerRadius={outerRadius}
                fill="green"
                onMouseEnter={onPieEnter}
                style={{ cursor: 'pointer', outline: 'none' }} // Ensure no outline on focus
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
                <LabelList
                    dataKey="name"
                    position="outside"
                    fill="#000"
                    fontSize={12}
                />
            </Pie>
            <Tooltip />
        </RechartsPieChart>
    );
};

export default PieChart;
