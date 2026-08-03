import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ParentSearch from './ParentSearch';
import { axiosClient } from '@/lib/axios-client';
// import type { NormalizedApiResponse } from '../../../../../lib/axios-client';
import organizationApis from '@/modules/organization-structure/apis';

export interface Organization {
  id: string;
  name: string;
  code: string;
  active: boolean;
  parentId: string | null;
  parentName: string | null;
  [key: string]: any;
}

export interface OrganizationFormData {
  name: string;
  code: string;
  active: boolean;
  parentId: string | null;
}

const UnitAdd = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    code: '',
    active: true,
    parentId: null,
  });

  const [selectedParent, setSelectedParent] = useState<Organization | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof OrganizationFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleParentSelect = (parent: Organization | null) => {
    setSelectedParent(parent);
    setFormData(prev => ({
      ...prev,
      parentId: parent?.id || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.post<Organization>(
        `${organizationApis.organization.save}`,
        {
          name: formData.name,
          code: formData.code,
          active: formData.active,
          parentId: formData.parentId,
          // address: '',
          // serverAddress: '',
          // email: '',
          // tellNumber: '',
          // codePath: '',
          // priority: '',
          // completeName: formData.name,
        }
      );

      if (response.status) {
        setSuccess('یگان با موفقیت ثبت شد!');
        setFormData({
          name: '',
          code: '',
          active: true,
          parentId: null,
        });
        setSelectedParent(null);
      } else {
        // throw new Error(response?.message || 'خطا در ثبت یگان');
      }
    } catch (err: any) {
      console.error('Submit failed:', err);
      setError(err.response?.message || 'خطا در ثبت یگان');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        افزودن یگان جدید
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !formData.name || !formData.code}
            sx={{
              mb: 3,
              width: '100%',
            }}
          >
            {loading ? 'در حال ثبت...' : ' ثبت یگان جدید'}
          </Button>
          <br />
          <TextField
            fullWidth
            label="عنوان یگان"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="کد یگان"
            value={formData.code}
            onChange={e => handleInputChange('code', e.target.value)}
            margin="normal"
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={e => handleInputChange('active', e.target.checked)}
                color="primary"
              />
            }
            label={formData.active ? 'فعال' : 'غیر فعال'}
            sx={{ mt: 2, mb: 2 }}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            انتخاب والد یگان
          </Typography>
          <ParentSearch
            onParentSelect={handleParentSelect}
            selectedParent={selectedParent}
          />
        </form>
      </Paper>

      {/* <OrganizationList /> */}
    </Box>
  );
};

export default UnitAdd;
