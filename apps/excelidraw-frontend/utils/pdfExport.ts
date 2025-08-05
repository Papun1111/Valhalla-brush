import jsPDF from 'jspdf';


export interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'custom';
  orientation?: 'portrait' | 'landscape';
  includeBackground?: boolean;
}

export class PDFExporter {
  static async exportCanvasToPDF(
    canvas: HTMLCanvasElement,
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = 'drawing-export',
      quality = 1.0,
      format = 'a4',
      orientation = 'landscape',
      includeBackground = true
    } = options;

    try {
      // Create a temporary canvas with white background if needed
      const exportCanvas = document.createElement('canvas');
      const exportCtx = exportCanvas.getContext('2d')!;
      
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;

      // Add white background if specified
      if (includeBackground) {
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }

      // Draw the original canvas content
      exportCtx.drawImage(canvas, 0, 0);

      // Convert canvas to image data
      const imgData = exportCanvas.toDataURL('image/png', quality);

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      });

      // Calculate dimensions to fit the page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth = pdfWidth;
      let imgHeight = pdfHeight;

      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider than PDF page
        imgHeight = pdfWidth / canvasAspectRatio;
      } else {
        // Canvas is taller than PDF page
        imgWidth = pdfHeight * canvasAspectRatio;
      }

      // Center the image on the page
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      // Add metadata
      pdf.setProperties({
        title: `Drawing Export - ${new Date().toLocaleDateString()}`,
        subject: 'Canvas Drawing Export',
        author: 'Drawing App',
        creator: 'Canvas Drawing Application'
      });

      // Save the PDF
      pdf.save(`${filename}.pdf`);

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }

  static async exportHighQualityPDF(
    canvas: HTMLCanvasElement,
    options: ExportOptions = {}
  ): Promise<void> {
    // Create a high-resolution version for better PDF quality
    const scale = 2; // 2x resolution
    const highResCanvas = document.createElement('canvas');
    const highResCtx = highResCanvas.getContext('2d')!;

    highResCanvas.width = canvas.width * scale;
    highResCanvas.height = canvas.height * scale;

    highResCtx.scale(scale, scale);
    highResCtx.drawImage(canvas, 0, 0);

    return this.exportCanvasToPDF(highResCanvas, {
      ...options,
      quality: 0.95
    });
  }
}
