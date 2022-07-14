// TODO:
// фикс мин и макс когда около валидного крайнего
// отступ у label при ховер и актив
// стэк каплей
// удаление ненужного кода
// фикс у положения долей, то что не пропорционально проценту например 12 или 16 - ?
// ввод кол-ва долей - ?

import React, { useEffect, useState } from 'react';
import Legend from '../legend';
import ButtonAppend from '../legend/button-append';
import { Color, ComponentChartProps, ExtendedData } from '../types';
import Controls from './controls';
import './index.css';
import Labels from './labels';
import Pies from './pies';
import Title from '../title';
import Rotators from './rotators';
import Fractions from './fractions';
import Validations from './validations';
import useHelpers from '../hooks/useHelpers';
import { buildExtendData, buildData, getSumValue } from './helpers';

const PieChart: React.FC<ComponentChartProps> = ({ 
    user_answer, 
    options = {}, 
    readOnly = false, 
    answer_status,
    setAnswer,
    statusMode,
    answer,
    selectComponent
}) => {
    const { title = '', mode = 'simple', step = 0, selectOptions = [], type = 'perc', piecesSum = 0 } = options

    const [initSum, setInitSum] = useState<number>(piecesSum 
        ? piecesSum 
        : type === 'pieces' && user_answer 
            ? getSumValue(user_answer) 
            : 0
        )

    const extendData: ExtendedData[] = buildExtendData(user_answer, mode, type, answer_status, statusMode, answer, initSum)
    const [data, setData] = useState<ExtendedData[]>(extendData);
    const [initialPerc, setInitialPerc] = useState<number>(mode === 'simple' ? 0 - extendData[0].value : 0)
    const [isDisabledBtn, setIsDisabledBtn] = useState<boolean>(false)
    
    const { getDataIndexByColor, getFreeColor } = useHelpers(data)

    const onAddHandler = () => {
        const _nextIndex = Math.max(...data.map(i => i.index)) + 1
        const _newItem: ExtendedData = { 
            value: 0,
            label: '', 
            is_active: false, 
            is_valid: null,
            color: getFreeColor(), 
            index: _nextIndex,
            slug: `slug-${_nextIndex}`,
            is_init_color: false
        };

        const _newData = [...data.slice(0, data.length - 1), _newItem, ...data.slice(data.length - 1)]

        setIsDisabledBtn(true)
        !user_answer && setData(_newData)
        onFinishHandler(_newData)
    }

    const onSetNameHandler = (label: string, slug: string): void => {
        const _newData: ExtendedData[] = data.map(item => ({
            ...item,
            label: item.slug === slug ? label : item.label
        }))

        !user_answer && setData(_newData)
        onFinishHandler(_newData)
    }

    const onRemoveHandler = (color: Color) => {
        const targetIndex = getDataIndexByColor(color)
        const delta = data[targetIndex].value
        const changedIndex = targetIndex === data.length - 1 ? 0 : targetIndex + 1;

        const _newData = data.reduce((acc: ExtendedData[], item, i) => {
            if (item.color !== color) acc.push({
                ...item,
                value: i === changedIndex ? item.value + data[targetIndex].value : item.value
            })
            
            return acc
        }, [])

        changedIndex === 0 && setInitialPerc(-delta)
        
        isDisabledBtn && setIsDisabledBtn(false)
        !user_answer && setData(_newData)
        onFinishHandler(_newData)
    }

    const onChangeHandler = (_newData: ExtendedData[]) => {
        isDisabledBtn && setIsDisabledBtn(false)
        setData(_newData)
    }

    const onFinishHandler = (resultData: ExtendedData[]) => {
        setAnswer(buildData(resultData, mode, type, initSum))
    }

    useEffect(() => {
        if (user_answer) {
            const _newData = buildExtendData(user_answer, mode, type, answer_status, statusMode, answer, initSum)
            setData(_newData)
            if (mode === 'simple') {
                setInitialPerc(0 - _newData[0].value)
            }
        }

        if (type === 'pieces' && user_answer) {
            setInitSum(piecesSum ? piecesSum : getSumValue(user_answer))
        }
    }, [answer_status, statusMode, answer, user_answer, mode, type, piecesSum, initSum])

    return (
        <div className="component-wrapper" style={{pointerEvents: readOnly ? 'none' : 'initial'}}>
            <div className="component-title-wrapper">
                <Title>{title}</Title>
            </div>

            <div className="component-columns">
                {mode !== 'simple' && (
                    <div className="component-column">
                        <Legend 
                            data={data}
                            mode={mode}
                            selectOptions={selectOptions} 
                            onRemove={onRemoveHandler}
                            onSetName={onSetNameHandler}
                            selectComponent={selectComponent}
                        />
                        {mode === 'create' && data.length !== 6 && (
                            <ButtonAppend disabled={isDisabledBtn || data.length >= 6} onClick={onAddHandler} />
                        )}
                    </div>
                )}
                <div className="component-column chart-wrapper">
                    <Pies initialPerc={initialPerc} data={data} />
                    {mode !== 'simple' && (
                        <Labels initialPerc={initialPerc} data={data} type={type} sum={initSum} />
                    )}
                    <Fractions step={step} />
                    <Validations initialPerc={initialPerc} data={data} />
                    <Controls initialPerc={initialPerc} data={data} mode={mode} />
                    <Rotators
                        data={data} 
                        initialPerc={initialPerc}
                        type={type}
                        onChange={onChangeHandler} 
                        onChangeInitalPerc={(perc: number) => setInitialPerc(perc)} 
                        onFinish={onFinishHandler}
                    />
                </div>
            </div>
        </div>
    );
}


export default PieChart;