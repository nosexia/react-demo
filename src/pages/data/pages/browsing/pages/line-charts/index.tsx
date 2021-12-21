import React, { FC } from 'react';
import { Line } from '@ant-design/charts';
type ChartData = {
  x: string,
  y: string,
  category: string,
}

const Chart: FC<{ data: ChartData[], [key: string]: any }> = React.forwardRef((props, ref: any) => {
      var COLOR_PLATE_10 = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3',
      ];

      var config:any = {
        data: props.data || [],
        theme:{
          background: '#003857'
        },
        xField: 'x',
        yField: 'y',
        // seriesField: 'category',
        yAxis: {
          label: {
            formatter: function formatter(v:any) {
              return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                return ''.concat(s, ',');
              });
            },
          },
        },
        color: COLOR_PLATE_10,
        point: {
          shape: function shape(_ref:any) {
            var category = _ref.category;
            // return category === 'Gas fuel' ? 'square' : 'circle';
            return 'circle';
          },
          style: function style(_ref2:any) {
            var year = _ref2.year;
            return { r: Number(year) % 4 ? 0 : 3 };
          },
        },
      };

      if(props.data && props.data[0] && props.data[0].hasOwnProperty('category')){
        config.seriesField = 'category'
      }

      return <Line onReady={(plot) => {
        props.callback && props?.callback(plot)
        if (ref) {
          ref.current = plot;
        }
   
      }} {...config} />;
})

export default Chart;