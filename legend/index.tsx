import React from 'react';
import Select from '../legend/select';
import LegendColor from '../legend/legend-color';
import { Color, ExtendedData, ModeType } from '../types';
import './index.css';

interface Props {
    data: ExtendedData[];
    mode: ModeType;
    selectOptions: string[];
    onSetName: (label: string, slug: string) => void;
    onRemove: (color: Color) => void;
    selectComponent?: any;
}

const Legend: React.FC<Props> = ({ data, mode, selectOptions, onRemove, onSetName, selectComponent }) => {
    
    const legendData = (): ExtendedData[] => {
        const _data = [...data]
        return _data.sort((a, b) => a.index - b.index)
    }

    const removeHandler = (item: ExtendedData): void => {
        onRemove && onRemove(item.color);
    }

    return (
        <div className='legend'>
            {legendData().map((item: ExtendedData) => (
                <div key={`legend-${item.color}`} className='legend__item'>
                    <LegendColor color={item.color} />
                    {mode === 'fill' 
                        ? <span className='legend__text'>{item.label}</span> 
                        : (
                        <Select
                            is_valid={item.is_valid}
                            active={item.label}
                            data={selectOptions}
                            closable={data.length !== 1}
                            onClose={() => removeHandler(item)}
                            onSetName={(label: string) => onSetName(label, item.slug)}
                            selectComponent={selectComponent}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}


export default Legend;