import React from 'react';
import useHelpers from '../../hooks/useHelpers';
import { ExtendedData, ModeType } from '../../types';
import Control from './control';
import './index.css'

interface Props {
    data: ExtendedData[];
    initialPerc: number;
    mode: ModeType
}

const Controls: React.FC<Props> = ({ data, initialPerc, mode }) => {
    const {getAngle, getZIndex, getPrimaryColor, getSecondaryColor, getLineColor} = useHelpers(data, initialPerc)

    const isShowControl = (is_valid: boolean | null, i:number): boolean => {
        return is_valid !== null || (mode === 'simple' && i === 0) || getPrimaryColor(i) === getSecondaryColor(i)
    }

    return (
        <div className="svgcontrols">
            {data.length > 1 && data.map(({ color, is_valid }, i) => {
                return isShowControl(is_valid, i) ? null : <Control
                    key={`control-${color}`}
                    angle={getAngle(i)} 
                    primaryColor={getPrimaryColor(i)}
                    secondaryColor={getSecondaryColor(i)}
                    lineColor={getLineColor(i)}
                    zIndex={getZIndex(i)}
                />
            })}
        </div>
    )
}

export default Controls;