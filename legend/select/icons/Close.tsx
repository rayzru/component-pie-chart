import * as React from 'react';

const SvgClose = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="1em" height="1em" viewBox="0 0 10 10" fill="none" {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.01 1.01a.643.643 0 000 .909L4.09 5 1.01 8.081a.643.643 0 00.909.91L5 5.908 8.081 8.99a.643.643 0 10.91-.909l-3.082-3.08L8.99 1.918a.643.643 0 00-.909-.91L5 4.092 1.919 1.01a.643.643 0 00-.91 0z"
            fill="#020202"
        />
    </svg>
);

export default SvgClose;
