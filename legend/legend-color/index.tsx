import React from 'react';
import { Color } from '../../types';
import './index.css';

type Props = {
    color: Color;
};

const LegendColor: React.FC<Props> = ({ color }) => {
    return (
        <div className="legend-color" style={{ backgroundColor: color }} />
    );
};

export default LegendColor;
