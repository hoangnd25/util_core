import React from 'react';
import Router from 'next/router';
import { Text, View, Select, foundations, Theme } from '@go1d/go1d';
import Link from '@src/components/common/Link';
import { getBaseUrl } from '@src/config';

export interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  logo?: string;
  href: string;
  isApiomLink: boolean;
  isVisible: boolean;
  module?: string;
}

export interface WithSideNavProps {
  title?: React.ReactNode;
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
  };

  renderMobileMenus = () => {
    const { active, menu = [] } = this.props;
    return (
      <Select
        onChange={this.onChangeMenu}
        options={menu
          .filter(item => item.isVisible)
          .map(item => {
            return {
              value: item.id,
              label: item.title,
            };
          })}
        defaultValue={active}
        width="100%"
      />
    );
  };

  renderDesktopMenus = () => {
    const { active, menu = [] } = this.props;
    console.log(menu);
    return menu
      .filter(item => item.isVisible)
      .map(item => {
        const isActive = item.id === active;
        return (
          <Theme.Consumer key={`menu-${item.id}`}>
            {({ colors }) => (
              <View data-testid={item.id} width={['0', 230, 230]}>
                <Link {...item}>
                  <View
                    marginY={2}
                    paddingY={3}
                    borderColor={isActive ? 'accent' : 'transparent'}
                    borderLeft={3}
                    paddingLeft={4}
                    backgroundColor="L400"
                    css={{
                      '&:hover': {
                        borderLeft: '3px solid',
                        borderColor: colors.accent,
                      },
                    }}
                  >
                    <Text color={isActive ? 'accent' : foundations.colors.default} fontWeight="semibold" fontSize={2}>
                      {item.title}
                    </Text>
                    <Text color={foundations.colors.subtle} fontSize={1} fontWeight="normal">
                      {item.subtitle}
                    </Text>
                  </View>
                </Link>
              </View>
            )}
          </Theme.Consumer>
        );
      });
  };

  render() {
    return (
      <View marginBottom={5} marginRight={[0, 6, 6]}>
        <View display={['flex', 'none', 'none']}>{this.renderMobileMenus()}</View>

        <View display={['none', 'flex', 'block']}>{this.renderDesktopMenus()}</View>
      </View>
    );
  }
}

export default LayoutWithSideNav;
