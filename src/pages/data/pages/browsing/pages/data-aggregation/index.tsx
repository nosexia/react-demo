import React, { FC } from 'react';
import { Scatter } from '@ant-design/charts';
type ChartData = {
    x: string,
    y: string,
    category?: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {

    var config:any = {
        appendPadding: 30,
        data: props?.data || [],
        theme:{
            background: '#003857'
          },
        xField: 'x',
        yField: 'y',
        // colorField: 'category',
        color: ['#ffd500', '#82cab2', '#193442', '#d18768', '#7e827a'],
        size: 5,
        shape: 'circle',
        pointStyle: {
            fillOpacity: 0.8,
            stroke: '#bbb',
        },
        quadrant: {
            xBaseline: 0,
            yBaseline: 0,
            lineStyle: {
                lineDash: [4, 2],
                lineWidth: 2,
            },
            regionStyle: [
                {
                    fill: '#5bd8a6',
                    fillOpacity: 0.1,
                },
                {
                    fill: '#667796',
                    fillOpacity: 0.1,
                },
                { fill: '#fff' },
                {
                    fill: '#f7664e',
                    fillOpacity: 0.1,
                },
            ],
            // labels: [
            //     { content: '第一象限' },
            //     { content: '第二象限' },
            //     { content: '第三象限' },
            //     { content: '第四象限' },
            // ],
        },
    };

    if(props.data && props.data[0] && props.data[0].hasOwnProperty('category')){
        config.colorField = 'category'
      }
    return <Scatter onReady={(plot) => {
        props.callback && props?.callback?.(plot)
        if (ref) {
            ref.current = plot;
        }
    }} {...config} />;
})

export default Chart;