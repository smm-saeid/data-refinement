import React, { useMemo, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { sidebarMenu, type MenuItem } from '@/menu';
import { useNavigate, useLocation } from 'react-router';
import jalali from '@/lib/jalali';

function filterMenusByAccess(
  menus: MenuItem[],
  allowedSlugs: string[]
): MenuItem[] {
  return menus
    .map(menu => {
      const filteredChildren = menu.children
        ? filterMenusByAccess(menu.children, allowedSlugs)
        : undefined;

      const hasAccessToThisMenu = true;

      if (
        hasAccessToThisMenu ||
        (filteredChildren && filteredChildren.length > 0)
      ) {
        return { ...menu, children: filteredChildren };
      }

      return null;
    })
    .filter(Boolean) as MenuItem[];
}

export default function Sidebar({ drawerWidth }: { drawerWidth: number }) {
  const allowedMenus = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('menus') || '[]');
    } catch {
      return [];
    }
  }, []);

  const filteredMenu = useMemo(() => {
    return filterMenusByAccess(sidebarMenu, allowedMenus);
  }, [allowedMenus]);
  const now = new Date();
  const shamsi = jalali.format(now);

  return (
    <Drawer
      variant="permanent"
      sx={{
        position: 'relative',
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflow: 'auto',
          overflowY: 'scroll', // Force scrollbar to always be visible
        },
      }}
    >
      <Toolbar />

      <List
        component="nav"
        sx={{
          paddingX: '2px',
          marginLeft: '4px',
          marginY: '10px',
          border: '1px solid #d1d1d1',
          borderRadius: '10px',
        }}
      >
        {filteredMenu.map((item, index) => (
          <SidebarItem key={'menuItem' + index} item={item} level={0} />
        ))}
      </List>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '15px',
          position: 'absolute',
          bottom: '10px',
          left: '0',
          right: '0',
        }}
      >
        <Typography>
          ورژن:
          <span> 4.2</span>
        </Typography>
        <Typography>
          تاریخ:
          <span> {shamsi}</span>
        </Typography>
      </Box>
    </Drawer>
  );
}

function SidebarItem({ item, level }: { item: MenuItem; level: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (
      item.children?.some(child => {
        if (location.pathname === (child.path ?? '')) return true;
        return child.children?.some(
          child2 => location.pathname === (child2.path ?? '')
        );
      })
    ) {
      setOpen(true);
    }
  }, [location.pathname]);

  const handleClick = () => {
    if (item.children) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 2 + level * 2,
          bgcolor:
            location.pathname === item.path ? 'action.selected' : 'transparent',
        }}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
        )}
        <ListItemText primary={item.title} />
        {item.children ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>

      {item.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              padding: '4px',
              border: '1px solid #d1d1d1',
              borderRadius: '10px',
            }}
          >
            {item.children.map((child, index) => (
              <SidebarItem
                key={'menuItemChild' + index}
                item={child}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
