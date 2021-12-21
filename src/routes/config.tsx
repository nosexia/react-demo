import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import PrivateRoute from './pravateRoute';
import { useIntl } from 'react-intl';

export interface WrapperRouteProps extends RouteProps {
  /** authorization？ */
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, ...props }) => {
  //应该是消息提醒信息，后续查看解决报错问题
  // const { formatMessage } = useIntl();
  const WitchRoute = auth ? PrivateRoute : Route;
  return <WitchRoute {...props} />;
};

export default WrapperRouteComponent;
