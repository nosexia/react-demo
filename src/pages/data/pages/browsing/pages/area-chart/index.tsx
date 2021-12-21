import React, { FC } from 'react';
import chartPage from '../../components/chart-page';
import { Area } from '@ant-design/charts';
type ChartData = {
  x: string,
  y: string,
  category: string,
}
const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {

  var config: any = {
    data: props.data || [],
    theme:{
      background: '#003857'
    },
    xField: 'x',
    yField: 'y',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: function areaStyle() {
      return { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' };
    },
  };

  if (props.data && props.data[0] && props.data[0].hasOwnProperty('category')) {
    config.seriesField = 'category'
  }
  return <Area onReady={(plot) => {
    props.callback && props?.callback?.(plot)
    if (ref) {
      ref.current = plot;
    }
  }} {...config} />;
})

export default Chart;