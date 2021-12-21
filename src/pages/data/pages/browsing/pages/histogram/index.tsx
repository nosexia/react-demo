import React, { FC, useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
type ChartData = {
    x: string,
    y: string,
    category?: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {

    var config: any = {
        data: props.data || [],
        theme:{
            background: '#003857'
          },
        xField: 'x',
        yField: 'y',
        // seriesField: 'category',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: { alias: '类别' },
            sales: { alias: '销售额' },
        },
    };

    if(props.data && props.data[0] && props.data[0].hasOwnProperty('category')){
        config.seriesField = 'category'
      }
    return <Column onReady={(plot) => {
        props.callback && props?.callback?.(plot)
        if (ref) {
            ref.current = plot;
        }
    }} {...config} />;
})

export default Chart;