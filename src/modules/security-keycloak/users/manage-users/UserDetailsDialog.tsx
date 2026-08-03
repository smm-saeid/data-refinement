import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid as Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  MilitaryTech as MilitaryTechIcon,
  Group as GroupIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { UserWithRoles } from '../../types';

interface UserDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  userWithRoles: UserWithRoles | null;
}

export function UserDetailsDialog({
  open,
  onClose,
  userWithRoles,
}: UserDetailsDialogProps) {
  if (!userWithRoles) return null;

  const { user, roles } = userWithRoles;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon color="primary" />
          جزئیات کاربر
        </Box>
        <Button onClick={onClose} color="inherit">
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* User Info */}
          <Grid size={12}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    icon={user.enabled ? <ActiveIcon /> : <InactiveIcon />}
                    label={user.enabled ? 'فعال' : 'غیرفعال'}
                    color={user.enabled ? 'success' : 'error'}
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {user.username}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PersonIcon color="primary" />
              اطلاعات شخصی
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="ایمیل" secondary={user.email || '---'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BadgeIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="کد ملی"
                  secondary={user.attributes?.nationalityCode?.[0] || '---'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BadgeIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="کد پرسنلی"
                  secondary={user.attributes?.personnelCode?.[0] || '---'}
                />
              </ListItem>
            </List>
          </Grid>

          {/* Organizational Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <MilitaryTechIcon color="primary" />
              اطلاعات سازمانی
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <MilitaryTechIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="کد درجه"
                  secondary={user.attributes?.degreeCode?.[0] || '---'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GroupIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="کد یگان"
                  secondary={user.attributes?.unitCode?.[0] || '---'}
                />
              </ListItem>
            </List>
          </Grid>

          {/* Roles */}
          <Grid size={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <GroupIcon color="primary" />
              نقش‌های کاربر
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {roles.map(role => (
                <Chip
                  key={role.id}
                  label={role.name}
                  color="primary"
                  variant="filled"
                  size="medium"
                />
              ))}
              {roles.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  هیچ نقشی برای این کاربر تعریف نشده است
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}
