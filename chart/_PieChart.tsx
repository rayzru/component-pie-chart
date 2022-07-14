// @ts-nocheck
/* eslint-disable */
import { ComponentPieChartProps, PieChartDataExpanded, Color, Colors } from '../types';
import { useRef, useState, useEffect } from 'react';
import { select, Selection, arc } from 'd3';
import React from 'react';
import ReactDom from 'react-dom';
import ButtonAppend from '../legend/button-append';
import {
    pieDataExpander, PieLabelSVG, rad2deg, randomString,
    getCoordinates, valuesSum, isNextAngleSame, averageAngle, perc2rad, rad2perc, deg2perc, deg2rad, perc2deg, perc2rad2, shift100
} from './helpers';
import Select from '../legend/select';
import LegendColor from '../legend/legend-color';
import Control from './controls/control';
import Rotator from './rotators/rotator';
import { useDebouncedEffect } from '../../../hooks';
import { PieChartData } from '../types'
// import ButtonClose from '../button-close';

const PieChart: React.FC<ComponentPieChartProps<number>> = ({
    data: chartData = [],
    selectOptions = [],
    options: { title = '', width = 760, maxItems = 6 },
    readOnly = false,
}) => {
    const margin = { top: 20, right: 110, bottom: 110, left: 110, title: 110 };
    const legend = { height: 40, width: 200 };
    const labelOptions = { width: 60, height: 72 };
    const radius = 140;

    const [height, setHeight] = useState(margin.top + margin.bottom + radius * 2);

    if (chartData.length === 0) {
        chartData = [{ value: 100, initial: true }];
    } else {
        const initialSum = valuesSum(chartData);
        if (initialSum === 100) {
            chartData = [...chartData, { value: 0, initial: true }];
        } else {
            chartData = [...chartData, { value: 100 - initialSum, initial: true }];
        }
    }

    chartData = chartData.map((dId, i) => ({ ...dId, id: dId.id || randomString(10), color: Colors[i] }));

    const [initialAngle, setInitialAngle] = useState<number>(0);
    const [editing, setEditing] = useState<string | undefined>(undefined);
    const [rotate, setRotate] = useState<number>(0);

    const [pieData, setPieData] = useState<PieChartDataExpanded[]>([]);
    const [pieDataShifted, setPieDataShifted] = useState<PieChartDataExpanded[]>([]);

    const [data, setData] = useState<Array<PieChartData<number>>>(chartData);

    const isLastEmpty = data.length > 1 && data.slice(-2).reduce((dataSum, el) => dataSum + el.value, 0) === 0;

    const svgRef = useRef<any>();
    const svg = useRef<Selection<SVGGElement, any, null, undefined>>();
    const dropdownRef = useRef<any>();
    const controlRef = useRef<any>();
    const closeRef = useRef<any>();

    const getLegendYPos = (index: number) => index * legend.height;

    const chartPositionAdjuster = `translate(${radius} ${margin.top + margin.title + radius})`;

    const getFreeColor = () => {
        const free = Colors.filter(e => pieData.findIndex((pd: any) => e === pd.color) === -1);
        return free.length ? free[0] : '';
    };

    const drawPies = () => {
        // if (!svg.current) return;
        // const arcGenerator = arc().innerRadius(0).outerRadius(radius);
        // svg.current
        //     .select('.chart .pies')
        //     .attr('transform', chartPositionAdjuster)
        //     .selectAll('path.pie')
        //     .data(pieDataShifted)
        //     .join(
        //         enter =>
        //             enter
        //                 .append('path')
        //                 .attr('class', 'pie')
        //                 .attr('fill', i => i.color as PieColor)
        //                 .attr('d', arcGenerator),
        //         update => update.attr('fill', i => i.color as PieColor).attr('d', arcGenerator)
        //     );
    };
    const drawLabels = () => {
        if (!svg.current) return;

        const labelOptionsShift = `${labelOptions.width / 2} ${labelOptions.height / 2}`;

        const labelTransition = (d: any) => {

            const dx = (isNextAngleSame(d.id, data) ? d.avg.coords2.x : d.avg.coords.x) - labelOptions.width / 2;
            const dy = (isNextAngleSame(d.id, data) ? d.avg.coords2.y : d.avg.coords.y) - labelOptions.height / 2;
            const da = `${rad2deg(d.avg.angle)} ${labelOptionsShift}`;
            return `translate(${dx} ${dy}) rotate(${da})`;
        };

        const labelTextTransition = (d: any) => {
            const radialDelta = (labelOptions.height - labelOptions.width) / 2;
            const textLabelDelta = getCoordinates(radialDelta, d.avg.angle);
            const dx = labelOptions.width / 2 + textLabelDelta.x;
            const dy = labelOptions.height / 2 + -textLabelDelta.y - 5;
            return `translate(${dx} ${dy}) rotate(${-Math.round(rad2deg(d.avg.angle) * 100) / 100})`;
        };
        svg.current
            .select('.chart .labels')
            .attr('transform', chartPositionAdjuster)
            .selectAll('g.label')
            .data(pieDataShifted)
            .join(
                enter => {
                    const g = enter.append('g').attr('class', 'label').attr('transform', labelTransition);

                    // g.transition('path').duration(100)

                    g.append('path')
                        .attr('class', 'label__figure')
                        .attr('stroke-width', 2)
                        .attr('stroke', d => d.color as Color)
                        .attr('fill', 'white')
                        .attr('d', PieLabelSVG);

                    g.append('text')
                        .attr('class', 'label__text')
                        .attr('font-size', 16)
                        .attr('font-weight', 500)
                        .attr('fill', '#253550')
                        .style('text-anchor', 'middle')
                        .text(d => `${d.value}%`)
                        .attr('transform', labelTextTransition);

                    return g;
                },
                update => {
                    update
                        .select('.label__text')
                        .text(d => `${d.value}%`)
                        .attr('transform', labelTextTransition);
                    update.select('.label__figure').attr('stroke', d => d.color as Color);
                    return update.attr('transform', labelTransition);
                }
            );
    };

    const onRemove = (id: string) => {
        const toDelete = data.find(v => v.id === id);
        const toDeleteIndex = data.findIndex(v => v.id === id);

        const acceptorIndex = data.length - 1 === toDeleteIndex ? toDeleteIndex - 1 : toDeleteIndex;

        const newData = data.filter(v => v.id !== id);

        newData[acceptorIndex].value = newData[acceptorIndex].value + (toDelete?.value || 0);
        newData[newData.length - 1].initial = true;

        if (data.length === 2) {
            setInitialAngle(0);
        }

        setEditing(undefined);
        setData(newData);
    };

    const onAdd = () => {
        const sum = valuesSum(data);
        const newValue = sum >= 100 ? 0 : 100 - sum;
        const newItem = { value: newValue, id: randomString(10), color: getFreeColor() };
        setData(data.length ? [...data.slice(0, data.length - 1), ...[newItem], ...data.slice(data.length - 1)] as PieChartDataExpanded[] : [newItem] as PieChartDataExpanded[]);
        setEditing(undefined);
        // onChange && onChange(data);
    };

    const onRotate = (rotateAngle: number, id: string) => {
        setEditing(id);
        setRotate(rotateAngle);
    };

    const onRotateFinish = (id?: string) => {
        setEditing(undefined);
    };

    const drawLegend = () => {
        if (!svg.current) return;

        const dropDownData = selectOptions.map(d => ({ name: d, value: d }));
        const x = margin.left + radius * 2 + margin.right;

        let resorted = [];
        if (pieData.length >= 2) {
            const initial = pieData.findIndex(el => el.initial === true);
            if (initial !== -1) {
                const last = pieData[pieData.length - 1];
                resorted = [last, ...pieData.slice(0, pieData.length - 1)];
            } else {
                resorted = pieData;
            }
        } else {
            resorted = pieData;
        }

        const dropdown = resorted.map((d: any, i) => {
            const y = getLegendYPos(i) + margin.top + 20 + 34;
            return (
                <div key={`legendItem${i}`}>
                    <LegendColor color={d.color} />
                    <Select
                        x={x}
                        y={y}
                        data={dropDownData}
                        closable={pieData.length !== 1}
                        closePosition="right"
                        onClose={() => {
                            onRemove(d.id);
                        }}
                    />
                </div>
            );
        }) as any;

        ReactDom.render(dropdown, dropdownRef.current);
    };

    const renderControls = () => {
        if (!pieDataShifted.length) return <div />;
        const init: PieChartDataExpanded | undefined = pieDataShifted.find(el => el.initial === true);
        const isInitialRendered = init && pieDataShifted.length > 1 && init.startAngle !== pieDataShifted[0].startAngle;

        return (
            <g className="controls" transform={`translate(${radius - 28} ${margin.title - 15})`}>
                {init && isInitialRendered && (
                    <Control color={init.color as Color} value={Math.round(rad2deg(init.endAngle))} />
                )}
                {pieDataShifted.map((d: PieChartDataExpanded, i: number, arr: PieChartDataExpanded[]) => {
                    const key = `control-${d.id}`;
                    if (i === arr.length - 1) return <div key={key} />;
                    const value = Math.round(rad2deg(d.endAngle));
                    return <Control color={d.color as Color} value={value} />;
                })}

            </g>
        );
    };

    const renderPies = () => {
        let angleAccumulator = 0;
        return (
            <g className="pies" transform="translate(0 410) rotate(-90)">
                {pieData.map(pie => {
                    const circumference = Math.PI * (radius * 2);
                    const strokeOffset = 0.25 * circumference + (360 * angleAccumulator);
                    const strokeDasharray = (pie.value / 100) * circumference
                    angleAccumulator += pie.value / 100;
                    return (
                        <circle
                            cx={radius}
                            cy={radius}
                            r={radius / 2}
                            fill="transparent"
                            stroke={pie.color}
                            strokeWidth={radius}
                            strokeDasharray={`${strokeDasharray} ${circumference - strokeDasharray}`}
                            strokeDashoffset={strokeOffset}
                        />
                    )
                })}
            </g >
        )

    }

    const renderRotators = () => {
        if (pieData.length < 1) {
            ReactDom.render(<div />, controlRef.current);
            return;
        }

        ReactDom.render(<div />, controlRef.current);
        const rotators = (
            <>
                {pieDataShifted.map((d: PieChartDataExpanded, i: number, arr: PieChartDataExpanded[]) => {
                    const disabled = d.initial === true && (arr.length === 1 || (arr.length > 1 && !arr.some(a => a.startAngle !== d.startAngle)));
                    // sum += value;
                    return (
                        <Rotator
                            disabled={disabled}
                            onRotate={onRotate}
                            onFinish={onRotateFinish}
                            key={`rotator${d.id}`}
                            id={d.id}
                            cx={radius + margin.left}
                            cy={margin.top + margin.title + 8}
                            angle={Math.round(rad2deg(d.endAngle))}
                        />
                    );
                })}
            </>
        );

        ReactDom.render(rotators, controlRef.current);
    };

    useEffect(() => {
        const svgEl = select(svgRef.current);
        svg.current = svgEl;
    }, []);

    useEffect(() => {
        setHeight(radius * 2 + margin.bottom + margin.top + margin.title + 20);
        onRotateFinish();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    useEffect(() => {
        const targetRadius = radius + labelOptions.height / 2 + 2;
        const targetRadiusDelta = 4;
        const pData: any[] = pieDataExpander(data, targetRadius, targetRadiusDelta) || [];
        setPieData(pData);
        setPieDataShifted(pData.map((d: PieChartDataExpanded) => {
            const startAngle = d.startAngle + perc2rad2(initialAngle);
            const endAngle = d.endAngle + perc2rad2(initialAngle);
            const avgA = averageAngle(startAngle, endAngle);
            return {
                ...d, startAngle, endAngle,
                avg: {
                    angle: avgA,
                    coords: getCoordinates(targetRadius, avgA),
                    coords2: getCoordinates(targetRadius + targetRadiusDelta, avgA),
                }
            }
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        drawLabels();
        // drawPies();
        drawLegend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pieData]);


    useEffect(() => {

        if (editing && rotate < 360) {
            const targetIndex = pieData.findIndex(d => d.id === editing);

            if (targetIndex !== -1) {

                // clone to make immutable array
                const _data = data.slice(0);

                const current = pieData[targetIndex];
                const next = pieData.length <= targetIndex + 1 ? pieData[targetIndex + 1] : undefined;
                const prev = targetIndex > 0 ? pieData[targetIndex - 1] : undefined;
                const first = pieData[0];

                const isInitial = current.initial || false;
                const _currentA = Math.round(deg2perc(rotate % 360)) % 100;
                if (initialAngle === _currentA) return;

                const _shiftedA = shift100(initialAngle, _currentA)
                const _rotate = _shiftedA - initialAngle;

                // const _rotate2 = shift100(initialAngle, _currentA);
                // if (_rotate2 === 0) return;

                if (isInitial) {

                    const _cpoint = pieData[0].value;
                    const _delta = _rotate - initialAngle;

                    first.value -= _delta;
                    current.value += _delta;

                    setInitialAngle(_currentA);
                    setData([..._data]);
                    return;
                }

                const min = Math.round(rad2perc(current.min));
                const max = Math.round(rad2perc(current.max));

                const _value = _rotate - min;
                const _delta = _value - current.value

                if (_delta === 0) return;

                if (_rotate + _delta > min && _rotate - _delta < max) {
                    _data[targetIndex].value += _delta;
                    _data[targetIndex + 1].value -= _delta;
                    setData([..._data]);
                }
            }
        }

    }, [rotate]);


    useDebouncedEffect(() => { !editing && renderRotators(); }, 10, [pieData, editing]);

    return (
        <div style={{ position: 'relative', userSelect: 'none', pointerEvents: readOnly ? 'none' : 'initial' }}>
            <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <g className="chart" transform={`translate(${margin.left}, ${margin.top})`}>
                    <g className="labels"></g>
                    {renderPies()}
                    {renderControls()}
                </g>
            </svg>
            <div ref={controlRef} />
            <div ref={closeRef} />
            <div ref={dropdownRef} />
            {data.length < maxItems && (
                <ButtonAppend
                    x={margin.left + margin.right + radius * 2}
                    y={margin.top + getLegendYPos(data.length) + 20 + 34}
                    disabled={isLastEmpty}
                    onClick={onAdd}
                />
            )}
        </div>
    );
};

export default PieChart;
