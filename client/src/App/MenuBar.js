import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

class MenuBar extends Component {
  state = {}
  handleItemClick = (e, { name }) => {
    this.setState({ 
      activeItem: name
    })
  }

  viewMenu = (e) => {
    this.props.viewMenu(e.target.id)
  }
  
  render() {
    
    const { activeItem } = this.state
    
    return (
        <Menu size='massive' widths='7'>
          <Menu.Item
            name='home'
            id='home'
            active={activeItem === 'home'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            홈
          </Menu.Item>

          <Menu.Item
            id='price'
            name='price'
            active={activeItem === 'price'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            시세
          </Menu.Item>

          <Menu.Item
            name='chat'
            id='chat'
            active={activeItem === 'chat'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            채팅
          </Menu.Item>

          <Menu.Item
            name='board'
            id='board'
            active={activeItem === 'board'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            게시판
          </Menu.Item>

          <Menu.Item
            name='item'
            id='item'
            active={activeItem === 'item'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            아이템
          </Menu.Item>

          <Menu.Item
            name='mypage'
            id='mypage'
            active={activeItem === 'mypage'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            마이페이지
          </Menu.Item>

          <Menu.Item
            name='customer'
            id='customer'
            active={activeItem === 'customer'}
            onClick={this.handleItemClick && this.viewMenu}
          >
            고객센터
          </Menu.Item>
        </Menu>
    )
  }
}

export default MenuBar