// Common MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types
// Supported by LlamaParse: https://docs.cloud.llamaindex.ai/llamaparse/features/supported_document_types
const CSV = "text/csv";
const DOC = "application/msword";
const DOCX =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const JPG = "image/jpeg"; // Also includes JPEG
const PDF = "application/pdf";
const PNG = "image/png";
const RTF = "application/rtf";
const TXT = "text/plain";
const XLS = "application/vnd.ms-excel";
const XLSX =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Select a subset of the list above
export const FILE_TYPE_WHITELIST = [DOC, DOCX, PDF, RTF, TXT];
export const FILE_SIZE_LIMIT = 52_428_800; // in bytes (50MB)
