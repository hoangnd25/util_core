import React from 'react';
import { Text, View, Select, foundations } from '@go1d/go1d';
import { MenuItem } from '../../types/menu';
import CustomLink from '../Link';

interface SidebarMenusProps {
  menus: MenuItem[];
  active?: string;
}

class SidebarMenus extends React.PureComponent<SidebarMenusProps> {
  onChangeMenu({ target }) {
    const { menus = [] } = this.props;
    const { href, isApiomLink } = menus.find(menu => menu.id === target.value);

    if (typeof window !== 'undefined') {
      if (isApiomLink || (typeof href === 'string' && href.indexOf('http') === 0)) {
        window.location.assign(`${isApiomLink ? '/p/#/' : ''}${href}`);
      } else {
        window.location.assign(href);
      }
    }
  }

  renderMobileMenus() {
    const { active, menus = [] } = this.props;
    const selectOptions = menus.map(menu => {
      return {
        value: menu.id,
        label: menu.title,
      }
    });

    return (
      <>
        <Select
          onChange={this.onChangeMenu.bind(this)}
          options={selectOptions}
          defaultValue={active}
          width="100%"
        />
      </>
    );
  }

  renderDesktopMenus() {
    const { active, menus = [] } = this.props;

    return (
      <>
        {menus.map(menu => {
          return menu.isVisible && (
            <CustomLink
              key={`menu-${menu.id}`}
              href={menu.href}
              isApiomLink={menu.isApiomLink}
            >
              <View
                marginY={2}
                paddingY={3}
                borderColor="accent"
                borderLeft={menu.id === active ? 3 : 0}
                paddingLeft={menu.id === active ? 3 : 0}
              >
                <Text
                  color={menu.id === active ? 'default' : 'subtle'}
                  fontWeight="semibold"
                  css={{
                    ":hover": {
                      color: foundations.colors.default,
                    }
                  }}
                  >{menu.title}</Text>
              </View>
            </CustomLink>
          );
        })}
      </>
    );
  }

  render() {
    return (
      <>
        <View
          css={{
            [foundations.breakpoints.md]: {
              display: "none",
            }
          }}
        >{this.renderMobileMenus()}</View>

        <View
          display="none"
          css={{
            [foundations.breakpoints.md]: {
              display: "block",
            }
          }}
        >{this.renderDesktopMenus()}</View>
      </>
    );
  }
}

export default SidebarMenus;
