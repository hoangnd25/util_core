import React from 'react';
import Router from 'next/router';
import { Text, View, Select, foundations } from '@go1d/go1d';
import CustomLink from '@src/components/common/Link';
import { getBaseUrl } from '@src/config';

export interface MenuItem {
  id: string;
  title: string;
  logo?: string;
  href: string;
  isApiomLink: boolean; 
  isVisible: boolean;
  module?: string;
}

export interface WithSideNavProps {
  title?: string;
  active?: string;
  menu: MenuItem[];
}

class LayoutWithSideNav extends React.PureComponent<WithSideNavProps, any> {
  onChangeMenu = ({ target }) => {
    const { menu = [] } = this.props;
    const { href, isApiomLink, module } = menu.find(menu => menu.id === target.value);

    if (typeof window !== 'undefined') {
      if (isApiomLink || (typeof href === 'string' && href.indexOf('http') === 0)) {
        window.location.assign(`${isApiomLink ? '/p/#/' : ''}${href}`);
      } else {
        Router.push(`${module ? getBaseUrl(module) : ''}${href}`);
      }
    }
  }

  renderMobileMenus = () => {
    const { active, menu = [] } = this.props;
    return (
      <Select
        onChange={this.onChangeMenu}
        options={menu.map(menu => {
          return {
            value: menu.id,
            label: menu.title,
          }
        })}
        defaultValue={active}
        width="100%"
      />
    );
  }

  renderDesktopMenus = () => {
    const { active, menu = [] } = this.props;
    return menu.map(menu => {
      const isActive = menu.id === active;
      return menu.isVisible && (
        <View
          data-testid={menu.id}
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
    });
  }

  render() {
    const { title } = this.props;
    return (
      <View
        marginBottom={5}
        css={{
          [foundations.breakpoints.md]: {
            marginRight: foundations.spacing[5],
            width: 220,
          },
        }}
      >
        {title && (
          <View marginBottom={3}>
            <Text element="h3" fontWeight="semibold" fontSize={3}>{title}</Text>
          </View>
        )}
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
      </View>
    );
  };
}

export default LayoutWithSideNav;
