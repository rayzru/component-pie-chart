import React, { useEffect, useRef } from 'react';
import { ExtendedData } from '../../types';
import * as d3 from 'd3';
import './index.css'

import ValidSvg from './icons/valid.svg';
import NotValidSvg from './icons/not_valid.svg';

interface Props {
  data: ExtendedData[]
  initialPerc: number;
}

const Validations: React.FC<Props> = ({ data, initialPerc }) => {
  const ref = useRef<any>();
  useEffect(() => {
    if (data && data.length) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  
  const angleToRotate = (startAngle: number, endAngle: number): number => {
      return Math.round(((startAngle + endAngle) / 2) / Math.PI * 180) + initialPerc * 3.6
  }

  const buildRotateStringWrap = (rotate: number): string => `rotate(${rotate} 12 136)`
  const buildRotateStringImage = (rotate: number): string => {
    const deg: string = rotate > 0 ? `-${rotate}` : Math.abs(rotate).toString()
    return `rotate(${deg} 12, 14)`
  }

  const getImageSvg = (status: boolean | null): string | null => {
    if (status === null) return null

    return status ? ValidSvg : NotValidSvg
  }

  const draw = () => {
    const svg = d3.select(ref.current);
    const pie = d3.pie<ExtendedData>().sort(null).value(function (d: ExtendedData) { return d.value; });
    
    svg
      .selectAll('g.image')
      .data(pie(data))
      .join(
        enter => {
          const group = enter
            .append('svg:g')
            .attr('class', 'image')
            .attr('transform', 'translate(0, 0)');

          const subGroup = group
            .append('svg:g')
            .attr('class', 'image-wrap')
            .attr('transform', d => {
              const rotate = angleToRotate(d.startAngle, d.endAngle);
              return buildRotateStringWrap(rotate);
            });
        
          subGroup
            .append('svg:image')
            .attr('class', 'image')
            .attr('width', '24px')
            .attr('height', '24px')
            .attr('xlink:href', d => getImageSvg(d.data.is_valid))
            .attr('transform', d => {
              const rotate = angleToRotate(d.startAngle, d.endAngle);
              return buildRotateStringImage(rotate);
            });

          return group;
        },
        update => {
          const subGroup = update
            .select('.image-wrap')
            .attr('transform', d => {
              const rotate = angleToRotate(d.startAngle, d.endAngle);
              return buildRotateStringWrap(rotate);
            });
          
          subGroup
            .select('image')
            .attr('xlink:href', d => getImageSvg(d.data.is_valid))
            .attr('transform', d => {
              const rotate = angleToRotate(d.startAngle, d.endAngle);
              return buildRotateStringImage(rotate);
            });

          return update;
        }
      )
  }

  return (
    <svg width={400} height={400} viewBox="0 0 400 400" className='svgvalidations'>
      <g ref={ref} className="validations" transform={`translate(190, 65)`} />
    </svg>
  );
}

export default Validations;