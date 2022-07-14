import React from 'react';
import { Color, zIndexType } from '../../../types';
import './index.css';

type Props = {
    angle: number;
    primaryColor?: Color;
    secondaryColor?: Color | '#E8E9ED';
    lineColor?: Color | 'transparent';
    zIndex?: zIndexType
};

const Control: React.FC<Props> = ({ primaryColor, secondaryColor, angle, lineColor, zIndex = 'inherit' }) => {
    return (
        <div
            className={'control-element'}
            style={{transform: `rotate(${angle}deg)`, zIndex}}
        >
            <div className={'ctrl'}></div>
            <div className={'cw'} style={{borderTopColor: primaryColor}}></div>
            <div className={'ccw'} style={{borderTopColor: secondaryColor}}></div>
            <div className={'line'} style={{backgroundColor: lineColor}}></div>
        </div>
    );
}

export default Control;
