import React from 'react';
import { Text, View } from '@go1d/go1d';
import { MenuItem } from '../../types/menu';
import CustomLink from '../Link';

interface SidebarMenusProps {
  menus: MenuItem[];
  active?: string;
}

class SidebarMenus extends React.PureComponent<SidebarMenusProps> {
  public render() {
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
                <Text color={menu.id === active ? 'default' : 'subtle'} fontWeight="semibold">{menu.title}</Text>
              </View>
            </CustomLink>
          );
        })}
      </>
    );
  }
}

export default SidebarMenus;
