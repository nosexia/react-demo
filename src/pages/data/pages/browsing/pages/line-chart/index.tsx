import React, { FC, forwardRef } from 'react';
import { Line } from '@ant-design/charts';
type ChartData = {
  x: string,
  y: string,
  category: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = forwardRef((props, ref: any) => {

  const config = {
    data: props.data || [],
    theme:{
      background: '#003857'
    },
    xField: 'x',
    yField: 'y',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: { showMarkers: false },
    state: {
      inactive: {
        style: {
          lineWidth: 2,
          shadowBlur: 4,
          stroke: '#00FF00',
          fill: '#00FF00',
        },
      },
    },
    interactions: [{ type: 'marker-active' }],
  };
  return <Line onReady={(plot) => {
    props.callback && props?.callback(plot)
    if (ref) {
      ref.current = plot;
    }
  }} {...config} />;
})

export default Chart;