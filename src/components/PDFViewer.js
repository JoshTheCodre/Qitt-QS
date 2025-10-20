"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Download } from "lucide-react";

// Dynamically import react-pdf components (client-side only)
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import("react-pdf").then((mod) => mod.Page),
  { ssr: false }
);

// Configure PDF.js worker and import CSS (only on client)
if (typeof window !== "undefined") {
  // Import CSS dynamically on client side
  import("react-pdf/dist/Page/AnnotationLayer.css");
  import("react-pdf/dist/Page/TextLayer.css");
  
  // Configure worker
  import("react-pdf").then((mod) => {
    mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  });
}

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileErr, setFileErr] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setFileErr(null);
      setFileData(null);
      if (!fileUrl) return;

      try {
        setLoadingFile(true);
        console.log("Fetching PDF from:", fileUrl);
        
        // Try direct URL first (for Firebase Storage URLs with download tokens)
        if (!aborted) {
          setFileData(fileUrl);
        }
      } catch (e) {
        console.error("PDF error:", e);
        const errorMsg = e && e.message ? e.message : "Failed to load PDF";
        if (!aborted) setFileErr(`${errorMsg}`);
      } finally {
        if (!aborted) setLoadingFile(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onDocumentLoadError(err) {
    console.error("Error loading PDF:", err);
  }

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages || p, p + 1));
  const zoomIn = () => setScale((s) => Math.min(3, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "document.pdf";
    link.click();
  };

  if (!fileUrl) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Document Available</h3>
          <p className="text-gray-600">The document file is not available for viewing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Controls */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!Number.isNaN(num) && num >= 1 && (numPages ? num <= numPages : true)) {
                  setPageNumber(num);
                }
              }}
              className="w-16 px-2 py-1 text-center bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-[#0a32f8]"
              min={1}
              max={numPages || 1}
            />
            <span className="text-sm text-gray-300">of {numPages ?? "…"}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <span className="text-sm text-gray-300 min-w-[60px] text-center font-medium">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-gray-600 mx-2"></div>

          <button onClick={handleDownload} className="p-2 hover:bg-gray-700 rounded transition text-white" title="Download PDF">
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded transition text-white"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto bg-gray-900 flex justify-center items-start p-4">
        {!mounted ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : loadingFile ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : fileErr ? (
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading PDF</h3>
            <p className="text-sm text-red-300 mb-4 break-words">{fileErr}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => location.reload()}
                className="px-4 py-2 bg-[#0a32f8] text-white rounded-lg hover:bg-[#0829d1] transition"
              >
                Try Again
              </button>
              {fileUrl && (
                <button
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Open PDF in New Tab
                </button>
              )}
            </div>
          </div>
        ) : fileData ? (
          <Document
            file={fileData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("Document load error:", err);
              setFileErr(err.message || "Failed to render PDF");
            }}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
              cMapPacked: true,
              standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
            }}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="w-16 h-16 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
            error={
              <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Error Rendering PDF</h3>
                <p className="text-sm text-red-300 mb-4">The PDF file could not be rendered.</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="w-12 h-12 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
              className="shadow-2xl"
            />
          </Document>
        ) : null}
      </div>
    </div>
  );
}
