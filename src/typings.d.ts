declare module '*.svg'{
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<
        SVGSVGElement
    > & { title?: string }>;
}

declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.less';

declare module 'mqtt/dist/mqtt'{
    import mqtt from 'mqtt';
    export default mqtt;
}
