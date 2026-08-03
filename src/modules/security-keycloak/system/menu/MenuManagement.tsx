import { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import { MenuForm } from './MenuForm';
import { MenuTable } from './MenuTable';
import type { Menu, MenuQueryParams } from '../../types';
import { NotificationProvider, useNotification } from '../../NotificationContext';


interface MenuListResponse {
  responseList: Menu[];
 
}


export function MenuManagement() {
  return (
    <NotificationProvider>
      <MenuManagementContent />
    </NotificationProvider>
  );
}

function MenuManagementContent() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
  });


  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useKeycloakApiQuery<MenuListResponse, MenuQueryParams>({
    url: keycloakApis.menu.list,
  });

 
  const menus = response?.data?.responseList || [];


  console.log('Menu List Response:', response);
  console.log('Extracted Menus:', menus);
  console.log('Total menus count:', menus.length);

  if (menus.length > 0) {
    // console.log('=== MENU LIST DETAILS ===');
    menus.forEach((menu, index) => {
      // console.log(`Menu ${index + 1}:`, {
      //   id: menu.id,
      //   name: menu.name,
      //   englishTitle: menu.englishTitle,
      //   parentId: menu.parentId,
      //   icon: menu.icon,
      //   link: menu.link,
      //   sensitive: menu.sensitive,
      //   disabled: menu.disabled,
      // });
    });
    // console.log('=== END MENU LIST ===');
  }


  const enhancedMenus = menus.map(menu => ({
    ...menu,
    parentName:
      menus.find(parent => parent.id === menu.parentId)?.name || 'بدون والد',
  }));


  const parentMenus = enhancedMenus.filter(
    menu => !editingMenu || menu.id !== editingMenu.id
  );

  const handleCreate = () => {
    setEditingMenu(null);
    setFormModalOpen(true);
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormModalOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setEditingMenu(null);
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
    // You might want to refetch with new pagination here
    // refetch();
  };

  if (error) {
    console.error('Error fetching menus:', error);
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
        <Button onClick={() => refetch()} variant="outlined">
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            مدیریت منوها ({menus.length} منو)
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleCreate}
            sx={{
              height: '48px',
              fontSize: '16px',
              minWidth: '150px',
            }}
          >
            ایجاد منو جدید
          </Button>
        </Box>

 
        {isLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            در حال دریافت اطلاعات منوها...
          </Alert>
        )}

    
        {!isLoading && menus.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            هیچ منویی یافت نشد
          </Alert>
        )}

        <MenuTable
          menus={enhancedMenus}
          loading={isLoading}
          onEdit={handleEdit}
          onSuccess={handleSuccess}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          rowCount={menus.length} 
        />
      </Paper>

      <MenuForm
        open={formModalOpen}
        onClose={handleFormClose}
        menu={editingMenu}
        parentMenus={parentMenus}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
