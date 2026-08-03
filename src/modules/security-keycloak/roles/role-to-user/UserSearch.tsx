import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  Autocomplete,
  Alert,
} from '@mui/material';
import { useKeycloakApiPost } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import keycloakApis from '../../apis';
import type { Menu, UserWithRoles } from '../../types';

interface response {
  responseList: Menu[];
}

interface UserSearchProps {
  onUserSelect: (userWithRoles: UserWithRoles) => void;
  onUsersLoad: (users: UserWithRoles[]) => void;
  refreshKey?: number;
}

interface SearchUsersVariables {
  paginationModel: {
    offset: number;
    pageSize: number;
  };
  searchModel: {
    searchTerm: string;
  };
}

// Define a safe user type for our helper functions
interface SafeUser {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  attributes?: {
    [key: string]: string[];
  };
}

// Safe access helper functions
const safeGetUser = (userWithRoles: UserWithRoles | null): SafeUser => {
  return userWithRoles?.user || {};
};

const safeGetAttributes = (user: SafeUser) => {
  return user?.attributes || {};
};

const safeGetAttribute = (attributes: any, key: string) => {
  return attributes?.[key]?.[0] || '';
};

// Helper function to safely get user display name
const getUserDisplayName = (user: SafeUser): string => {
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const username = user?.username || 'بدون نام کاربری';
  
  if (firstName || lastName) {
    return `${firstName} ${lastName} (${username})`;
  }
  return `(${username})`;
};

export function UserSearch({
  onUserSelect,
  onUsersLoad,
  refreshKey,
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserWithRoles[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const { showNotification } = useNotification();

  const searchMutation = useKeycloakApiPost<
    UserWithRoles[],
    SearchUsersVariables
  >(keycloakApis.user.search, {
    onError: error => {
      const errorMessage =
        error?.response?.data?.message || 'خطا در جستجوی کاربر';
      showNotification(errorMessage, 'error');
      console.error('Error searching users:', error);
    },
  });

  useEffect(() => {
    if (refreshKey && refreshKey > 0 && selectedUser) {
      console.log(
        '🔄 UserSearch: Refreshing data for user:',
        safeGetUser(selectedUser)?.username
      );
      
      const user = safeGetUser(selectedUser);
      handleSearch(user?.username || user?.firstName || '');
    }
  }, [refreshKey]);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setLastSearchTerm('');
      return;
    }

    setLoading(true);
    setLastSearchTerm(value);

    try {
      const response = await searchMutation.mutateAsync({
        paginationModel: {
          offset: 0,
          pageSize: 10,
        },
        searchModel: {
          searchTerm: value,
        },
      });

      console.log('🔍 UserSearch API response:', response);

      let usersWithRoles: UserWithRoles[] = [];

      // Safe data extraction with null checks
      if (Array.isArray(response)) {
        usersWithRoles = response;
      } else if (Array.isArray(response?.data)) {
        usersWithRoles = response.data;
      } else if (response?.responseList?.[0]?.data?.[0]?.users) {
        usersWithRoles = response.responseList[0].data[0].users;
      } else if (
        response?.responseList?.[0]?.data &&
        Array.isArray(response.responseList[0].data)
      ) {
        usersWithRoles = response.responseList[0].data;
      } else if (response?.data?.responseList?.[0]?.data?.[0]?.users) {
        usersWithRoles = response.data.responseList[0].data[0].users;
      }

      console.log('✅ UserSearch: Extracted users:', usersWithRoles);

      // Validate and filter users to ensure they have required properties
      const validUsers = usersWithRoles.filter(user => 
        user?.user?.id && user?.user?.username
      );

      setSearchResults(validUsers);
      onUsersLoad(validUsers);

      // Handle no results
      if (validUsers.length === 0) {
        showNotification('هیچ کاربری با مشخصات وارد شده یافت نشد', 'info');
      } else {
        showNotification(`${validUsers.length} کاربر یافت شد`, 'success');
      }

      // Update selected user if it exists in new results
      if (validUsers.length > 0 && selectedUser) {
        const currentUserId = safeGetUser(selectedUser)?.id;
        const updatedUser = validUsers.find(
          user => safeGetUser(user)?.id === currentUserId
        );
        if (updatedUser) {
          setSelectedUser(updatedUser);
          onUserSelect(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      onUsersLoad([]);
      showNotification('خطا در دریافت اطلاعات کاربران', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userWithRoles: UserWithRoles | null) => {
    console.log('✅ UserSearch: User selected:', userWithRoles);
    setSelectedUser(userWithRoles);
    if (userWithRoles) {
      onUserSelect(userWithRoles);
      const user = safeGetUser(userWithRoles);
      showNotification(
        `کاربر "${user?.firstName || ''} ${user?.lastName || ''}" انتخاب شد`,
        'success'
      );
    } else {
      setSearchResults([]);
      onUsersLoad([]);
    }
  };

  const handleInputChange = (newValue: string) => {
    setSearchTerm(newValue);

    if (newValue.trim() && newValue.trim() !== lastSearchTerm) {
      const timeoutId = setTimeout(() => {
        handleSearch(newValue);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedUser(null);
    setLastSearchTerm('');
    onUsersLoad([]);
    showNotification('جستجو پاک شد', 'info');
  };

  const getOptionLabel = (userWithRoles: UserWithRoles) => {
    const user = safeGetUser(userWithRoles);
    const attributes = safeGetAttributes(user);
    const personnelCode = safeGetAttribute(attributes, 'personnel_code');
    const unitCode = safeGetAttribute(attributes, 'unit_code');

    let label = getUserDisplayName(user);

    if (personnelCode) {
      label += ` - کد پرسنلی: ${personnelCode}`;
    }

    if (unitCode) {
      label += ` - کد یگان: ${unitCode}`;
    }

    return label;
  };

  const renderOption = (props: any, userWithRoles: UserWithRoles) => {
    const user = safeGetUser(userWithRoles);
    const attributes = safeGetAttributes(user);
    const personnelCode = safeGetAttribute(attributes, 'personnel_code');
    const unitCode = safeGetAttribute(attributes, 'unit_code');

    return (
      <li {...props}>
        <Box sx={{ width: '100%', py: 0.5 }}>
          <Typography variant="body2" fontWeight="bold">
            {user?.firstName || 'نام'} {user?.lastName || 'نام خانوادگی'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              نام کاربری: {user?.username || 'ندارد'}
            </Typography>
            {personnelCode && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                کد پرسنلی: {personnelCode}
              </Typography>
            )}
          </Box>
          {unitCode && (
            <Typography variant="caption" color="text.secondary">
              کد یگان: {unitCode}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="primary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            تعداد نقش‌ها: {userWithRoles?.roles?.length || 0}
          </Typography>
        </Box>
      </li>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        اتصال نقش به کاربر
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        جستجوی کاربر
      </Typography>

      {searchMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در جستجوی کاربر
        </Alert>
      )}

      <Box display="flex" gap={2} alignItems="flex-start" flexWrap="wrap">
        <Autocomplete
          options={searchResults}
          getOptionLabel={getOptionLabel}
          value={selectedUser}
          onChange={(_, newValue) => handleUserSelect(newValue)}
          onInputChange={(_, newValue) => handleInputChange(newValue)}
          loading={loading || searchMutation.isPending}
          renderInput={params => (
            <TextField
              {...params}
              label="جستجوی کاربر بر اساس کد ملی یا نام"
              placeholder="متن جستجو را وارد کنید..."
              size="small"
              sx={{ minWidth: 400 }}
              helperText={
                searchResults.length > 0
                  ? `${searchResults.length} کاربر یافت شد`
                  : 'برای جستجو متن مورد نظر را وارد کنید'
              }
            />
          )}
          renderOption={renderOption}
          filterOptions={x => x}
          noOptionsText={
            searchTerm.trim() && !loading
              ? 'کاربری یافت نشد'
              : 'برای جستجو متن مورد نظر را وارد کنید'
          }
        />

        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={loading || searchMutation.isPending}
          sx={{ minWidth: 100 }}
        >
          پاک کردن
        </Button>
      </Box>

      {/* Selected User Info */}
      {selectedUser && (
        <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
          <Typography variant="subtitle2" fontWeight="bold" color="success.dark">
            کاربر انتخاب شده:
          </Typography>
          <Typography variant="body2">
            {safeGetUser(selectedUser)?.firstName || ''} {safeGetUser(selectedUser)?.lastName || ''} - 
            نام کاربری: {safeGetUser(selectedUser)?.username || ''} - 
            تعداد نقش‌ها: {selectedUser?.roles?.length || 0}
          </Typography>
        </Box>
      )}

      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <Box mt={2} p={1} bgcolor="grey.100" borderRadius={1}>
          <Typography variant="caption" color="text.secondary">
            <strong>دیباگ:</strong>
            نتایج: {searchResults.length} | انتخاب شده:{' '}
            {selectedUser ? safeGetUser(selectedUser)?.id : 'none'} | کلید رفرش:{' '}
            {refreshKey} | آخرین جستجو: {lastSearchTerm || 'none'}
          </Typography>
        </Box>
      )} */}
    </Paper>
  );
}