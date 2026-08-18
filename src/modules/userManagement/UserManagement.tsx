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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import axios from 'axios';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';

import usermanagementApi from './apis';
import UserModal from './UserModal';

import type {
  User,
  UsersResponse,
} from './types';

// ==================================================
// User Status
// ==================================================

type UserStatus =
  | 'all'
  | 'active'
  | 'locked';

// ==================================================
// LocalStorage Key
// ==================================================

const LOCKED_USERS_KEY =
  'locked_users';

export default function UserManagement() {
  // ==================================================
  // Users
  // ==================================================

  const [users, setUsers] =
    useState<User[]>([]);

  const [total, setTotal] =
    useState(0);

  // ==================================================
  // Search
  // ==================================================

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [username, setUsername] =
    useState('');

  const [organization, setOrganization] =
    useState('');

  // ==================================================
  // User Status
  // ==================================================

  const [userStatus, setUserStatus] =
    useState<UserStatus>('all');

  // ==================================================
  // Pagination
  // ==================================================

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  // ==================================================
  // Loading / Error
  // ==================================================

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==================================================
  // Modal
  // ==================================================

  const [showModal, setShowModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  // ==================================================
  // Get Locked User IDs
  // ==================================================

  const getLockedUserIds =
    useCallback((): number[] => {
      try {
        const data =
          localStorage.getItem(
            LOCKED_USERS_KEY,
          );

        if (!data) {
          return [];
        }

        const parsed =
          JSON.parse(data);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    }, []);

  // ==================================================
  // Save Locked User IDs
  // ==================================================

  const saveLockedUserIds =
    useCallback(
      (ids: number[]) => {
        localStorage.setItem(
          LOCKED_USERS_KEY,
          JSON.stringify(ids),
        );
      },
      [],
    );

  // ==================================================
  // Fetch All Users
  // ==================================================

  const fetchAllUsers =
    useCallback(
      async (): Promise<User[]> => {
        const response =
          await axios.get<UsersResponse>(
            usermanagementApi.user.list,
            {
              params: {
                limit: 0,
              },
            },
          );

        // دریافت کاربران قفل شده
        const lockedUserIds =
          getLockedUserIds();

        return response.data.users.map(
          (user) => ({
            ...user,

            fullName:
              `${user.firstName} ${user.lastName}`,

            department:
              user.company?.department ??
              '-',

            // وضعیت قفل از localStorage
            isLocked:
              lockedUserIds.includes(
                user.id,
              ),
          }),
        );
      },
      [
        getLockedUserIds,
      ],
    );

  // ==================================================
  // Filter Users
  // ==================================================

  const filterUsers =
    useCallback(
      (
        allUsers: User[],
      ): User[] => {
        const firstNameSearch =
          firstName
            .trim()
            .toLowerCase();

        const lastNameSearch =
          lastName
            .trim()
            .toLowerCase();

        const usernameSearch =
          username
            .trim()
            .toLowerCase();

        const organizationSearch =
          organization
            .trim()
            .toLowerCase();

        return allUsers.filter(
          (user) => {
            // ==========================================
            // وضعیت کاربر
            // ==========================================

            const isLocked =
              user.isLocked === true;

            const statusMatch =
              userStatus === 'all' ||
              (
                userStatus === 'locked' &&
                isLocked
              ) ||
              (
                userStatus === 'active' &&
                !isLocked
              );

            // ==========================================
            // نام
            // ==========================================

            const firstNameMatch =
              !firstNameSearch ||
              user.firstName
                ?.toLowerCase()
                .includes(
                  firstNameSearch,
                );

            // ==========================================
            // نام خانوادگی
            // ==========================================

            const lastNameMatch =
              !lastNameSearch ||
              user.lastName
                ?.toLowerCase()
                .includes(
                  lastNameSearch,
                );

            // ==========================================
            // نام کاربری
            // ==========================================

            const usernameMatch =
              !usernameSearch ||
              user.username
                ?.toLowerCase()
                .includes(
                  usernameSearch,
                );

            // ==========================================
            // سازمان
            // ==========================================

            const companyName =
              user.company?.name
                ?.toLowerCase() ?? '';

            const department =
              user.company?.department
                ?.toLowerCase() ?? '';

            const organizationMatch =
              !organizationSearch ||
              companyName.includes(
                organizationSearch,
              ) ||
              department.includes(
                organizationSearch,
              );

            // ==========================================
            // نتیجه
            // ==========================================

            return (
              statusMatch &&
              firstNameMatch &&
              lastNameMatch &&
              usernameMatch &&
              organizationMatch
            );
          },
        );
      },
      [
        firstName,
        lastName,
        username,
        organization,
        userStatus,
      ],
    );

  // ==================================================
  // Refresh Table
  // ==================================================

  const refreshUsers =
    useCallback(
      async (
        page = 0,
        pageSize = paginationModel.pageSize,
      ) => {
        const allUsers =
          await fetchAllUsers();

        const filteredUsers =
          filterUsers(allUsers);

        const start =
          page * pageSize;

        const end =
          start + pageSize;

        setTotal(
          filteredUsers.length,
        );

        setUsers(
          filteredUsers.slice(
            start,
            end,
          ),
        );

        setPaginationModel({
          page,
          pageSize,
        });
      },
      [
        fetchAllUsers,
        filterUsers,
        paginationModel.pageSize,
      ],
    );

  // ==================================================
  // Search
  // ==================================================

  const handleSearchSubmit =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        await refreshUsers(
          0,
          paginationModel.pageSize,
        );
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'خطا در جستجوی کاربران',
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      refreshUsers,
      paginationModel.pageSize,
    ]);

  // ==================================================
  // Clear Search
  // ==================================================

  const handleClear =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        setFirstName('');
        setLastName('');
        setUsername('');
        setOrganization('');
        setUserStatus('all');

        const allUsers =
          await fetchAllUsers();

        setTotal(
          allUsers.length,
        );

        setUsers(
          allUsers.slice(
            0,
            paginationModel.pageSize,
          ),
        );

        setPaginationModel({
          page: 0,
          pageSize:
            paginationModel.pageSize,
        });
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'خطا در دریافت کاربران',
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      fetchAllUsers,
      paginationModel.pageSize,
    ]);

  // ==================================================
  // Pagination
  // ==================================================

  const handlePaginationChange =
    useCallback(
      async (
        model: GridPaginationModel,
      ) => {
        try {
          setIsLoading(true);
          setError(null);

          const allUsers =
            await fetchAllUsers();

          const filteredUsers =
            filterUsers(allUsers);

          const start =
            model.page *
            model.pageSize;

          const end =
            start +
            model.pageSize;

          setPaginationModel(
            model,
          );

          setTotal(
            filteredUsers.length,
          );

          setUsers(
            filteredUsers.slice(
              start,
              end,
            ),
          );
        } catch (err: any) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'خطا در دریافت کاربران',
          );
        } finally {
          setIsLoading(false);
        }
      },
      [
        fetchAllUsers,
        filterUsers,
      ],
    );

  // ==================================================
  // Open Create Modal
  // ==================================================

  const handleOpenCreate =
    () => {
      setSelectedUser(null);
      setShowModal(true);
    };

  // ==================================================
  // Open Edit Modal
  // ==================================================

  const handleOpenEdit = (
    user: User,
  ) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // ==================================================
  // Close Modal
  // ==================================================

  const handleCloseModal =
    () => {
      setShowModal(false);
      setSelectedUser(null);
    };

  // ==================================================
  // Modal Success
  // ==================================================

  const handleModalSuccess = (
    savedUser: User,
  ) => {
    const formattedUser: User = {
      ...savedUser,

      fullName:
        `${savedUser.firstName} ${savedUser.lastName}`,

      department:
        savedUser.company?.department ??
        '-',

      isLocked:
        savedUser.isLocked ??
        false,
    };

    setUsers((prev) => {
      const exists =
        prev.some(
          (user) =>
            user.id ===
            formattedUser.id,
        );

      // ویرایش
      if (exists) {
        return prev.map(
          (user) =>
            user.id ===
            formattedUser.id
              ? formattedUser
              : user,
        );
      }

      // ایجاد
      return [
        formattedUser,
        ...prev,
      ];
    });

    if (!selectedUser) {
      setTotal(
        (prev) => prev + 1,
      );
    }

    handleCloseModal();
  };

  // ==================================================
  // Delete User
  // ==================================================

  const handleDelete =
    async (
      user: User,
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        await axios.delete(
          usermanagementApi.user.delete(
            user.id,
          ),
        );

        // حذف از localStorage
        const lockedUserIds =
          getLockedUserIds();

        const updatedLockedUserIds =
          lockedUserIds.filter(
            (id) =>
              id !== user.id,
          );

        saveLockedUserIds(
          updatedLockedUserIds,
        );

        // حذف از جدول
        setUsers((prev) =>
          prev.filter(
            (item) =>
              item.id !== user.id,
          ),
        );

        setTotal(
          (prev) =>
            Math.max(
              0,
              prev - 1,
            ),
        );
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

  // ==================================================
  // Lock User
  // ==================================================

  const handleLockUser =
    async (
      user: User,
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const lockedUserIds =
          getLockedUserIds();

        // جلوگیری از ثبت تکراری
        if (
          !lockedUserIds.includes(
            user.id,
          )
        ) {
          lockedUserIds.push(
            user.id,
          );
        }

        // ذخیره در localStorage
        saveLockedUserIds(
          lockedUserIds,
        );

        // به‌روزرسانی جدول
        await refreshUsers(
          paginationModel.page,
          paginationModel.pageSize,
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'خطا در قفل کردن کاربر',
        );
      } finally {
        setIsLoading(false);
      }
    };

  // ==================================================
  // Unlock User
  // ==================================================

  const handleUnlockUser =
    async (
      user: User,
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const lockedUserIds =
          getLockedUserIds();

        // حذف کاربر از لیست قفل‌شده‌ها
        const updatedLockedUserIds =
          lockedUserIds.filter(
            (id) =>
              id !== user.id,
          );

        // ذخیره
        saveLockedUserIds(
          updatedLockedUserIds,
        );

        // به‌روزرسانی جدول
        await refreshUsers(
          paginationModel.page,
          paginationModel.pageSize,
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'خطا در باز کردن قفل کاربر',
        );
      } finally {
        setIsLoading(false);
      }
    };

  // ==================================================
  // Columns
  // ==================================================

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'نام',
      flex: 1,
      minWidth: 140,
    },

    {
      field: 'lastName',
      headerName: 'نام خانوادگی',
      flex: 1,
      minWidth: 160,
    },

    {
      field: 'username',
      headerName: 'نام کاربری',
      flex: 1,
      minWidth: 160,
    },

    {
      field: 'organization',
      headerName: 'سازمان',
      flex: 1,
      minWidth: 180,

      valueGetter: (
        _value,
        row,
      ) =>
        row.company?.name ?? '-',
    },

    // ==================================================
    // Status
    // ==================================================

    {
      field: 'status',
      headerName: 'وضعیت',
      width: 130,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',

      renderCell: (
        params,
      ) => {
        const isLocked =
          params.row.isLocked ===
          true;

        return (
          <Typography
            sx={{
              fontWeight: 600,

              color: isLocked
                ? 'error.main'
                : 'success.main',
            }}
          >
            {isLocked
              ? 'قفل شده'
              : 'فعال'}
          </Typography>
        );
      },
    },

    // ==================================================
    // Actions
    // ==================================================

    {
      field: 'actions',
      headerName: 'عملیات',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',

      renderCell: (
        params,
      ) => {
        const isLocked =
          params.row.isLocked ===
          true;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              gap: 0.5,
              width: '100%',
              height: '100%',
            }}
          >
            {/* حذف */}

            <IconButton
              color="error"
              size="small"
              onClick={() =>
                handleDelete(
                  params.row,
                )
              }
              title="حذف کاربر"
            >
              <DeleteIcon />
            </IconButton>

            {/* قفل / باز کردن */}

            <IconButton
              color={
                isLocked
                  ? 'success'
                  : 'warning'
              }
              size="small"
              onClick={() => {
                if (isLocked) {
                  handleUnlockUser(
                    params.row,
                  );
                } else {
                  handleLockUser(
                    params.row,
                  );
                }
              }}
              title={
                isLocked
                  ? 'باز کردن قفل'
                  : 'قفل کردن'
              }
            >
              {isLocked ? (
                <LockOpenIcon />
              ) : (
                <LockIcon />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // ==================================================
  // Render
  // ==================================================

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
      {/* ==================================================
          Title
          ================================================== */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'flex-start',
          gap: 1,
          mb: 2,
          direction: 'ltr',
        }}
      >
        <PeopleAltIcon
          sx={{
            fontSize: 30,
            color: '#212121',
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#212121',
            textAlign: 'right',
          }}
        >
          مدیریت کاربران
        </Typography>
      </Box>

      {/* ==================================================
          Search Panel
          ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Search Fields */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },

            gap: 2,

            width: '100%',
          }}
        >
          {/* نام */}

          <TextField
            fullWidth
            size="small"
            label="نام"
            value={firstName}
            onChange={(e) =>
              setFirstName(
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter'
              ) {
                handleSearchSubmit();
              }
            }}
            placeholder="جستجوی نام"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),

                endAdornment:
                  firstName ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFirstName('')
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              },
            }}
          />

          {/* نام خانوادگی */}

          <TextField
            fullWidth
            size="small"
            label="نام خانوادگی"
            value={lastName}
            onChange={(e) =>
              setLastName(
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter'
              ) {
                handleSearchSubmit();
              }
            }}
            placeholder="جستجوی نام خانوادگی"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),

                endAdornment:
                  lastName ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setLastName('')
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              },
            }}
          />

          {/* نام کاربری */}

          <TextField
            fullWidth
            size="small"
            label="نام کاربری"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter'
              ) {
                handleSearchSubmit();
              }
            }}
            placeholder="جستجوی نام کاربری"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),

                endAdornment:
                  username ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setUsername('')
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              },
            }}
          />

          {/* سازمان */}

          <TextField
            fullWidth
            size="small"
            label="سازمان"
            value={organization}
            onChange={(e) =>
              setOrganization(
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter'
              ) {
                handleSearchSubmit();
              }
            }}
            placeholder="جستجوی سازمان"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),

                endAdornment:
                  organization ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOrganization(
                            '',
                          )
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              },
            }}
          />

          {/* وضعیت کاربر */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel>
              وضعیت کاربر
            </InputLabel>

            <Select
              value={userStatus}
              label="وضعیت کاربر"
              onChange={(e) =>
                setUserStatus(
                  e.target
                    .value as UserStatus,
                )
              }
            >
              <MenuItem value="all">
                همه کاربران
              </MenuItem>

              <MenuItem value="active">
                کاربران فعال
              </MenuItem>

              <MenuItem value="locked">
                کاربران قفل‌شده
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ==================================================
            Buttons
            ================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          {/* ایجاد کاربر */}

          <Button
            variant="contained"
            onClick={
              handleOpenCreate
            }
            startIcon={
              <PersonAddIcon />
            }
            disabled={isLoading}
            sx={{
              minWidth: 150,
              height: 40,
              whiteSpace:
                'nowrap',
              backgroundColor:
                '#2e7d32',

              '&:hover': {
                backgroundColor:
                  '#1b5e20',
              },
            }}
          >
            ایجاد کاربر جدید
          </Button>

          {/* جستجو */}

          <Button
            variant="contained"
            onClick={
              handleSearchSubmit
            }
            startIcon={
              <SearchIcon />
            }
            disabled={isLoading}
            sx={{
              minWidth: 100,
              height: 40,
              whiteSpace:
                'nowrap',
              backgroundColor:
                '#2e7d32',

              '&:hover': {
                backgroundColor:
                  '#1b5e20',
              },
            }}
          >
            جستجو
          </Button>

          {/* پاک کردن */}

          <Button
            variant="contained"
            onClick={
              handleClear
            }
            startIcon={
              <ClearIcon />
            }
            disabled={
              isLoading ||
              (
                !firstName &&
                !lastName &&
                !username &&
                !organization &&
                userStatus === 'all'
              )
            }
            sx={{
              minWidth: 100,
              height: 40,
              whiteSpace:
                'nowrap',
              backgroundColor:
                '#2e7d32',

              '&:hover': {
                backgroundColor:
                  '#1b5e20',
              },
            }}
          >
            پاک کردن
          </Button>
        </Box>
      </Paper>

      {/* ==================================================
          Error
          ================================================== */}

      {error && (
        <Paper
          sx={{
            p: 2,
            bgcolor:
              'error.light',
            color:
              'error.contrastText',
            borderRadius: 2,
          }}
        >
          {error}
        </Paper>
      )}

      {/* ==================================================
          DataGrid
          ================================================== */}

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
        sx={{
          '& .MuiDataGrid-columnHeaders':
            {
              backgroundColor:
                '#1976d2',
              color: '#fff',
            },

          '& .MuiDataGrid-columnHeader':
            {
              backgroundColor:
                '#1976d2',
            },

          '& .MuiDataGrid-columnHeaderTitle':
            {
              color: '#fff',
              fontWeight:
                'bold',
            },

          '& .MuiDataGrid-sortIcon':
            {
              color: '#fff',
            },

          '& .MuiDataGrid-menuIconButton':
            {
              color: '#fff',
            },

          '& .MuiDataGrid-columnHeaderTitleContainer':
            {
              justifyContent:
                'center',
            },

          '& .MuiDataGrid-cell':
            {
              display: 'flex',
              alignItems:
                'center',
            },
        }}
      />

      {/* ==================================================
          User Modal
          ================================================== */}

      <UserModal
        open={showModal}
        user={selectedUser}
        onClose={
          handleCloseModal
        }
        onSuccess={
          handleModalSuccess
        }
      />
    </Box>
  );
}