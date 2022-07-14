import React, {useEffect, useRef, useState} from 'react';
import { ExtendedData, TypeType } from '../../types';
import Rotator from './rotator';
import './index.css'
import useHelpers from '../../hooks/useHelpers';

interface Props {
    data: ExtendedData[];
    initialPerc: number;
    type: TypeType;
    onChange?: (d: ExtendedData[]) => void;
    onChangeInitalPerc?: (perc: number) => void;
    onFinish?: (d: ExtendedData[]) => void;
}

interface StartState {
    sum: number;
    value: number;
    nextValue: number;
    initial: number;
    isStart: boolean;
}

const INIT_START_STATE: StartState = {
    sum: 0,
    value: 0,
    nextValue: 0,
    initial: 0,
    isStart: false
}

const Rotators: React.FC<Props> = ({ data, onChange, onChangeInitalPerc, initialPerc, type, onFinish }) => {

    const ref = useRef<HTMLDivElement>(null) 
    const [coord, setCoord] = useState<{cx: number, cy: number}>({cx: 0, cy: 0});
    const [startState, setStartState] = useState<StartState>(INIT_START_STATE);
    const {getSum, getAngle,getZIndex, getNextIndex} = useHelpers(data, initialPerc)

    const onRotate = (angle: number, index: number): void => {
        const { sum, value, nextValue, initial, isStart } = startState
        if (!isStart) return 
        
        const _isLastElement = index === data.length - 1
        const _nextIndex = getNextIndex(index)
        
        let _nAngle = angle + (Math.abs(initial)*3.6)
        if (_nAngle > 360) _nAngle -= 360
        
        const _rotate = type === 'degrees' ? _nAngle / 3.6 : Math.round(_nAngle / 3.6)
        let _delta = _rotate - sum

        if (_isLastElement || _nextIndex < index) {
            if (value + _delta > 100) _delta -= 100
            if (value + _delta < 0) _delta += 100

            let _curInitial = initial + _delta
            if (_curInitial < -100) _curInitial += 100
            if (_curInitial > 0) _curInitial -=100
            onChangeInitalPerc && onChangeInitalPerc(_curInitial)

            let _newValue = value + _delta
            let _newNextValue = nextValue - _delta
            
            if (data[index].value !== _newValue && data[_nextIndex].value !== _newNextValue) {
                if (_newValue === 0 || _newNextValue === 0) {
                    onFinishHandler()
                }
                data[index].value = _newValue
                data[_nextIndex].value = _newNextValue
                onChange && onChange([...data])
            }
        } else {
            if (sum === 0 && _rotate >= 98) {
                onFinishHandler()
                return
            }
            let _newValue = value + _delta
            if (_newValue <= 0) _newValue = 0
            
            let _newNextValue = nextValue - _delta
            if (_newNextValue <= 0) _newNextValue = 0
            
            if (data[index].value !== _newValue && data[_nextIndex].value !== _newNextValue) {
                if (_newValue === 0 || _newNextValue === 0) {
                    onFinishHandler()
                }
                data[index].value = _newValue
                data[_nextIndex].value = _newNextValue
                onChange && onChange([...data])
            }
        }
    }

    const onStart = (index: number): void => {
        const _nextIndex = getNextIndex(index)
        
        onChange && onChange(data.map((d, i) => ({
            ...d,
            is_active: [index, _nextIndex].includes(i)
        })))

        setStartState({
            sum: getSum(index),
            value: data[index].value,
            nextValue: data[_nextIndex].value,
            initial: initialPerc,
            isStart: true
        })
    }

    const onFinishHandler = () => {
        onChange && onChange(data.map(d => ({...d, is_active: false})))
        setStartState(INIT_START_STATE)
        onFinish && onFinish(data)
    }

    useEffect(() => {
        if (!ref.current) return
        const { x, y } = ref.current.getBoundingClientRect()
        setCoord({ cx: x, cy: y })
    }, [ref])

    return (
        <div className="svgrotators" ref={ref}>
            {data.length > 1 && data.map(({ color, is_valid, slug }, i) => {
                return is_valid ? null : <Rotator
                    key={`rotator-${color}`}
                    index={i}
                    onStart={onStart}
                    onFinish={onFinishHandler}
                    onRotate={(angle) => onRotate(angle, i)}
                    angle={getAngle(i)}
                    zIndex={getZIndex(i)}
                    {...coord}
                />
            })}
        </div>
    )
}

export default Rotators;