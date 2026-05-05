/**
 * Convert a Google Drive share URL to a direct image URL.
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  // Already a direct URL
  if (url.includes("drive.google.com/uc?")) return url;
  // Extract file ID from various Drive URL formats
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  // Try id= param
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  return url;
}
