import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PreviewDocumentProps {
  file: File;
}

export function PreviewDocument({ file }: PreviewDocumentProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const fileUrl = URL.createObjectURL(file);
    setUrl(fileUrl);
    return () => URL.revokeObjectURL(fileUrl);
  }, [file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="w-16 text-sm text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center p-4 bg-muted min-h-[600px] overflow-auto">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-muted-foreground">
                Đang tải tài liệu...
              </span>
            </div>
          }
          error={
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-destructive">
                Không thể tải tài liệu. Vui lòng kiểm tra lại định dạng file.
              </span>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </Card>
  );
}
