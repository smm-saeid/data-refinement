import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Modal,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material';
import { axiosClient } from '@/lib/axios-client';
import organizationApis from '@/modules/organization-structure/apis';

interface OrganizationUnit {
  id: string;
  name: string;
  address: string | null;
  serverAddress: string | null;
  email: string | null;
  tellNumber: string | null;
  code: string;
  active: boolean;
  codePath: string;
  priority: number | null;
  completeName: string;
  startExpireDate: string | null;
  endExpireDate: string | null;
  dateAuthorizationLetter: string | null;
  authorizationLetterNumber: string | null;
  commonBaseDataFundamentalBaseId: string | null;
  commonBaseDataFundamentalBaseName: string | null;
  commonBaseDataUnitTypeId: string | null;
  commonBaseDataUnitTypeName: string | null;
  workOrgCapacity: number | null;
  taskOrgCapacity: number | null;
  geometricLocation_x: number | null;
  geometricLocation_y: number | null;
  commonBaseDataProvinceId: string | null;
  commonBaseDataProvinceName: string | null;
  commonBaseDataGeometricLocationId: string | null;
  commonBaseDataGeometricLocationName: string | null;
  commonBaseDataLocationId: string | null;
  commonBaseDataLocationName: string | null;
  parentId: string | null;
  parentName: string | null;
  cityId: string | null;
  cityName: string | null;
  organizationTypeId: string | null;
  organizationTypeName: string | null;
  expertSupervision: boolean;
  scope: string | null;
  children: OrganizationUnit[] | null;
  year?: number | null;
  provinceKey?: string | null;
}

const fetchRootOrganizations = async (): Promise<OrganizationUnit[]> => {
  try {
    const response = await axiosClient.get<OrganizationUnit[]>(
      `${organizationApis.organization.list}`
    );
    console.log('Root organizations response:', response);
    console.log('Root organizations data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching root organizations:', error);
    throw new Error('Failed to fetch organization data');
  }
};

const fetchChildrenByParent = async (
  parentId: string
): Promise<OrganizationUnit[]> => {
  try {
    const response = await axiosClient.get<OrganizationUnit[]>(
      `${organizationApis.organization.list}?organizationId=${parentId}`
    );
    console.log(`Children for ${parentId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching children for ${parentId}:`, error);
    throw new Error('Failed to fetch children data');
  }
};

interface UnitDetailsModalProps {
  open: boolean;
  onClose: () => void;
  unit: OrganizationUnit | null;
}

function UnitDetailsModal({ open, onClose, unit }: UnitDetailsModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!unit) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90vw' : 500,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          جزئیات واحد سازمانی
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              نام کامل:
            </Typography>
            <Typography variant="body1">{unit.completeName}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              کد:
            </Typography>
            <Typography variant="body1" fontFamily="monospace">
              {unit.code}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              مسیر کد:
            </Typography>
            <Typography variant="body1" fontFamily="monospace">
              {unit.codePath}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              وضعیت:
            </Typography>
            <Chip
              label={unit.active ? 'فعال' : 'غیرفعال'}
              color={unit.active ? 'success' : 'error'}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              نظارت تخصصی:
            </Typography>
            <Chip
              label={unit.expertSupervision ? 'دارد' : 'ندارد'}
              color={unit.expertSupervision ? 'info' : 'default'}
              size="small"
            />
          </Box>

          {unit.parentName && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                واحد والد:
              </Typography>
              <Typography variant="body1">{unit.parentName}</Typography>
            </Box>
          )}

          {unit.parentId && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* <Typography variant="subtitle1" fontWeight="bold">
                شناسه والد:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="monospace"
              >
                {unit.parentId}
              </Typography> */}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

interface TreeItemProps {
  node: OrganizationUnit;
  level: number;
  onNodeSelect: (node: OrganizationUnit) => void;
  searchTerm: string;
  expandedNodes: string[];
  onToggle: (nodeId: string, node: OrganizationUnit) => Promise<void>;
  loadingNodes: string[];
}

function TreeItem({
  node,
  level,
  onNodeSelect,
  searchTerm,
  expandedNodes,
  onToggle,
  loadingNodes,
}: TreeItemProps) {
  const hasPotentialChildren = node.children === null;
  const hasActualChildren =
    Array.isArray(node.children) && node.children.length > 0;
  const isExpanded = expandedNodes.includes(node.id);
  const isLoading = loadingNodes.includes(node.id);
  const isMatch =
    searchTerm &&
    (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = async () => {
    await onToggle(node.id, node);
  };

  const handleSelect = () => {
    onNodeSelect(node);
  };

  return (
    <>
      <ListItem
        sx={{
          pl: level * 2 + 2,
          backgroundColor: isMatch ? 'warning.light' : 'transparent',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 32 }}>
          {(hasPotentialChildren || hasActualChildren) && (
            <IconButton
              size="small"
              onClick={handleToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={16} />
              ) : isExpanded ? (
                <ExpandMore fontSize="small" />
              ) : (
                <ChevronRight fontSize="small" />
              )}
            </IconButton>
          )}
        </ListItemIcon>

        <ListItemIcon sx={{ minWidth: 32 }}>
          {hasPotentialChildren || hasActualChildren ? (
            isExpanded ? (
              <FolderOpen color="primary" />
            ) : (
              <Folder color="action" />
            )
          ) : (
            <Folder color="disabled" />
          )}
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                onClick={handleSelect}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                  fontWeight: isMatch ? 'bold' : 'normal',
                }}
              >
                {node.name}
              </Typography>
              <Chip
                label={node.code}
                size="small"
                variant="outlined"
                color={node.active ? 'primary' : 'default'}
              />
            </Box>
          }
          secondary={
            node.completeName && node.completeName !== node.name ? (
              <Typography variant="caption" color="text.secondary">
                {node.completeName}
              </Typography>
            ) : null
          }
        />
      </ListItem>

      {isExpanded && hasActualChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children!.map(child => (
              <TreeItem
                key={child.id}
                node={child}
                level={level + 1}
                onNodeSelect={onNodeSelect}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                loadingNodes={loadingNodes}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

const createRootNode = (
  organizations: OrganizationUnit[]
): OrganizationUnit => {
  return {
    id: 'root',
    name: 'سازمان اصلی',
    code: 'ROOT',
    active: true,
    completeName: 'سازمان اصلی',
    codePath: '',
    parentId: null,
    parentName: null,
    children: organizations,
    address: null,
    serverAddress: null,
    email: null,
    tellNumber: null,
    priority: null,
    startExpireDate: null,
    endExpireDate: null,
    dateAuthorizationLetter: null,
    authorizationLetterNumber: null,
    commonBaseDataFundamentalBaseId: null,
    commonBaseDataFundamentalBaseName: null,
    commonBaseDataUnitTypeId: null,
    commonBaseDataUnitTypeName: null,
    workOrgCapacity: null,
    taskOrgCapacity: null,
    geometricLocation_x: null,
    geometricLocation_y: null,
    commonBaseDataProvinceId: null,
    commonBaseDataProvinceName: null,
    commonBaseDataGeometricLocationId: null,
    commonBaseDataGeometricLocationName: null,
    commonBaseDataLocationId: null,
    commonBaseDataLocationName: null,
    cityId: null,
    cityName: null,
    organizationTypeId: null,
    organizationTypeName: null,
    expertSupervision: false,
    scope: null,
    year: null,
    provinceKey: null,
  };
};

export default function UnitsTree() {
  const [organizationData, setOrganizationData] =
    useState<OrganizationUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<OrganizationUnit | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [loadingNodes, setLoadingNodes] = useState<string[]>([]);
  const [searchResults] = useState<OrganizationUnit[] | null>(null);

  useEffect(() => {
    loadRootOrganizations();
  }, []);

  const loadRootOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const organizations = await fetchRootOrganizations();
      console.log('Organizations loaded:', organizations);

      const rootNode = createRootNode(organizations);
      setOrganizationData(rootNode);

      setExpandedNodes(['root']);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'خطا در بارگذاری داده‌های سازمانی';
      setError(errorMessage);
      console.error('Error fetching organization data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeSelect = (node: OrganizationUnit) => {
    setSelectedUnit(node);
    setModalOpen(true);
  };

  const handleToggle = async (nodeId: string, node: OrganizationUnit) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(prev => prev.filter(id => id !== nodeId));
      return;
    }

    if (node.children === null) {
      setLoadingNodes(prev => [...prev, nodeId]);
      try {
        const children = await fetchChildrenByParent(nodeId);

        const updateNodeWithChildren = (
          currentNode: OrganizationUnit
        ): OrganizationUnit => {
          if (currentNode.id === nodeId) {
            return {
              ...currentNode,
              children: children,
            };
          }
          if (currentNode.children && Array.isArray(currentNode.children)) {
            return {
              ...currentNode,
              children: currentNode.children.map(updateNodeWithChildren),
            };
          }
          return currentNode;
        };

        setOrganizationData(prev =>
          prev ? updateNodeWithChildren(prev) : null
        );
        setExpandedNodes(prev => [...prev, nodeId]);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('خطا در بارگذاری زیرمجموعه‌ها');
      } finally {
        setLoadingNodes(prev => prev.filter(id => id !== nodeId));
      }
    } else {
      setExpandedNodes(prev => [...prev, nodeId]);
    }
  };

  const displayData = useMemo(() => {
    if (searchResults && searchTerm) {
      return createRootNode(searchResults);
    }
    return organizationData;
  }, [organizationData, searchResults, searchTerm]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Alert
          severity="error"
          sx={{ m: 2 }}
          action={
            <button
              onClick={loadRootOrganizations}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              تلاش مجدد
            </button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (
    !organizationData ||
    !organizationData.children ||
    organizationData.children.length === 0
  ) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Alert severity="warning" sx={{ m: 2 }}>
          داده‌ای برای نمایش وجود ندارد
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, height: '100%' }}>
      <Paper
        sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {searchResults ? 'نتایج جستجو' : 'درخت واحدهای سازمانی'}
          </Typography>

          {/* Search Box */}
          {/* <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس نام یا کد واحد..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: 'text.secondary', ml: 1 }} />
              ),
            }}
            sx={{ mb: 2 }}
          /> */}
        </Box>

        {/* Tree View */}
        <Box sx={{ flex: 1, minHeight: 400, overflow: 'auto' }}>
          <List>
            {displayData.children.map(node => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onNodeSelect={handleNodeSelect}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
                onToggle={handleToggle}
                loadingNodes={loadingNodes}
              />
            ))}
          </List>

          {searchResults && searchResults.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                نتیجه‌ای یافت نشد
              </Typography>
            </Box>
          )}
        </Box>

        {/* Unit Details Modal */}
        <UnitDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          unit={selectedUnit}
        />
      </Paper>
    </Box>
  );
}
