import React from 'react';
import { Layout } from 'antd';
import styles from './Sider.less';
import logo from '../../assets/logo_eng.png';
import Menus from '../menu/Menus';

const { Sider } = Layout;

function SiderMenu({ siderFold, theme, selectedKeys, handleMenuSelect }) {
  const menusProp = {
    theme,
    selectedKeys,
    handleMenuSelect,
  };
  return (
    <Sider trigger={null} collapsible collapsed={siderFold} theme={theme ? 'light' : 'dark'}>
      {/* logo */}
      <div className={styles.logo_container}>
        <img src={logo} className={styles.logo} alt="logo" />
      </div>
      <Menus {...menusProp} />
    </Sider>
  );
}
export default SiderMenu;
