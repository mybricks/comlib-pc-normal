import React from 'react';
import { PDFViewer, Document, Page, Image } from '@react-pdf/renderer';
export default () => {
  // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  //   'pdfjs-dist/build/pdf.worker.min.js',
  //   import.meta.url
  // ).toString();
  const pdf =
    'chrome-extension://mhnlakgilnojmhinhkckjpncpbhabphi/pages/pdf/web/viewer.html?file=https%3A%2F%2Foficinademultimedia.files.wordpress.com%2F2011%2F09%2Fmanual_audacity.pdf';
  const png =
    'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/90/c1/6f/90c16f10-d24a-6cf7-5cda-6f37ef950b6d/ReleaseAppIcon-0-1x_U007emarketing-0-7-0-85-220.png/1200x630wa.png';
  return (
    <PDFViewer>
      <Document>
        <Page size={"A4"} />
        <Image src={png}/>
      </Document>
    </PDFViewer>
  );
};
