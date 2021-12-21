import React, { FC } from 'react';
import { Bar } from '@ant-design/charts';
import chartPage from '../../components/chart-page'
type ChartData = {
  x: string,
  y: string,
  category?: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {
      var config:any = {
        data: props.data || [],
        theme:{
          background: '#003857'
        },
        isGroup: true,
        xField: 'x',
        yField: 'y',
        // seriesField: 'category',
        marginRatio: 0,
        label: {
          position: 'middle',
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' },
          ],
        },
      };

      if(props.data && props.data[0] && props.data[0].hasOwnProperty('category')){
        config.seriesField = 'category'
      }
      return <Bar onReady={(plot) => {
        props.callback && props?.callback?.(plot)
        if (ref) {
            ref.current = plot;
        }
      }} {...config} />;
  })

export default Chart;