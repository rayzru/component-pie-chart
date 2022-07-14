import React from 'react';
import './index.css';

const Title: React.FC = ({ children }) => {
    return (<h1 className='title'>{children}</h1>);
}

export default Title;