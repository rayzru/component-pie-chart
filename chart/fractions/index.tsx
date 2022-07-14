import React from 'react';
import './index.css'

interface Props {
  step?: number
}

const Fractions: React.FC<Props> = ({ step = 0 }) => {
  return (
    <div className="fractions">
      {[...Array(step)].map((el, i) => {
        return <div className="fraction" key={i} style={{transform: `rotate(${360*i/step}deg)`}} />
      })}
    </div>
  )
}

export default Fractions;