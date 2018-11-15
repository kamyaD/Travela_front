import React, { Fragment } from 'react';
import { PieChart, Pie } from 'recharts';
import PropTypes from 'prop-types';

export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (radius + 10) * cos;
  const sy = cy + (outerRadius - 10) * sin;
  const mx = cx + (outerRadius + 5) * cos;
  const my = cy + (outerRadius + 5) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 2;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#4F4F4F" fill="none" strokeDasharray="5,1" />
      <circle cx={ex} cy={ey} r={2} fill="#4F4F4F" stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 4} y={ey} textAnchor={textAnchor} fill="#4F4F4F" className="label">
        {`${(percent * 100).toFixed(2)}% [${name}]`}
      </text>
    </g>
  );
};

const PieChartAnalytics = ({data}) => (
  <Fragment>
    {(data.length > 0 && data[0].name !== '') ? (
      <PieChart width={800} height={400}>
        <Pie
          isAnimationActive={false}
          data={data} cx={145} cy={75}
          outerRadius={50} fill="#8884d8"
          label={renderCustomizedLabel}
          labelLine={false}
          dataKey="value"
        />
      </PieChart>
    ) : (
      <div className="chart-data">
        <p className="no-chart">No data to display</p>
      </div>
    )}
  </Fragment>
);

renderCustomizedLabel.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  percent: PropTypes.number,
  name: PropTypes.string
};

renderCustomizedLabel.defaultProps = {
  cx: 34,
  cy: 34,
  midAngle: 8,
  percent: 0.0,
  name: 'test',
  innerRadius: 13,
  outerRadius: 23,
};

PieChartAnalytics.propTypes = {
  data: PropTypes.array,
};

PieChartAnalytics.defaultProps = {
  data: []
};

export default  PieChartAnalytics;
