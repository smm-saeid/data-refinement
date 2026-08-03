import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  ListItemButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import type { Organization } from './UnitAdd.tsx';
import { axiosClient } from '@/lib/axios-client';
import organizationApis from '@/modules/organization-structure/apis';

interface ParentSearchProps {
  onParentSelect: (parent: Organization | null) => void;
  selectedParent: Organization | null;
}

const ParentSearch = ({
  onParentSelect,
  selectedParent,
}: ParentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchParents = useCallback(async (name: string) => {
    if (!name.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.get<Organization[]>(
        `${organizationApis.organization.name}/${encodeURIComponent(name)}`
      );

      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      setSearchPerformed(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchParents(searchTerm);
      } else {
        setSearchResults([]);
        setSearchPerformed(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParents]);

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchPerformed(false);
    onParentSelect(null);
  };

  const handleParentSelect = (parent: Organization) => {
    onParentSelect(parent);
    setSearchTerm(parent.name);
    setSearchResults([]);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        label="جستجوی یگان والد"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="بر اساس نام یگان"
        InputProps={{
          endAdornment: (
            <>
              {loading && <CircularProgress size={20} />}
              {searchTerm && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
              {!loading && !searchTerm && <SearchIcon color="action" />}
            </>
          ),
        }}
      />

      {searchResults.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 200,
            overflow: 'auto',
            mt: 1,
          }}
        >
          <List dense>
            {searchResults.map(parent => (
              <ListItem key={parent.id} disablePadding>
                <ListItemButton onClick={() => handleParentSelect(parent)}>
                  <ListItemText
                    primary={parent.name}
                    secondary={`کد: ${parent.code} | ${parent.active ? 'فعال' : 'غیرفعال'}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {searchPerformed && searchResults.length === 0 && searchTerm && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          "{searchTerm}" وجود ندارد
        </Typography>
      )}

      {selectedParent && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.light' }}>
          <Typography variant="subtitle1">
            یگان والد انتخابی: <strong>{selectedParent.name}</strong>
          </Typography>
          <Typography variant="body2">
            کد: {selectedParent.code} |{' '}
            {selectedParent.active ? 'فعال' : 'غیرفعال'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ParentSearch;
