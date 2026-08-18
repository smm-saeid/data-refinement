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

import {
  useEditor,
  EditorContent,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';

import { Extension } from '@tiptap/core';


// =====================================================
// Props
// =====================================================

interface OnMessageProps {
  onClose: () => void;
}


// =====================================================
// User
// =====================================================

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UsersResponse {
  users: User[];
}


// =====================================================
// Font Family Extension
// =====================================================

const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],

        attributes: {
          fontFamily: {
            default: null,

            parseHTML: (element) =>
              element.style.fontFamily || null,

            renderHTML: (attributes) => {
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

            parseHTML: (element) =>
              element.style.fontSize || null,

            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ commands }: any) => {
          return commands.setMark('textStyle', {
            fontFamily,
          });
        },

      unsetFontFamily:
        () =>
        ({ commands }: any) => {
          return commands.setMark('textStyle', {
            fontFamily: null,
          });
        },

      setFontSize:
        (fontSize: string) =>
        ({ commands }: any) => {
          return commands.setMark('textStyle', {
            fontSize,
          });
        },

      unsetFontSize:
        () =>
        ({ commands }: any) => {
          return commands.setMark('textStyle', {
            fontSize: null,
          });
        },
    };
  },
});


// =====================================================
// محدودیت فایل
// =====================================================

// حداکثر 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// فقط ZIP و RAR
const ALLOWED_FILE_EXTENSIONS = [
  '.zip',
  '.rar',
];


// =====================================================
// Component
// =====================================================

const OnMessage = ({
  onClose,
}: OnMessageProps) => {

  // =====================================================
  // کاربران
  // =====================================================

  const [users, setUsers] =
    useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] =
    useState<User[]>([]);

  const [loadingUsers, setLoadingUsers] =
    useState(false);


  // =====================================================
  // پیام
  // =====================================================

  const [title, setTitle] =
    useState('');

  const [text, setText] =
    useState('');


  // =====================================================
  // فایل
  // =====================================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [fileModalOpen, setFileModalOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [fileError, setFileError] =
    useState('');


  // =====================================================
  // Editor
  // =====================================================

  const editor = useEditor({

    extensions: [

      StarterKit,

      TextStyle,

      Underline,

      TextAlign.configure({
        types: [
          'heading',
          'paragraph',
        ],
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
    ],

    content: '',

    editorProps: {
      attributes: {
        dir: 'rtl',
      },
    },

    onUpdate: ({
      editor,
    }) => {
      setText(
        editor.getHTML(),
      );
    },
  });


  // =====================================================
  // دریافت کاربران
  // =====================================================

  useEffect(() => {

    const getUsers = async () => {

      try {

        setLoadingUsers(true);

        const response =
          await fetch(
            'https://dummyjson.com/users',
          );

        if (!response.ok) {
          throw new Error(
            'خطا در دریافت کاربران',
          );
        }

        const data: UsersResponse =
          await response.json();

        setUsers(
          data.users,
        );

      } catch (error) {

        console.error(
          'Get users error:',
          error,
        );

      } finally {

        setLoadingUsers(false);

      }
    };

    getUsers();

  }, []);


  // =====================================================
  // بررسی فایل
  // =====================================================

  const isAllowedFile = (
    file: File,
  ) => {

    const fileName =
      file.name.toLowerCase();

    return ALLOWED_FILE_EXTENSIONS.some(
      (extension) =>
        fileName.endsWith(extension),
    );
  };


  // =====================================================
  // باز کردن Modal فایل
  // =====================================================

  const handleOpenFileModal = () => {

    setFileError('');

    setFileModalOpen(true);
  };


  // =====================================================
  // بستن Modal فایل
  // =====================================================

  const handleCloseFileModal = () => {

    setFileError('');

    setFileModalOpen(false);
  };


  // =====================================================
  // انتخاب فایل
  // =====================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      return;
    }

    setFileError('');


    // بررسی فرمت

    if (!isAllowedFile(file)) {

      setFileError(
        'فقط فایل‌های ZIP و RAR مجاز هستند.',
      );

      event.target.value = '';

      setSelectedFile(null);

      return;
    }


    // بررسی حجم

    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      setFileError(
        'حجم فایل نباید بیشتر از 10 مگابایت باشد.',
      );

      event.target.value = '';

      setSelectedFile(null);

      return;
    }


    setSelectedFile(file);
  };


  // =====================================================
  // آپلود فایل
  // =====================================================

  const handleUpload = async () => {

    setFileError('');

    if (!selectedFile) {

      setFileError(
        'لطفاً ابتدا یک فایل انتخاب کنید.',
      );

      return;
    }


    if (
      !isAllowedFile(
        selectedFile,
      )
    ) {

      setFileError(
        'فقط فایل‌های ZIP و RAR مجاز هستند.',
      );

      return;
    }


    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {

      setFileError(
        'حجم فایل نباید بیشتر از 10 مگابایت باشد.',
      );

      return;
    }


    try {

      setUploading(true);

      // شبیه‌سازی آپلود

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000,
          ),
      );

      console.log(
        'فایل آپلود شد:',
        selectedFile,
      );

      setFileModalOpen(false);

    } catch (error) {

      console.error(
        'Upload error:',
        error,
      );

      setFileError(
        'آپلود فایل با خطا مواجه شد.',
      );

    } finally {

      setUploading(false);

    }
  };


  // =====================================================
  // حذف گیرنده با دابل کلیک
  // =====================================================

  const handleRemoveRecipient = (
    userId: number,
  ) => {

    setSelectedUsers(
      (prev) =>
        prev.filter(
          (user) =>
            user.id !== userId,
        ),
    );
  };


  // =====================================================
  // انتخاب فونت
  // =====================================================

  const handleFontFamily = (
    event: SelectChangeEvent<string>,
  ) => {

    if (!editor) {
      return;
    }

    const font =
      event.target.value;

    editor
      .chain()
      .focus()
      .setMark(
        'textStyle',
        {
          fontFamily: font,
        },
      )
      .run();
  };


  // =====================================================
  // انتخاب اندازه فونت
  // =====================================================

  const handleFontSize = (
    event: SelectChangeEvent<string>,
  ) => {

    if (!editor) {
      return;
    }

    const size =
      event.target.value;

    editor
      .chain()
      .focus()
      .setMark(
        'textStyle',
        {
          fontSize: size,
        },
      )
      .run();
  };


  // =====================================================
  // لینک
  // =====================================================

  const handleSetLink = () => {

    if (!editor) {
      return;
    }

    const previousUrl =
      editor.getAttributes(
        'link',
      ).href;

    const url =
      window.prompt(
        'آدرس لینک را وارد کنید:',
        previousUrl ||
          'https://',
      );

    if (url === null) {
      return;
    }

    if (url === '') {

      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

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


  // =====================================================
  // رنگ متن
  // =====================================================

  const handleTextColor = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setMark(
        'textStyle',
        {
          color:
            event.target.value,
        },
      )
      .run();
  };


  // =====================================================
  // هایلایت
  // =====================================================

  const handleHighlight = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHighlight({
        color:
          event.target.value,
      })
      .run();
  };


  // =====================================================
  // ارسال پیام
  // =====================================================

  const handleSend = () => {

    if (
      selectedUsers.length ===
      0
    ) {

      console.log(
        'لطفاً حداقل یک گیرنده انتخاب کنید.',
      );

      return;
    }

    console.log(
      'عنوان:',
      title,
    );

    console.log(
      'متن HTML:',
      text,
    );

    console.log(
      'گیرندگان:',
      selectedUsers,
    );

    console.log(
      'فایل:',
      selectedFile,
    );

    onClose();
  };


  // =====================================================
  // حجم فایل
  // =====================================================

  const getFileSizeInMB = (
    file: File,
  ) => {

    return (
      file.size /
      (1024 * 1024)
    ).toFixed(2);
  };


  // =====================================================
  // Editor آماده نیست
  // =====================================================

  if (!editor) {
    return null;
  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <Box sx={{ p: 1 }}>

      {/* ================================================= */}
      {/* عنوان پیام */}
      {/* ================================================= */}

      <TextField
        label="عنوان پیام"
        placeholder="عنوان پیام را وارد کنید"
        value={title}
        onChange={(event) =>
          setTitle(
            event.target.value,
          )
        }
        sx={{
          mb: 2,
          width: '50%',
        }}
      />


      {/* ================================================= */}
      {/* ویرایشگر متن */}
      {/* ================================================= */}

      <Box
        sx={{
          mb: 2,
          border: '1px solid',
          borderColor:
            'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >

        {/* Toolbar */}

        <Box
          sx={{
            display: 'flex',
            alignItems:
              'center',
            flexWrap:
              'wrap',
            gap: 0.5,
            p: 1,
            backgroundColor:
              'background.default',
            borderBottom:
              '1px solid',
            borderColor:
              'divider',
          }}
        >

          {/* Bold */}

          <Tooltip title="ضخیم">
            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBold()
                  .run()
              }
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>


          {/* Italic */}

          <Tooltip title="کج">
            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleItalic()
                  .run()
              }
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>


          {/* Underline */}

          <Tooltip title="زیرخط">
            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleUnderline()
                  .run()
              }
            >
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>


          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
            }}
          />


          {/* ================================================= */}
          {/* فونت */}
          {/* ================================================= */}

          <FormControl
            size="small"
            sx={{
              minWidth: 190,
            }}
          >

            <InputLabel>
              نوع متن
            </InputLabel>

            <Select
              label="نوع متن"
              defaultValue="Arial"
              onChange={
                handleFontFamily
              }
            >

              <MenuItem
                value="Arial"
                sx={{
                  fontFamily:
                    'Arial',
                }}
              >
                Arial
              </MenuItem>

              <MenuItem
                value="Calibri"
                sx={{
                  fontFamily:
                    'Calibri',
                }}
              >
                Calibri
              </MenuItem>

              <MenuItem
                value="'Times New Roman'"
                sx={{
                  fontFamily:
                    'Times New Roman',
                }}
              >
                Times New Roman
              </MenuItem>

              <MenuItem
                value="'B Nazanin'"
                sx={{
                  fontFamily:
                    'B Nazanin',
                }}
              >
                B Nazanin
              </MenuItem>

              <MenuItem
                value="'B Titr'"
                sx={{
                  fontFamily:
                    'B Titr',
                }}
              >
                B Titr
              </MenuItem>

              <MenuItem
                value="'B Mitra'"
                sx={{
                  fontFamily:
                    'B Mitra',
                }}
              >
                B Mitra
              </MenuItem>

              <MenuItem
                value="'B Yekan'"
                sx={{
                  fontFamily:
                    'B Yekan',
                }}
              >
                B Yekan
              </MenuItem>

              <MenuItem
                value="Tahoma"
                sx={{
                  fontFamily:
                    'Tahoma',
                }}
              >
                Tahoma
              </MenuItem>

              <MenuItem
                value="Verdana"
                sx={{
                  fontFamily:
                    'Verdana',
                }}
              >
                Verdana
              </MenuItem>

            </Select>

          </FormControl>


          {/* ================================================= */}
          {/* اندازه فونت */}
          {/* ================================================= */}

          <FormControl
            size="small"
            sx={{
              minWidth: 100,
            }}
          >

            <InputLabel>
              اندازه
            </InputLabel>

            <Select
              label="اندازه"
              defaultValue="16px"
              onChange={
                handleFontSize
              }
            >

              <MenuItem value="12px">
                12
              </MenuItem>

              <MenuItem value="14px">
                14
              </MenuItem>

              <MenuItem value="16px">
                16
              </MenuItem>

              <MenuItem value="18px">
                18
              </MenuItem>

              <MenuItem value="20px">
                20
              </MenuItem>

              <MenuItem value="24px">
                24
              </MenuItem>

              <MenuItem value="28px">
                28
              </MenuItem>

              <MenuItem value="32px">
                32
              </MenuItem>

              <MenuItem value="36px">
                36
              </MenuItem>

            </Select>

          </FormControl>


          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
            }}
          />


          {/* ================================================= */}
          {/* رنگ متن */}
          {/* ================================================= */}

          <Tooltip title="رنگ متن">

            <IconButton
              component="label"
              size="small"
            >

              <FormatColorTextIcon />

              <input
                type="color"
                hidden
                defaultValue="#000000"
                onChange={
                  handleTextColor
                }
              />

            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* هایلایت */}
          {/* ================================================= */}

          <Tooltip title="هایلایت">

            <IconButton
              component="label"
              size="small"
            >

              <HighlightIcon />

              <input
                type="color"
                hidden
                defaultValue="#fff59d"
                onChange={
                  handleHighlight
                }
              />

            </IconButton>

          </Tooltip>


          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
            }}
          />


          {/* ================================================= */}
          {/* لیست */}
          {/* ================================================= */}

          <Tooltip title="لیست نقطه‌ای">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleBulletList()
                  .run()
              }
            >
              <FormatListBulletedIcon />
            </IconButton>

          </Tooltip>


          <Tooltip title="لیست شماره‌ای">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleOrderedList()
                  .run()
              }
            >
              <FormatListNumberedIcon />
            </IconButton>

          </Tooltip>


          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
            }}
          />


          {/* ================================================= */}
          {/* راست‌چین */}
          {/* ================================================= */}

          <Tooltip title="راست‌چین">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(
                    'right',
                  )
                  .run()
              }
            >
              <FormatAlignRightIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* وسط‌چین */}
          {/* ================================================= */}

          <Tooltip title="وسط‌چین">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(
                    'center',
                  )
                  .run()
              }
            >
              <FormatAlignCenterIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* چپ‌چین */}
          {/* ================================================= */}

          <Tooltip title="چپ‌چین">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(
                    'left',
                  )
                  .run()
              }
            >
              <FormatAlignLeftIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* Justify */}
          {/* ================================================= */}

          <Tooltip title="تراز دوطرفه">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(
                    'justify',
                  )
                  .run()
              }
            >
              <FormatAlignJustifyIcon />
            </IconButton>

          </Tooltip>


          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
            }}
          />


          {/* ================================================= */}
          {/* لینک */}
          {/* ================================================= */}

          <Tooltip title="لینک">

            <IconButton
              size="small"
              onClick={
                handleSetLink
              }
            >
              <LinkIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* Undo */}
          {/* ================================================= */}

          <Tooltip title="بازگشت">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .undo()
                  .run()
              }
            >
              <UndoIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* Redo */}
          {/* ================================================= */}

          <Tooltip title="جلو">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .redo()
                  .run()
              }
            >
              <RedoIcon />
            </IconButton>

          </Tooltip>


          {/* ================================================= */}
          {/* پاک کردن قالب */}
          {/* ================================================= */}

          <Tooltip title="پاک کردن قالب‌بندی">

            <IconButton
              size="small"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .clearNodes()
                  .unsetAllMarks()
                  .run()
              }
            >
              <FormatClearIcon />
            </IconButton>

          </Tooltip>

        </Box>


        {/* ================================================= */}
        {/* متن */}
        {/* ================================================= */}

        <Box
          sx={{
            minHeight: 350,
            p: 2,

            '& .ProseMirror': {
              minHeight: 300,
              outline: 'none',
              direction: 'rtl',
              textAlign: 'right',
              fontSize: '16px',
              lineHeight: 1.8,
            },

            '& .ProseMirror p': {
              margin:
                '0 0 8px 0',
            },

            '& .ProseMirror ul': {
              paddingRight:
                '30px',
            },

            '& .ProseMirror ol': {
              paddingRight:
                '30px',
            },

            '& .ProseMirror a': {
              textDecoration:
                'underline',
            },
          }}
        >

          <EditorContent
            editor={editor}
          />

        </Box>

      </Box>


      {/* ================================================= */}
      {/* فایل + گیرندگان */}
      {/* ================================================= */}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: 2,
          mb: 2,
        }}
      >

        {/* فایل */}

        <Button
          variant="outlined"
          startIcon={
            <AttachFileIcon />
          }
          onClick={
            handleOpenFileModal
          }
          sx={{
            height: 56,
            justifyContent:
              'flex-start',
            overflow: 'hidden',
            textOverflow:
              'ellipsis',
            whiteSpace:
              'nowrap',
          }}
        >
          {selectedFile
            ? selectedFile.name
            : 'فایل ضمیمه'}
        </Button>


        {/* ================================================= */}
        {/* گیرندگان */}
        {/* ================================================= */}

        <Autocomplete
          multiple
          fullWidth
          options={users}
          value={selectedUsers}
          loading={loadingUsers}

          onChange={(
            _,
            newValue,
          ) => {
            setSelectedUsers(
              newValue,
            );
          }}

          getOptionLabel={(user) =>
            `${user.firstName} ${user.lastName}`
          }

          isOptionEqualToValue={(
            option,
            value,
          ) =>
            option.id ===
            value.id
          }

          renderTags={(value) =>
            value.map(
              (user) => (

                <Tooltip
                  key={user.id}
                  title="برای حذف، دابل‌کلیک کنید"
                >

                  <Box
                    component="span"
                    onDoubleClick={() =>
                      handleRemoveRecipient(
                        user.id,
                      )
                    }
                    sx={{
                      display:
                        'inline-flex',
                      alignItems:
                        'center',
                      px: 1.5,
                      py: 0.5,
                      mr: 0.5,
                      mb: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        'action.selected',
                      cursor:
                        'pointer',
                      userSelect:
                        'none',

                      '&:hover': {
                        backgroundColor:
                          'action.hover',
                      },
                    }}
                  >

                    {user.firstName}{' '}
                    {user.lastName}

                  </Box>

                </Tooltip>

              ),
            )
          }

          renderInput={(params) => (

            <TextField
              {...params}
              label="گیرندگان"
              placeholder={
                selectedUsers.length ===
                0
                  ? 'گیرندگان را انتخاب کنید'
                  : ''
              }
            />

          )}

        />

      </Box>


      {/* ================================================= */}
      {/* Modal فایل */}
      {/* ================================================= */}

      <Dialog
        open={fileModalOpen}
        onClose={
          handleCloseFileModal
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle
          sx={{
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
          }}
        >

          انتخاب فایل

          <IconButton
            onClick={
              handleCloseFileModal
            }
          >
            <CloseIcon />
          </IconButton>

        </DialogTitle>


        <DialogContent
          dividers
        >

          <Box
            sx={{
              display: 'flex',
              flexDirection:
                'column',
              alignItems:
                'center',
              gap: 2,
              py: 3,
            }}
          >

            {/* توضیحات */}

            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 1,
                bgcolor:
                  'background.default',
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                فقط فایل‌های ZIP و RAR
                مجاز هستند
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  mt: 0.5,
                }}
              >
                حداکثر حجم فایل:
                10 مگابایت
              </Typography>

            </Box>


            {/* خطا */}

            {fileError && (

              <Alert
                severity="error"
                onClose={() =>
                  setFileError('')
                }
                sx={{
                  width: '100%',
                }}
              >
                {fileError}
              </Alert>

            )}


            {/* انتخاب فایل */}

            <Button
              variant="outlined"
              component="label"
              startIcon={
                <AttachFileIcon />
              }
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
                onChange={
                  handleFileChange
                }
              />

            </Button>


            {/* فایل انتخاب شده */}

            {selectedFile && (

              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  border:
                    '1px solid',
                  borderColor:
                    'divider',
                  borderRadius: 1,
                }}
              >

                <Typography
                  fontWeight="bold"
                >
                  فایل انتخاب شده:
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    wordBreak:
                      'break-all',
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
                  حجم فایل:{' '}
                  {getFileSizeInMB(
                    selectedFile,
                  )}{' '}
                  MB
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


        {/* ================================================= */}
        {/* آپلود */}
        {/* ================================================= */}

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >

          <Button
            variant="contained"
            startIcon={
              <CloudUploadIcon />
            }
            disabled={
              !selectedFile ||
              uploading
            }
            onClick={
              handleUpload
            }
          >

            {uploading
              ? 'در حال آپلود...'
              : 'آپلود'}

          </Button>

        </DialogActions>

      </Dialog>


      {/* ================================================= */}
      {/* دکمه‌های اصلی */}
      {/* ================================================= */}

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'flex-end',
          gap: 1,
        }}
      >

        <Button
          variant="contained"
          startIcon={
            <SendIcon />
          }
          onClick={
            handleSend
          }
        >
          ارسال
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
        >
          انصراف
        </Button>

      </Box>

    </Box>
  );
};

export default OnMessage;