import React from 'react';
import { Text, View, Select, foundations } from '@go1d/go1d';
import { MenuItem } from '@src/types/menu';
import CustomLink from '@src/components/common/Link';

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
          const isActive = menu.id === active;
          return menu.isVisible && (
            <View
              module={menu.module}
              key={`menu-${menu.id}`}
              isApiomLink={menu.isApiomLink}
              href={!isActive ? menu.href : null}
              element={!isActive && menu.href ? CustomLink : View}
            >
              <View
                marginY={2}
                paddingY={3}
                borderColor="accent"
                borderLeft={isActive ? 3 : 0}
                paddingLeft={isActive ? 3 : 0}
              >
                <Text
                  color={isActive ? 'default' : 'subtle'}
                  fontWeight="semibold"
                  css={{
                    ":hover": {
                      color: foundations.colors.default,
                    }
                  }}
                  >{menu.title}</Text>
              </View>
            </View>
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
