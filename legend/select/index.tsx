import React from 'react';
import './index.css';
import CloseSvg from './icons/Close';

type Props = {
    data: string[];
    active: string;
    closable?: boolean;
    closePosition?: string;
    onClose?: () => void;
    onSetName?: (name: string) => void;
    is_valid?: boolean | null;
    selectComponent?: any;
};

const Select: React.FC<Props> = ({ data, active, closable = false, onClose, onSetName, closePosition = 'right', is_valid = null, selectComponent: SelectComponent }) => {

    const handleCloseClick = (e: any) => {
        e.stopPropagation();
        onClose && onClose();
    };

    const handleSetAnswer = (name: string) => {
        onSetName && onSetName(name)
    }

    return (
        <div className="custom-select__content" style={{pointerEvents: is_valid ? 'none': 'initial'}}>
            {SelectComponent && (
                <SelectComponent 
                    className="custom-select__bar-chart"
                    setAnswer={handleSetAnswer}
                    options={{
                        choices: data, 
                        placeholder: '?'
                    }}
                    readOnly={false}
                    userAnswer={active}
                    theme={is_valid === null ? 'normal' : is_valid ? 'correct' : 'incorrect'}
                    
                />
            )}
            {closable && (
                <span
                    className={`custom-select__close custom-select__close--${closePosition}`}
                    onClick={handleCloseClick}
                >
                    <CloseSvg />
                </span>
            )}
        </div>

    )
};

export default Select;
