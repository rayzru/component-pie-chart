import React from 'react';
import PieChart from './chart';
import './index.css';
import { ComponentChartProps } from './types';


const ComponentPieChart: React.FC<ComponentChartProps> = (props) => {
    return (
        <PieChart {...props} />
    );
};

export default ComponentPieChart;
