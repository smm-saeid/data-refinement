
import { useState, useCallback } from 'react';

import type {
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';

import {
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import axios from 'axios';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import usermanagementApi from './apis';
import UserModal from './UserModal';

import type {
  User,
  UsersResponse,
} from './types';

const API_URL = 'https://dummyjson.com/users';

export default function UserManagement() {
  // --------------------------------------------------
  // Users
  // --------------------------------------------------

  const [users, setUsers] = useState<User[]>([]);

  const [total, setTotal] = useState(0);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const [searchTerm, setSearchTerm] =
    useState('');

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  // --------------------------------------------------
  // Loading / Error
  // --------------------------------------------------

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // --------------------------------------------------
  // Modal
  // --------------------------------------------------

  const [showModal, setShowModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  // --------------------------------------------------
  // Fetch Users
  // --------------------------------------------------

  const fetchUsers = useCallback(
    async (
      page = paginationModel.page,
      pageSize = paginationModel.pageSize,
      search = searchTerm,
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const skip = page * pageSize;

        let url = API_URL;

        // Search
        if (search.trim()) {
          url = `${API_URL}/search`;
        }

        const response =
          await axios.get<UsersResponse>(
            url,
            {
              params: {
                limit: pageSize,
                skip,

                ...(search.trim() && {
                  q: search.trim(),
                }),
              },
            },
          );

        const formattedUsers =
          response.data.users.map((user) => ({
            ...user,

            fullName:
              `${user.firstName} ${user.lastName}`,

            department:
              user.company?.department ?? '-',
          }));

        setUsers(formattedUsers);

        setTotal(response.data.total);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'خطا در دریافت اطلاعات کاربران',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      paginationModel.page,
      paginationModel.pageSize,
      searchTerm,
    ],
  );

  // --------------------------------------------------
  // Open Create Modal
  // --------------------------------------------------

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Close Modal
  // --------------------------------------------------

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // --------------------------------------------------
  // Modal Success
  // --------------------------------------------------

  const handleModalSuccess = (
    savedUser: User,
  ) => {
    setUsers((prev) => {
      const exists = prev.some(
        (user) =>
          user.id === savedUser.id,
      );

      // Edit
      if (exists) {
        return prev.map((user) =>
          user.id === savedUser.id
            ? savedUser
            : user,
        );
      }

      // Create
      return [savedUser, ...prev];
    });

    // فقط در حالت Create تعداد را افزایش بده
    if (!selectedUser) {
      setTotal((prev) => prev + 1);
    }
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearchSubmit = useCallback(() => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));

    fetchUsers(
      0,
      paginationModel.pageSize,
      searchTerm,
    );
  }, [
    fetchUsers,
    paginationModel.pageSize,
    searchTerm,
  ]);

  // --------------------------------------------------
  
const handleDelete = async (user: User) => {
  try {
    setIsLoading(true);
    setError(null);

    await axios.delete(
      usermanagementApi.user.delete(user.id),
    );

    setUsers((prev) =>
      prev.filter(
        (item) => item.id !== user.id,
      ),
    );

    setTotal((prev) => prev - 1);
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        err?.message ||
        'خطا در حذف کاربر',
    );
  } finally {
    setIsLoading(false);
  }
};

  // --------------------------------------------------

  const handleClear = useCallback(() => {
    setSearchTerm('');

    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));

    fetchUsers(
      0,
      paginationModel.pageSize,
      '',
    );
  }, [
    fetchUsers,
    paginationModel.pageSize,
  ]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePaginationChange =
    useCallback(
      (model: GridPaginationModel) => {
        setPaginationModel(model);

        fetchUsers(
          model.page,
          model.pageSize,
          searchTerm,
        );
      },
      [fetchUsers, searchTerm],
    );

  // --------------------------------------------------
  // Columns
  // --------------------------------------------------

 const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'شناسه',
    width: 90,
  },

  {
    field: 'fullName',
    headerName: 'نام و نام خانوادگی',
    flex: 1,
    minWidth: 200,
  },

  {
    field: 'username',
    headerName: 'نام کاربری',
    flex: 1,
    minWidth: 160,
  },

  {
    field: 'phone',
    headerName: 'شماره تماس',
    width: 180,
  },

  {
    field: 'gender',
    headerName: 'جنسیت',
    width: 120,
  },

  {
    field: 'age',
    headerName: 'سن',
    width: 90,
  },

  {
    field: 'department',
    headerName: 'دپارتمان',
    flex: 1,
    minWidth: 160,
  },

  {
    field: 'actions',
    headerName: 'عملیات',
    width: 180,
    sortable: false,
    filterable: false,

    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            handleOpenEdit(params.row)
          }
        >
          ویرایش
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() =>
            handleDelete(params.row)
          }
        >
          حذف
        </Button>
      </Box>
    ),
  },
];
  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Box
      dir="rtl"
      sx={{
        p: 3,

        display: 'flex',

        flexDirection: 'column',

        gap: 3,
      }}
    >
      {/* -------------------------------------------- */}
      {/* Search */}
      {/* -------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          p: 2,

          display: 'flex',

          alignItems: 'center',

          gap: 2,

          border: '1px solid',

          borderColor: 'divider',

          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          placeholder="جستجوی نام، نام کاربری یا ایمیل..."
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                <SearchIcon />
              </InputAdornment>
            ),

            endAdornment: searchTerm ? (
              <InputAdornment
                position="end"
              >
                <IconButton
                  size="small"
                  onClick={handleClear}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            maxWidth: 500,

            '& .MuiOutlinedInput-root': {
              backgroundColor:
                'background.default',
            },
          }}
        />

        {/* Search Button */}

        <Button
          variant="contained"
          onClick={handleSearchSubmit}
          sx={{ whiteSpace: 'nowrap',backgroundColor:"green" }}
        >
          جستجو
        </Button>

        {/* Create Button */}

        <Button
          variant="contained"
          onClick={handleOpenCreate}
          startIcon={<PersonAddIcon />}
          disabled={isLoading}
           sx={{ whiteSpace: 'nowrap',  ml: 'auto',backgroundColor:"green" }}
        >
          ایجاد کاربر جدید
        </Button>
      </Paper>

      {/* -------------------------------------------- */}
      {/* Error */}
      {/* -------------------------------------------- */}

      {error && (
        <Paper
          sx={{
            p: 2,
            bgcolor: 'error.light',
          }}
        >
          {error}
        </Paper>
      )}

      {/* -------------------------------------------- */}
      {/* DataGrid */}
      {/* -------------------------------------------- */}

      <MatnaDataGrid
        rows={users}
        columns={columns}
        loading={isLoading}
        rowCount={total}
        paginationMode="server"
        paginationModel={
          paginationModel
        }
        onPaginationModelChange={
          handlePaginationChange
        }
      />

      {/* -------------------------------------------- */}
      {/* User Modal */}
      {/* -------------------------------------------- */}

      <UserModal
        open={showModal}
        user={selectedUser}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </Box>
  );
}

