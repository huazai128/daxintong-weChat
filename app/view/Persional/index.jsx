import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, WhiteSpace, WingBlank, NavBar, Icon } from 'antd-mobile';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './persional.scss';//是导入样式是使用的--
import Nav from 'components/Navthree';
import Data from 'components/Data';
@CSSModules(styles)
export default class extends Component {
  render(){
    return(
      <div styleName='persional'>
      <Nav path="/">个人资料</Nav>
      <Data></Data>
      </div>
    )
  }
}