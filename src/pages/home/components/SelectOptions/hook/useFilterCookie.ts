import { useSetState } from 'ahooks';
import { useState } from 'react';
import { object } from 'yup';

export type FilterCookieType =
  | 'Options'
  | 'FilterStar'
  | 'Deliver'
  | 'Budget'
  | 'SortBy';

const COOKIE_ROOT = 'filterCookie';

export const useFilterCookie = () => {
  const setFilterCookie = (type: FilterCookieType, values: object) => {
    const dataStr = JSON.stringify(values);
    localStorage.setItem(COOKIE_ROOT + type, dataStr);
  };

  const getFilterCookie = (type: FilterCookieType) => {
    const dataStr = localStorage.getItem(COOKIE_ROOT + type) || '{}';

    return JSON.parse(dataStr) as object;
  };

  const resetFilterCookie = () => {
    localStorage.removeItem(COOKIE_ROOT + 'Options');
    localStorage.removeItem(COOKIE_ROOT + 'FilterStar');
    localStorage.removeItem(COOKIE_ROOT + 'Deliver');
    localStorage.removeItem(COOKIE_ROOT + 'Budget');
    localStorage.removeItem(COOKIE_ROOT + 'SortBy');
  };

  return { setFilterCookie, getFilterCookie, resetFilterCookie };
};
