import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import axios from 'axios';
import NewsForm from './NewsForm';
import NewsSearch from './NewsSearch';
import NewsTable from './NewsTable';
import ViewDialog from './ViewDialog';
import EditDialog from './EditDialog';
import researchApis from '../../apis';

export type AwarenessClass = {
  classDate: string;
  unitName: string;
  subject: string;
  participants: string;
  instructor: string;
};

export type InspectionItem = {
  date: string;
  unit: string;
  description: string;
  result: string;
};

export type CeremonyItem = {
  date: string;
  title: string;
  location: string;
  participants: string;
  description: string;
};

export type IncidentItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  actions: string;
};

export type PublicAidItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  beneficiaries: string;
};

export type ImportantEventItem = {
  date: string;
  title: string;
  description: string;
  impact: string;
};

export type NewsItem = {
  id: string;
  newsletterNo: number;
  reportDate: string;
  inspection: InspectionItem[];
  ceremony: CeremonyItem[];
  incident: IncidentItem[];
  awarenessClass: AwarenessClass[];
  publicAid: PublicAidItem[];
  importantEvent: ImportantEventItem[];
  archived: boolean;
};

const SafetyNedaja = () => {
  const theme = useTheme();

  const [tableData, setTableData] = useState<NewsItem[]>([]);
  const [filteredData, setFilteredData] = useState<NewsItem[]>([]);
  const [searchNewsletterNo, setSearchNewsletterNo] = useState<number | ''>('');

  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    data: NewsItem | null;
  }>({ open: false, data: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    data: NewsItem | null;
    editData: Partial<NewsItem>;
  }>({ open: false, data: null, editData: {} });

  useEffect(() => {
    fetchNewsItems();
  }, []);

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  const fetchNewsItems = async (): Promise<void> => {
    try {
      const response = await axios.post(
        researchApis.NewsLetter.aja.list,
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data?.rows;
      console.log('Fetched data:', data);
      setTableData(data || []);
    } catch (error) {
      console.error('Error fetching news items:', error);
    }
  };

  const handleSearch = async (): Promise<void> => {
    if (searchNewsletterNo === '') {
      setFilteredData(tableData);
      return;
    }

    try {
      const response = await axios.post(
        researchApis.NewsLetter.aja.list,
        {
          newsletterNo: searchNewsletterNo,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data?.rows;
      console.log('Search results:', data);
      setFilteredData(data || []);
    } catch (error) {
      console.error('Error searching news items:', error);
      const filtered = tableData.filter(item =>
        item.newsletterNo.toString().includes(searchNewsletterNo.toString())
      );
      setFilteredData(filtered);
    }
  };

  const handleClearSearch = (): void => {
    setSearchNewsletterNo('');
    setFilteredData(tableData);
  };

  const handleOpenViewDialog = (item: NewsItem): void => {
    setViewDialog({ open: true, data: item });
  };

  const handleCloseViewDialog = (): void => {
    setViewDialog({ open: false, data: null });
  };

  const handleOpenEditDialog = (item: NewsItem): void => {
    setEditDialog({
      open: true,
      data: item,
      editData: { ...item },
    });
  };

  const handleCloseEditDialog = (): void => {
    setEditDialog({ open: false, data: null, editData: {} });
  };

  const handleEditInspectionChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...(editDialog.editData.inspection || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, inspection: updatedItems },
    }));
  };

  const handleEditCeremonyChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...(editDialog.editData.ceremony || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, ceremony: updatedItems },
    }));
  };

  const handleEditIncidentChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...(editDialog.editData.incident || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, incident: updatedItems },
    }));
  };

  const handleEditPublicAidChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...(editDialog.editData.publicAid || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, publicAid: updatedItems },
    }));
  };

  const handleEditImportantEventChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...(editDialog.editData.importantEvent || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, importantEvent: updatedItems },
    }));
  };

  const handleEditAwarenessClassChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedClasses = [...(editDialog.editData.awarenessClass || [])];
    updatedClasses[index] = { ...updatedClasses[index], [field]: value };
    setEditDialog(prev => ({
      ...prev,
      editData: { ...prev.editData, awarenessClass: updatedClasses },
    }));
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (editDialog.data) {
      try {
        const editDataToSend = {
          ...editDialog.editData,
          reportDate: formatDateToYYYYMMDD(
            editDialog.editData.reportDate || ''
          ),
          inspection: (editDialog.editData.inspection || []).map(item => ({
            ...item,
            date: formatDateToYYYYMMDD(item.date),
          })),
          ceremony: (editDialog.editData.ceremony || []).map(item => ({
            ...item,
            date: formatDateToYYYYMMDD(item.date),
          })),
          incident: (editDialog.editData.incident || []).map(item => ({
            ...item,
            date: formatDateToYYYYMMDD(item.date),
          })),
          awarenessClass: (editDialog.editData.awarenessClass || []).map(
            cls => ({
              ...cls,
              classDate: formatDateToYYYYMMDD(cls.classDate),
            })
          ),
          publicAid: (editDialog.editData.publicAid || []).map(item => ({
            ...item,
            date: formatDateToYYYYMMDD(item.date),
          })),
          importantEvent: (editDialog.editData.importantEvent || []).map(
            item => ({
              ...item,
              date: formatDateToYYYYMMDD(item.date),
            })
          ),
        };

        const response = await axios.put(
          `${researchApis.NewsLetter.aja.update}/${editDialog.data.id}`,
          editDataToSend,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const updatedItem = response.data;
          setTableData(prev =>
            prev.map(item =>
              item.id === editDialog.data!.id ? updatedItem : item
            )
          );
          handleCloseEditDialog();
          fetchNewsItems();
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDeleteItem = async (id: string): Promise<void> => {
    if (window.confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
      try {
        const response = await axios.delete(
          `${researchApis.NewsLetter.aja.delete}/${id}`,
          {
            headers: {},
          }
        );

        if (response.status === 200) {
          setTableData(prev => prev.filter(item => item.id !== id));
          setFilteredData(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleArchiveToggle = async (id: string): Promise<void> => {
    try {
      const item = tableData.find(item => item.id === id);
      const response = await axios.patch(
        `http://192.168.2.124:8086/api/newsletter/aja/archive/${id}`,
        { archived: !item?.archived },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setTableData(prev =>
          prev.map(item =>
            item.id === id ? { ...item, archived: !item.archived } : item
          )
        );
        setFilteredData(prev =>
          prev.map(item =>
            item.id === id ? { ...item, archived: !item.archived } : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleAddNewsItem = (newItem: NewsItem): void => {
    setTableData(prev => [...prev, newItem]);
    setFilteredData(prev => [...prev, newItem]);
  };

  const formatDateToYYYYMMDD = (dateString: string): string => {
    if (!dateString || dateString === 'بدون زمان') {
      return new Date().toISOString().split('T')[0];
    }

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }

      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return new Date().toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toISOString().split('T')[0];
    }
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString || dateString === 'بدون زمان') {
      return 'بدون زمان';
    }

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${year}/${month}/${day}`;
      }

      if (dateString.includes('T')) {
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${year}/${month}/${day}`;
      }

      return dateString;
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return dateString;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <NewsForm onAddNewsItem={handleAddNewsItem} />

      <NewsSearch
        searchNewsletterNo={searchNewsletterNo}
        onSearchNewsletterNoChange={setSearchNewsletterNo}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        resultCount={filteredData.length}
      />

      <NewsTable
        data={filteredData}
        onView={handleOpenViewDialog}
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteItem}
        onArchiveToggle={handleArchiveToggle}
        formatDateForDisplay={formatDateForDisplay}
      />

      <ViewDialog
        open={viewDialog.open}
        data={viewDialog.data}
        onClose={handleCloseViewDialog}
        formatDateForDisplay={formatDateForDisplay}
      />

      <EditDialog
        open={editDialog.open}
        data={editDialog.data}
        editData={editDialog.editData}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
        onEditFieldChange={(field, value) =>
          setEditDialog(prev => ({
            ...prev,
            editData: { ...prev.editData, [field]: value },
          }))
        }
        onEditInspectionChange={handleEditInspectionChange}
        onEditCeremonyChange={handleEditCeremonyChange}
        onEditIncidentChange={handleEditIncidentChange}
        onEditAwarenessClassChange={handleEditAwarenessClassChange}
        onEditPublicAidChange={handleEditPublicAidChange}
        onEditImportantEventChange={handleEditImportantEventChange}
        formatDateToYYYYMMDD={formatDateToYYYYMMDD}
      />
    </Box>
  );
};

export default SafetyNedaja;
