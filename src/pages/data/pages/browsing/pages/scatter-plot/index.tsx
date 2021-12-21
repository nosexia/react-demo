import React, { FC } from 'react';
import { Scatter } from '@ant-design/charts';
type ChartData = {
  x: string,
  y: string,
  category?: string,
}
const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {

  var config: any = {
    appendPadding: 10,
    data: props?.data || [],
    theme: {
      background: '#003857'
    },
    xField: 'x',
    yField: 'y',
    shape: 'circle',
    // colorField: 'category',
    size: 4,

  };
  if (props.data && props.data[0] && props.data[0].hasOwnProperty('category')) {
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