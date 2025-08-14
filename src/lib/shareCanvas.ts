import html2canvas from 'html2canvas';

/**
 * Generate a shareable canvas image from a DOM element
 */
export async function generateShareableImage(
  elementId: string,
  options?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }
): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: options?.backgroundColor || '#ffffff',
      scale: 2, // Higher quality
      width: options?.width || element.offsetWidth,
      height: options?.height || element.offsetHeight,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) => {
        // Ignore certain elements that might cause issues
        return element.classList.contains('no-capture');
      }
    });
    
    return canvas.toDataURL('image/png', 0.9);
  } catch (error) {
    console.error('Error generating shareable image:', error);
    throw new Error('Failed to generate shareable image');
  }
}

/**
 * Download an image from a data URL
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Share an image using the Web Share API (if available)
 */
export async function shareImage(dataUrl: string, title: string, text: string) {
  if (!navigator.share) {
    // Fallback: copy to clipboard or download
    throw new Error('Web Share API not supported');
  }
  
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'sleep-plan.png', { type: 'image/png' });
    
    await navigator.share({
      title,
      text,
      files: [file]
    });
  } catch (error) {
    console.error('Error sharing image:', error);
    throw error;
  }
}