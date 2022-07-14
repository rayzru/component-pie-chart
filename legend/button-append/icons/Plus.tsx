import * as React from 'react';

const SvgPlus = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0a1 1 0 00-1 1v6H1a1 1 0 000 2h6v6a1 1 0 102 0V9h6a1 1 0 100-2H9V1a1 1 0 00-1-1z"
            fill="#006CF0"
        />
    </svg>
);

export default SvgPlus;
