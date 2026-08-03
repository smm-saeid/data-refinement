import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import researchApis from './apis';
// import { useSelector } from "react-redux";

interface OrgNode {
  id: string;
  parentId: string | null;
  name: string;
  code: string;
  children: OrgNode[];
}

interface OrganizationalTreeProps {
  onSelectUnit?: (unit: { id: string; name: string; code: string }) => void;
}

const OrganizationalTree: React.FC<OrganizationalTreeProps> = ({
  onSelectUnit,
}) => {
  const [treeData, setTreeData] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  // const token = useSelector((state: any) => state.user.accessToken);

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        researchApis.organization.list,
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data?.responseList;

      if (!Array.isArray(data)) {
        console.error('داده‌های ساختار سازمانی یافت نشدند یا معتبر نیستند');
        return;
      }

      setTreeData(data);
    } catch (error) {
      console.error('خطا در دریافت اطلاعات ساختار سازمانی', error);
    } finally {
      setLoading(false);
    }
  };

  const flattenNodes = (nodes: OrgNode[]): OrgNode[] => {
    let result: OrgNode[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children?.length) {
        result = result.concat(flattenNodes(node.children));
      }
    }
    return result;
  };

  const findPath = (nodes: OrgNode[], targetId: string): string[] => {
    for (const node of nodes) {
      if (node.id === targetId) return [node.id];
      const childPath = findPath(node.children || [], targetId);
      if (childPath.length > 0) return [node.id, ...childPath];
    }
    return [];
  };

  const onSearch = (text: string) => {
    setSearchValue(text);
    if (!text) {
      setOptions([]);
      setExpanded([]);
      return;
    }

    const allNodes = flattenNodes(treeData);
    const matched = allNodes
      .filter(node => node.name.includes(text) || node.code.includes(text))
      .map(node => ({
        value: node.id,
        label: `${node.name} (${node.code})`,
      }));

    setOptions(matched);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelected(nodeId);

    const found = flattenNodes(treeData).find(node => node.id === nodeId);
    if (found && onSelectUnit) {
      onSelectUnit({ id: found.id, name: found.name, code: found.code });
    }

    // Expand the path to the selected node
    const path = findPath(treeData, nodeId);
    setExpanded(path);
  };

  const handleAutoCompleteSelect = (value: string | null) => {
    if (!value) return;

    const path = findPath(treeData, value);
    setExpanded(path);
    setSearchValue(options.find(opt => opt.value === value)?.label || '');
    handleSelectNode(value);
  };

  const toggleExpand = (nodeId: string) => {
    setExpanded(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const renderTreeNode = (node: OrgNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    const isSelected = selected === node.id;

    return (
      <Box key={node.id} sx={{ ml: level * 2 }}>
        <ListItem
          disablePadding
          sx={{
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isSelected ? 'primary.light' : 'transparent',
            '&:hover': {
              backgroundColor: isSelected ? 'primary.light' : 'action.hover',
            },
          }}
        >
          <ListItemButton
            onClick={() => handleSelectNode(node.id)}
            sx={{
              py: 0.5,
              pl: 1 + level * 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
              }}
            >
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  sx={{ p: 0.5 }}
                >
                  {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                </IconButton>
              )}
              {!hasChildren && <Box sx={{ width: 32 }} />}

              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isSelected ? 'bold' : 'normal',
                      color: isSelected ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {node.name}
                  </Typography>
                }
              />

              <Chip
                label={node.code}
                size="small"
                variant="outlined"
                color={isSelected ? 'primary' : 'default'}
              />
            </Box>
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderTree = (nodes: OrgNode[]) => {
    return (
      <List sx={{ width: '100%' }}>
        {nodes.map(node => renderTreeNode(node))}
      </List>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        ساختار سازمانی
      </Typography>

      <Autocomplete
        freeSolo
        options={options}
        value={searchValue}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            onSearch(newValue);
          } else if (newValue) {
            handleAutoCompleteSelect(newValue.value);
          }
        }}
        onInputChange={(_, newInputValue) => {
          onSearch(newInputValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="جستجو بر اساس نام یا کد واحد"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : treeData.length === 0 ? (
        <Alert severity="info">داده‌ای برای نمایش وجود ندارد</Alert>
      ) : (
        <Box sx={{ height: 400, overflow: 'auto' }}>{renderTree(treeData)}</Box>
      )}
    </Paper>
  );
};

export default OrganizationalTree;
