import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomersProvider } from '../context/CustomersContext';

export const CustomersLayout: React.FC = () => {
  return (
    <CustomersProvider>
      <Outlet />
    </CustomersProvider>
  );
};
