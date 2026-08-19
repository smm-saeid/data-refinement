import { useEffect, useState } from 'react';

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  Popover,
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import FormatClearIcon from '@mui/icons-material/FormatClear';
import LinkIcon from '@mui/icons-material/Link';

import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import HighlightIcon from '@mui/icons-material/Highlight';

import TableChartIcon from '@mui/icons-material/TableChart';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

import { EditorContent, useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';

import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import { Extension } from '@tiptap/core';

import './OnMessage.css';

// =========================================================
// Types
// =========================================================

type UserCompany = {
  name?: string;
  department?: string;
  title?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;

  password?: string;
  personnelCode?: string;

  startDate?: string;
  endDate?: string;

  workShift?: string;
  organization?: string;

  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  image?: string;

  company?: UserCompany;

  fullName?: string;
  department?: string;

  isLocked?: boolean;
};

type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

type OnMessageProps = {
  onClose: () => void;
};

// =========================================================
// Font Family + Font Size
// =========================================================

const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],

        attributes: {
          fontFamily: {
            default: null,

            parseHTML: element => element.style.fontFamily || null,

            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },

          fontSize: {
            default: null,

            parseHTML: element => element.style.fontSize || null,

            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },

          color: {
            default: null,

            parseHTML: element => element.style.color || null,

            renderHTML: attributes => {
              if (!attributes.color) {
                return {};
              }

              return {
                style: `color: ${attributes.color}`,
              };
            },
          },
        },
      },
    ];
  },
});

// =========================================================
// File
// =========================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_EXTENSIONS = ['.zip', '.rar'];

// =========================================================
// Table Picker Size
// =========================================================

const MAX_TABLE_ROWS = 8;
const MAX_TABLE_COLS = 8;

// =========================================================
// Component
// =========================================================

const OnMessage = ({ onClose }: OnMessageProps) => {
  // =======================================================
  // Users
  // =======================================================

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  // =======================================================
  // Message
  // =======================================================

  const [title, setTitle] = useState('');

  const [text, setText] = useState('');

  // =======================================================
  // File
  // =======================================================

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileModalOpen, setFileModalOpen] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [fileError, setFileError] = useState('');

  // =======================================================
  // Table Picker
  // =======================================================

  const [tablePickerAnchor, setTablePickerAnchor] =
    useState<HTMLElement | null>(null);

  const [selectedTableRows, setSelectedTableRows] = useState(0);

  const [selectedTableCols, setSelectedTableCols] = useState(0);

  // =======================================================
  // Editor
  // =======================================================

  const editor = useEditor({
    extensions: [
      StarterKit,

      TextStyle,

      Underline,

      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      }),

      Highlight.configure({
        multicolor: true,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),

      FontFamily,

      Table.configure({
        resizable: true,

        HTMLAttributes: {
          class: 'word-table',
        },
      }),

      TableRow,

      TableHeader,

      TableCell,
    ],

    content: '',

    editorProps: {
      attributes: {
        dir: 'rtl',
      },
    },

    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
  });

  // =======================================================
  // Get Users
  // =======================================================

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await fetch('https://dummyjson.com/users');

        if (!response.ok) {
          throw new Error('خطا در دریافت کاربران');
        }

        const data: UsersResponse = await response.json();

        setUsers(data.users);
      } catch (error) {
        console.error('Get users error:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, []);

  // =======================================================
  // File Validation
  // =======================================================

  const isAllowedFile = (file: File) => {
    const fileName = file.name.toLowerCase();

    return ALLOWED_FILE_EXTENSIONS.some(extension =>
      fileName.endsWith(extension)
    );
  };

  // =======================================================
  // Open File Modal
  // =======================================================

  const handleOpenFileModal = () => {
    setFileError('');

    setFileModalOpen(true);
  };

  // =======================================================
  // Close File Modal
  // =======================================================

  const handleCloseFileModal = () => {
    if (uploading) {
      return;
    }

    setFileError('');

    setFileModalOpen(false);
  };

  // =======================================================
  // File Change
  // =======================================================

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setFileError('');

    if (!isAllowedFile(file)) {
      setFileError('فقط فایل‌های ZIP و RAR مجاز هستند.');

      event.target.value = '';

      setSelectedFile(null);

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('حجم فایل نباید بیشتر از 10 مگابایت باشد.');

      event.target.value = '';

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  // =======================================================
  // Upload
  // =======================================================

  const handleUpload = async () => {
    setFileError('');

    if (!selectedFile) {
      setFileError('لطفاً ابتدا یک فایل انتخاب کنید.');

      return;
    }

    if (!isAllowedFile(selectedFile)) {
      setFileError('فقط فایل‌های ZIP و RAR مجاز هستند.');

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('حجم فایل نباید بیشتر از 10 مگابایت باشد.');

      return;
    }

    try {
      setUploading(true);

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      console.log('فایل آپلود شد:', selectedFile);

      setFileModalOpen(false);
    } catch (error) {
      console.error('Upload error:', error);

      setFileError('آپلود فایل با خطا مواجه شد.');
    } finally {
      setUploading(false);
    }
  };

  // =======================================================
  // Remove Recipient
  // =======================================================

  const handleRemoveRecipient = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // =======================================================
  // Font Family
  // =======================================================

  const handleFontFamily = (event: SelectChangeEvent<string>) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setMark('textStyle', {
        fontFamily: event.target.value,
      })
      .run();
  };

  // =======================================================
  // Font Size
  // =======================================================

  const handleFontSize = (event: SelectChangeEvent<string>) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setMark('textStyle', {
        fontSize: event.target.value,
      })
      .run();
  };

  // =======================================================
  // Link
  // =======================================================

  const handleSetLink = () => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes('link').href;

    const url = window.prompt(
      'آدرس لینک را وارد کنید:',
      previousUrl || 'https://'
    );

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();

      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();
  };

  // =======================================================
  // Text Color
  // =======================================================

  const handleTextColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setMark('textStyle', {
        color: event.target.value,
      })
      .run();
  };

  // =======================================================
  // Highlight
  // =======================================================

  const handleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHighlight({
        color: event.target.value,
      })
      .run();
  };

  // =======================================================
  // Table State
  // =======================================================

  const isInsideTable = editor?.isActive('table') ?? false;

  // =======================================================
  // Open Table Picker
  // =======================================================

  const handleOpenTablePicker = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedTableRows(0);

    setSelectedTableCols(0);

    setTablePickerAnchor(event.currentTarget);
  };

  // =======================================================
  // Close Table Picker
  // =======================================================

  const handleCloseTablePicker = () => {
    setTablePickerAnchor(null);

    setSelectedTableRows(0);

    setSelectedTableCols(0);
  };

  // =======================================================
  // Hover Table Cell
  // =======================================================

  const handleTableCellHover = (row: number, col: number) => {
    setSelectedTableRows(row);

    setSelectedTableCols(col);
  };

  // =======================================================
  // Create Selected Table
  // =======================================================

  const handleCreateSelectedTable = (rows: number, cols: number) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: true,
      })
      .run();

    setText(editor.getHTML());

    handleCloseTablePicker();
  };

  // =======================================================
  // Add Row
  // =======================================================

  const handleAddRow = () => {
    if (!editor || !isInsideTable) {
      return;
    }

    editor.chain().focus().addRowAfter().run();
  };

  // =======================================================
  // Add Column
  // =======================================================

  const handleAddColumn = () => {
    if (!editor || !isInsideTable) {
      return;
    }

    editor.chain().focus().addColumnAfter().run();
  };

  // =======================================================
  // Delete Row
  // =======================================================

  const handleDeleteRow = () => {
    if (!editor || !isInsideTable) {
      return;
    }

    editor.chain().focus().deleteRow().run();
  };

  // =======================================================
  // Delete Column
  // =======================================================

  const handleDeleteColumn = () => {
    if (!editor || !isInsideTable) {
      return;
    }

    editor.chain().focus().deleteColumn().run();
  };

  // =======================================================
  // Delete Table
  // =======================================================

  const handleDeleteTable = () => {
    if (!editor || !isInsideTable) {
      return;
    }

    editor.chain().focus().deleteTable().run();
  };

  // =======================================================
  // Send
  // =======================================================

  const handleSend = () => {
    if (selectedUsers.length === 0) {
      alert('لطفاً حداقل یک گیرنده انتخاب کنید.');

      return;
    }

    if (!title.trim()) {
      alert('لطفاً عنوان پیام را وارد کنید.');

      return;
    }

    if (!text.trim()) {
      alert('لطفاً متن پیام را وارد کنید.');

      return;
    }

    console.log('عنوان:', title);

    console.log('متن HTML:', text);

    console.log('گیرندگان:', selectedUsers);

    console.log('فایل:', selectedFile);

    onClose();
  };

  // =======================================================
  // File Size
  // =======================================================

  const getFileSizeInMB = (file: File) => {
    return (file.size / (1024 * 1024)).toFixed(2);
  };

  // =======================================================
  // Editor Loading
  // =======================================================

  if (!editor) {
    return null;
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <Box className="on-message">
      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      <TextField
        label="عنوان پیام"
        placeholder="عنوان پیام را وارد کنید"
        value={title}
        onChange={event => setTitle(event.target.value)}
        fullWidth
        sx={{
          mb: 2,
        }}
      />

      {/* ================================================= */}
      {/* EDITOR */}
      {/* ================================================= */}

      <Box className="on-message-editor">
        <Box className="editor-title">
          <Typography variant="subtitle1" fontWeight={600}>
            متن پیام
          </Typography>
        </Box>

        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}

        <Box className="editor-toolbar">
          {/* Bold */}

          <Tooltip title="ضخیم">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>

          {/* Italic */}

          <Tooltip title="کج">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>

          {/* Underline */}

          <Tooltip title="زیرخط">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* Font */}

          <FormControl
            size="small"
            sx={{
              minWidth: 160,
            }}
          >
            <InputLabel>فونت</InputLabel>

            <Select
              label="فونت"
              defaultValue="Arial"
              onChange={handleFontFamily}
            >
              <MenuItem value="Arial">Arial</MenuItem>

              <MenuItem value="Calibri">Calibri</MenuItem>

              <MenuItem value="'Times New Roman'">Times New Roman</MenuItem>

              <MenuItem value="'B Nazanin'">B Nazanin</MenuItem>

              <MenuItem value="'B Titr'">B Titr</MenuItem>

              <MenuItem value="'B Mitra'">B Mitra</MenuItem>

              <MenuItem value="'B Yekan'">B Yekan</MenuItem>

              <MenuItem value="Tahoma">Tahoma</MenuItem>

              <MenuItem value="Verdana">Verdana</MenuItem>
            </Select>
          </FormControl>

          {/* Font Size */}

          <FormControl
            size="small"
            sx={{
              minWidth: 80,
            }}
          >
            <InputLabel>اندازه</InputLabel>

            <Select
              label="اندازه"
              defaultValue="16px"
              onChange={handleFontSize}
            >
              <MenuItem value="12px">12</MenuItem>

              <MenuItem value="14px">14</MenuItem>

              <MenuItem value="16px">16</MenuItem>

              <MenuItem value="18px">18</MenuItem>

              <MenuItem value="20px">20</MenuItem>

              <MenuItem value="24px">24</MenuItem>

              <MenuItem value="28px">28</MenuItem>

              <MenuItem value="32px">32</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem />

          {/* Text Color */}

          <Tooltip title="رنگ متن">
            <IconButton component="label" size="small">
              <FormatColorTextIcon />

              <input
                type="color"
                hidden
                defaultValue="#000000"
                onChange={handleTextColor}
              />
            </IconButton>
          </Tooltip>

          {/* Highlight */}

          <Tooltip title="هایلایت">
            <IconButton component="label" size="small">
              <HighlightIcon />

              <input
                type="color"
                hidden
                defaultValue="#fff59d"
                onChange={handleHighlight}
              />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* Bullet */}

          <Tooltip title="لیست نقطه‌ای">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>

          {/* Number */}

          <Tooltip title="لیست شماره‌ای">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          <Tooltip title="ایجاد جدول">
            <IconButton
              size="small"
              onClick={handleOpenTablePicker}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <TableChartIcon />
            </IconButton>
          </Tooltip>

          {/* ================================================= */}
          {/* TABLE PICKER */}
          {/* ================================================= */}

          <Popover
            open={Boolean(tablePickerAnchor)}
            anchorEl={tablePickerAnchor}
            onClose={handleCloseTablePicker}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box className="table-picker">
              <Typography className="table-picker-size">
                {selectedTableRows > 0 && selectedTableCols > 0
                  ? `${selectedTableRows} × ${selectedTableCols}`
                  : 'تعداد سطر و ستون را انتخاب کنید'}
              </Typography>

              <Box className="table-picker-grid">
                {Array.from({
                  length: MAX_TABLE_ROWS,
                }).map((_, rowIndex) => (
                  <Box key={rowIndex} className="table-picker-row">
                    {Array.from({
                      length: MAX_TABLE_COLS,
                    }).map((_, colIndex) => {
                      const row = rowIndex + 1;

                      const col = colIndex + 1;

                      const active =
                        row <= selectedTableRows && col <= selectedTableCols;

                      return (
                        <Box
                          key={`${row}-${col}`}
                          className={`table-picker-cell ${
                            active ? 'active' : ''
                          }`}
                          onMouseEnter={() => handleTableCellHover(row, col)}
                          onClick={() => handleCreateSelectedTable(row, col)}
                        />
                      );
                    })}
                  </Box>
                ))}
              </Box>

              <Typography className="table-picker-footer">
                برای ایجاد جدول، روی اندازه موردنظر کلیک کنید
              </Typography>
            </Box>
          </Popover>

          {/* Add Row */}

          <Tooltip title="افزودن سطر">
            <IconButton
              size="small"
              disabled={!isInsideTable}
              onClick={handleAddRow}
            >
              <ViewHeadlineIcon />
            </IconButton>
          </Tooltip>

          {/* Add Column */}

          <Tooltip title="افزودن ستون">
            <IconButton
              size="small"
              disabled={!isInsideTable}
              onClick={handleAddColumn}
            >
              <ViewWeekIcon />
            </IconButton>
          </Tooltip>

          {/* Delete Row */}

          <Tooltip title="حذف سطر">
            <IconButton
              size="small"
              color="error"
              disabled={!isInsideTable}
              onClick={handleDeleteRow}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>

          {/* Delete Column */}

          <Tooltip title="حذف ستون">
            <IconButton
              size="small"
              color="error"
              disabled={!isInsideTable}
              onClick={handleDeleteColumn}
            >
              <RemoveIcon
                sx={{
                  transform: 'rotate(90deg)',
                }}
              />
            </IconButton>
          </Tooltip>

          {/* Delete Table */}

          <Tooltip title="حذف جدول">
            <IconButton
              size="small"
              color="error"
              disabled={!isInsideTable}
              onClick={handleDeleteTable}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* Right */}

          <Tooltip title="راست‌چین">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <FormatAlignRightIcon />
            </IconButton>
          </Tooltip>

          {/* Center */}

          <Tooltip title="وسط‌چین">
            <IconButton
              size="small"
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
            >
              <FormatAlignCenterIcon />
            </IconButton>
          </Tooltip>

          {/* Left */}

          <Tooltip title="چپ‌چین">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <FormatAlignLeftIcon />
            </IconButton>
          </Tooltip>

          {/* Justify */}

          <Tooltip title="تراز دوطرفه">
            <IconButton
              size="small"
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
            >
              <FormatAlignJustifyIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* Link */}

          <Tooltip title="لینک">
            <IconButton size="small" onClick={handleSetLink}>
              <LinkIcon />
            </IconButton>
          </Tooltip>

          {/* Undo */}

          <Tooltip title="بازگشت">
            <IconButton
              size="small"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <UndoIcon />
            </IconButton>
          </Tooltip>

          {/* Redo */}

          <Tooltip title="بازگردانی">
            <IconButton
              size="small"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <RedoIcon />
            </IconButton>
          </Tooltip>

          {/* Clear */}

          <Tooltip title="پاک کردن قالب‌بندی">
            <IconButton
              size="small"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
            >
              <FormatClearIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ================================================= */}
        {/* EDITOR CONTENT */}
        {/* ================================================= */}

        <Box className="editor-content-wrapper">
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {/* ================================================= */}
      {/* FILE + RECIPIENT */}
      {/* ================================================= */}

      <Box className="message-bottom-fields">
        <Button
          variant="outlined"
          startIcon={<AttachFileIcon />}
          onClick={handleOpenFileModal}
          sx={{
            height: 56,
            justifyContent: 'flex-start',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedFile ? selectedFile.name : 'فایل ضمیمه'}
        </Button>

        <Autocomplete
          multiple
          fullWidth
          options={users}
          value={selectedUsers}
          loading={loadingUsers}

          onChange={(_, newValue) => {
            setSelectedUsers(newValue);
          }}

          getOptionLabel={user => `${user.firstName} ${user.lastName}`}

          isOptionEqualToValue={(option, value) => option.id === value.id}

          renderTags={value =>
            value.map(user => (
              <Tooltip key={user.id} title="برای حذف، دابل‌کلیک کنید">
                <Box
                  component="span"
                  className="recipient-tag"
                  onDoubleClick={() => handleRemoveRecipient(user.id)}
                >
                  {user.firstName} {user.lastName}
                </Box>
              </Tooltip>
            ))
          }

          renderInput={params => (
            <TextField
              {...params}
              label="گیرندگان"
              placeholder={
                selectedUsers.length === 0 ? 'گیرندگان را انتخاب کنید' : ''
              }
            />
          )}
        />
      </Box>

      {/* ================================================= */}
      {/* FILE DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={fileModalOpen}
        onClose={handleCloseFileModal}
        fullWidth
        maxWidth="sm"
        dir="rtl"
      >
        <DialogTitle className="file-dialog-title">
          انتخاب فایل
          <IconButton onClick={handleCloseFileModal} disabled={uploading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box className="file-dialog-content">
            <Box className="file-info-box">
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                فقط فایل‌های ZIP و RAR مجاز هستند
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  mt: 0.5,
                }}
              >
                حداکثر حجم فایل: 10 مگابایت
              </Typography>
            </Box>

            {fileError && (
              <Alert
                severity="error"
                onClose={() => setFileError('')}
                sx={{
                  width: '100%',
                }}
              >
                {fileError}
              </Alert>
            )}

            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{
                minWidth: 200,
                height: 50,
              }}
            >
              انتخاب فایل
              <input
                type="file"
                hidden
                accept=".zip,.rar"
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Box className="selected-file-box">
                <Typography fontWeight="bold">فایل انتخاب شده:</Typography>

                <Typography
                  sx={{
                    mt: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  {selectedFile.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  حجم فایل: {getFileSizeInMB(selectedFile)} MB
                </Typography>

                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{
                    mt: 1,
                  }}
                >
                  فایل معتبر است ✓
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            direction: 'rtl',
          }}
        >
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'در حال آپلود...' : 'آپلود'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* ACTION BUTTONS */}
      {/* ================================================= */}

      <Box className="message-actions">
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSend}
        >
          ارسال
        </Button>

        <Button variant="outlined" onClick={onClose}>
          انصراف
        </Button>
      </Box>
    </Box>
  );
};

export default OnMessage;
