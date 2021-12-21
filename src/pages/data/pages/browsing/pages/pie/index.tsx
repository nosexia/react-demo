import React, { FC } from 'react';
import { Pie } from '@ant-design/charts';
import chartPage from '../../components/chart-page'
type ChartData = {
  x: string,
  y: string,
  category?: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {

  var config = {
    appendPadding: 10,
    data: props?.data || [],
    theme:{
      background: '#003857'
    },
    angleField: 'y',
    colorField: 'x',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };
  return <Pie onReady={(plot) => {
    props.callback && props?.callback?.(plot)
    if (ref) {
      ref.current = plot;
    }
  }} {...config} />;
})

export default Chart;