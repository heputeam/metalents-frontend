import React from 'react';
import { Tab, Tabs as MuiTabs } from '@mui/material';
import styles from './index.less';
export interface ITabPanelProps {
  children?: React.ReactNode;
  tabValue: number | string;
  panelValue: number | string;
}

export interface ITabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (event: React.SyntheticEvent<Element, Event>, value: any) => void;
}

const Tabs: React.FC<ITabsProps> = ({ tabs, value, onChange }) => {
  return (
    <MuiTabs
      classes={{
        root: styles['tabs'],
        flexContainer: styles['tabs-flex-container'],
        indicator: styles['tab-indicator'],
      }}
      value={value}
      onChange={onChange}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          disableTouchRipple
          label={tab.label}
          value={tab.value}
          classes={{ root: styles['tab'], selected: styles['selected-tab'] }}
        />
      ))}
    </MuiTabs>
  );
};

const TabPanel: React.FC<ITabPanelProps> = ({
  children,
  tabValue,
  panelValue,
}) => {
  return (
    <div role="tabpanel" hidden={tabValue !== panelValue}>
      {tabValue === panelValue && children}
    </div>
  );
};

export { Tabs, TabPanel };
