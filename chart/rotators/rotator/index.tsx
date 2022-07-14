import React, { HTMLAttributes, useState, useEffect, useRef, useCallback } from 'react';
import { zIndexType } from '../../../types';
import { getAngle } from '../../helpers';
import './index.css';

type Props = {
    cx?: number;
    cy?: number;
    angle?: number;
    disabled?: boolean;
    style?: HTMLAttributes<HTMLDivElement>;
    onRotate?: (angle: number) => void
    onFinish?: () => void
    onStart?: (index: number) => void
    index?: number
    zIndex?: zIndexType
};


const Rotator: React.FC<Props> = ({ disabled = false, cx = 0, cy = 0, angle: initAngle = 0, onRotate, onFinish, onStart, index, zIndex = 'inherit' }) => {

    const [angle, setAngle] = useState<number>(initAngle);
    const ref = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false);
    const isDisabled = disabled;
    const style = {
        position: 'absolute',
        transform: `rotate(${initAngle}deg)`,
        zIndex: zIndex,
        pointerEvents: isDisabled ? 'none' : 'inherit',
        cursor: isDragging.current ? 'grabbing' : 'pointer',
        // background: 'red'
    } as HTMLAttributes<HTMLDivElement>;

    const onMouseDown = useCallback(e => {
        if (ref.current && ref.current.contains(e.target)) {
            isDragging.current = true;
            onStart && index !== undefined && onStart(index)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, onStart]);

    const onMouseUp = useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false;
            onFinish && index !== undefined && onFinish();
        }
    }, [index, onFinish]);

    const onMouseMove = useCallback(e => {
        if (isDragging.current && ref.current) {
            const { clientWidth: cw, clientHeight: ch } = ref.current;
            const movedAngle = Math.round(getAngle(
                { x: cx + cw - 10, y: cy + ch }, 
                { x: e.pageX, y: e.pageY }
            ));
            if (movedAngle !== Math.round(angle)) {
                setAngle(movedAngle);
                onRotate && onRotate(movedAngle);
            }
        }
    }, [cx, cy, angle, onRotate]);

    useEffect(() => {
        onRotate && onRotate(angle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [angle])


    useEffect(() => {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);

        };
    }, [onMouseMove, onMouseDown, onMouseUp]);

    return (
        <div
            ref={ref}
            className="rotator"
            style={style}
        />
    );
};

export default Rotator;
