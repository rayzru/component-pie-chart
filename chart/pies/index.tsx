import React, { useEffect, useRef } from 'react';
import { ExtendedData } from '../../types';
import * as d3 from 'd3';
import './index.css';

interface Props {
    data: ExtendedData[];
    initialPerc: number
}

const Pies = ({ data, initialPerc }: Props): JSX.Element => {
    const ref = useRef<any>();
    useEffect(() => {
        if (data && data.length) draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const getFillOpacity = ({is_valid, is_active}: ExtendedData): string => {
        return is_valid ? '0.5' : is_active ? '0.8' : '1'
    }

    const draw = () => {
        const svg = d3.select(ref.current);
        const arc = d3.arc<d3.PieArcDatum<ExtendedData>>().outerRadius(120).innerRadius(0);
        const pie = d3.pie<ExtendedData>().startAngle((Math.PI * 2) / 100 * initialPerc).sort(null).value(function (d: ExtendedData) { return d.value; });

        svg
            .selectAll('path.pie')
            .data(pie(data))
            .join(
                enter =>
                    enter
                        .append('path')
                        .attr('class', 'pie')
                        .attr('fill', d => d.data.color)
                        .attr('fill-opacity', d => getFillOpacity(d.data))
                        .attr('d', arc),
                update =>
                    update
                        .attr('fill', d => d.data.color)
                        .attr('fill-opacity', d => getFillOpacity(d.data))
                        .attr('d', arc)
            );

    }

    return (
        <svg width={400} height={400} viewBox="0 0 400 400" className={'svgpies'}>
            <g ref={ref} className="pies" transform={`translate(200, 200)`} />
        </svg>
    );
}

export default Pies;