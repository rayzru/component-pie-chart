import React from 'react';

import PlusSvg from './icons/Plus';

import './index.css';

type Props = {
    x?: number;
    y?: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    disabled?: boolean;
};

const ButtonAppend: React.FC<Props> = ({ x, y, onClick, onMouseEnter, onMouseLeave, disabled = false }) => {
    let style = {};

    if (x !== undefined && y !== undefined) {
        style = {
            position: 'absolute',
            left: x,
            top: y,
        };
    }

    const handleClick = () => {
        !disabled && onClick && onClick();
    };

    const handleMouseEnter = () => {
        !disabled && onMouseEnter && onMouseEnter();
    };

    const handleMouseLeave = () => {
        !disabled && onMouseLeave && onMouseLeave();
    };

    return (
        <button
            type="button"
            className={`button-append ${disabled ? 'button-append--disabled' : ''}`}
            style={style}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <PlusSvg />
            <span>{'Добавить'}</span>
        </button>
    );
};

export default ButtonAppend;
