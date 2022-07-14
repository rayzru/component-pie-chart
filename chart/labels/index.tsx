import React, { useEffect, useRef } from 'react';
import { ExtendedData, TypeType } from '../../types';
import * as d3 from 'd3';
import './index.css';

interface Props {
    data: ExtendedData[];
    initialPerc: number;
    type: TypeType;
    sum: number;
}

const Labels: React.FC<Props> = ({ data, initialPerc, type, sum }) => {
    const ref = useRef<any>();
    useEffect(() => {
        if (data && data.length) draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    
    const angleToRotate = (startAngle: number, endAngle: number): number => {
        return Math.round(((startAngle + endAngle) / 2) / Math.PI * 180) + initialPerc * 3.6
    }

    const buildRotateStringWrap = (rotate: number): string => `rotate(${rotate} 35 200)`
    const buildRotateStringText = (rotate: number): string => {
        const deg: string = rotate > 0 ? `-${rotate}` : Math.abs(rotate).toString()
        return `rotate(${deg} 34 36)`
    }

    const getValue = (value: number): string => {
        let result: string = `${value}%`
        if (type === 'degrees') result = `${Math.round(value*3.6)}°`
        if (type === 'pieces') result = `${Math.round(value*sum/100)}`
        return result
    } 

    const draw = () => {
        const svg = d3.select(ref.current);
        // const arc = d3.arc<d3.PieArcDatum<ExtendedData>>().outerRadius(140).innerRadius(140);
        const pie = d3.pie<ExtendedData>().sort(null).value(function (d: ExtendedData) { return d.value; });

        svg
            .selectAll('g.label')
            .data(pie(data))
            .join(
                enter => {
                    const group = enter
                        .append('svg:g')
                        .attr('class', (d, i) => {
                            const stack = data[i].stack || 0;
                            return stack !== 0
                                ? (stack === -1)
                                    ? 'label label-hidden'
                                    : `label label-stack label-stack-${stack}`
                                : 'label'
                        })
                        .attr('transform', 'translate(0, 0)');

                    const subGroup = group
                        .append('svg:g')
                        .attr('class', 'label-wrap')
                        .attr('transform', d => {
                            const rotate = angleToRotate(d.startAngle, d.endAngle);
                            return buildRotateStringWrap(rotate);
                        });

                    subGroup
                        .append('svg:circle').attr('class', 'label-shadow label-shadow-5')
                        .attr('fill', '#d2d2d2').attr('stroke', '#fff').attr('stroke-width', 0.7)
                        .attr('cx', 35).attr('cy', 20).attr('r', 26).attr('style', 'filter: url(#shadow)');

                    subGroup
                        .append('svg:circle').attr('class', 'label-shadow label-shadow-4')
                        .attr('fill', '#d2d2d2').attr('stroke', '#fff').attr('stroke-width', 0.7)
                        .attr('cx', 35).attr('cy', 24).attr('r', 26).attr('style', 'filter: url(#shadow)');

                    subGroup
                        .append('svg:circle').attr('class', 'label-shadow label-shadow-3')
                        .attr('fill', '#d2d2d2').attr('stroke', '#fff').attr('stroke-width', 0.7)
                        .attr('cx', 35).attr('cy', 28).attr('r', 26).attr('style', 'filter: url(#shadow)');

                    subGroup
                        .append('svg:circle').attr('class', 'label-shadow label-shadow-2')
                        .attr('fill', '#d2d2d2').attr('stroke', '#fff').attr('stroke-width', 0.7)
                        .attr('cx', 35).attr('cy', 32).attr('r', 26).attr('style', 'filter: url(#shadow)');

                    subGroup
                        .append('svg:circle').attr('class', 'label-shadow label-shadow-1')
                        .attr('fill', '#d2d2d2').attr('stroke', '#fff').attr('stroke-width', 0.7)
                        .attr('cx', 35).attr('cy', 36).attr('r', 26).attr('style', 'filter: url(#shadow)');

                    subGroup
                        .append('svg:path')
                        .attr('transform', 'scale(1.3686)')
                        .attr('d', "M9.2 36.6c1.6 3.8 5.5 8.3 9.1 11.8 3.6 3.6 6.8 6.3 7.1 6.5.2.2.4.2.6.2.2 0 .4-.1.6-.2.3-.3 3.5-3 7.1-6.5 3.5-3.5 7.4-8 9.1-11.8C44.2 34 45 31 45 27.8c0-10.5-8.5-19-19-19s-19 8.5-19 19c0 3.2.8 6.2 2.2 8.8z")
                        .attr('fill', '#fff').attr('stroke', '#d2d2d2').attr('stroke-width', 0.7);


                    subGroup
                        .append('svg:circle')
                        .attr('class', 'label-circle')
                        .attr('cx', 35)
                        .attr('cy', 60)
                        .attr('r', 5)
                        .attr('fill', d => d.data.color);

                    subGroup
                        .append('svg:text')
                        .attr('font-size', '18px')
                        .attr('font-weight', '400')
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('x', 35)
                        .attr('y', 37)
                        .text(d => getValue(d.value))
                        .attr('transform', d => {
                            const rotate = angleToRotate(d.startAngle, d.endAngle);
                            return buildRotateStringText(rotate);
                        });

                    return group;
                },
                update => {
                    const group = update
                        .attr('class', (d, i) => {
                            const stack = data[i].stack || 0;
                            return stack !== 0
                                ? stack === -1
                                    ? 'label label-hidden'
                                    : `label label-stack label-stack-${stack}`
                                : 'label'
                        });

                    const subGroup = group
                        .select('g.label-wrap')
                        .attr('transform', d => {
                            const rotate = angleToRotate(d.startAngle, d.endAngle);
                            return buildRotateStringWrap(rotate);
                        });

                    subGroup
                        .select('circle.label-circle')
                        .attr('fill', d => d.data.color);

                    subGroup
                        .select('text')
                        .text(d => getValue(d.value))
                        .attr('transform', d => {
                            const rotate = angleToRotate(d.startAngle, d.endAngle);
                            return buildRotateStringText(rotate);
                        });

                    return update;
                },
                exit => exit.remove()
            )

    }

    return (
        <svg width={400} height={400} viewBox="0 0 400 400" className='svglabels' >
            <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
                <feOffset dx="0" dy="-2" result="offsetblur" />
                <feFlood floodColor="#aaa" floodOpacity="0.9" />
                <feComposite in2="offsetblur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>

            </filter>
            <g ref={ref} className="labels" transform={`translate(165, 0)`} />
        </svg>
    );
}

export default Labels;