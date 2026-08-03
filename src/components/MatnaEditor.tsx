import { useSnackbar } from '@/hooks/useSnackbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { CopyAll, Print } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import {
  Alignment,
  Bold,
  ClassicEditor,
  Essentials,
  Font,
  Heading,
  Image,
  ImageEditing,
  ImageResize,
  Indent,
  Italic,
  List,
  Paragraph,
  Table,
  TableToolbar,
  Undo,
} from 'ckeditor5';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

function MatnaEditor(props: {
  onChange: (_, myeditor) => void;
  initialData: string;
}) {
  const ref = useRef(null);
  const snackbar = useSnackbar();

  const handlePrint = useReactToPrint({
    contentRef: ref,
    pageStyle: `
    @page{
      size: A4;
      margin 20mm;
    }

    body {
      direcion: rtl;
    }

  .ck-content {
    direcion: rtl;
    unicode-bidi: embed;
    text-align: righ;
  }
    `,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(props.initialData);
    snackbar("متن به صورت html کپی شد.", 'success', 2000);
  }

  return (
    <>
      <Stack>
        <Stack direction={'row'} pb={1}>
          <Button
            variant="contained"
            color="success"
            sx={{ width: '100px', margin: 1 }}
            onClick={handlePrint}
          >
            <Print /> &nbsp; چاپ
          </Button>
          <Button
            variant="contained"
            color='primary'
            sx={{ width: '100px', margin: 1 }}
            onClick={handleCopy}
          >
            <CopyAll /> &nbsp; کپی
          </Button>
        </Stack>
        <div
          style={{
            width: '750px',
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            id="document"
            onChange={props.onChange}
            config={{
              table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
              },
              toolbar: {
                items: [
                  'undo',
                  'redo',
                  '|',
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'fontColor',
                  '|',
                  'bulletedList',
                  'numberedList',
                  'indent',
                  'outdent',
                  '|',
                  'alignment',
                  'ckboxImageEdit',
                  '|',
                  'fontSize',
                  'insertTable',
                ],
              },
              plugins: [
                Table,
                TableToolbar,
                Bold,
                Font,
                Essentials,
                Alignment,
                Bold,
                Italic,
                Paragraph,
                Undo,
                Indent,
                List,
                Heading,
                Image,
                ImageEditing,
                ImageResize,
              ],
              licenseKey: 'GPL',
              initialData: props.initialData,
              language: {
                ui: 'en',
                content: 'fa',
              },
            }}
            onReady={(editor) => {
              editor.editing.view.change((writer) => {
                writer.setStyle('font-family', 'Vazirmatn', editor.editing.view.document.getRoot())
              })
            }}
          />
        </div>
        <div style={{height: 20}}/>
      </Stack>
      <div style={{ display: 'none' }}>
        <div
          ref={ref}
          className="ck-content"
          dir="rtl"
          style={{fontFamily: 'Vazirmatn'}}
          dangerouslySetInnerHTML={{ __html: props.initialData }}
        />
      </div>
    </>
  );
}

export default MatnaEditor;
