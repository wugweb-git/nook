import { Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify';

/**
 * Export data to Excel format
 * @param res Express response object
 * @param data Data to export
 * @param filename Filename for the downloaded file
 */
export async function exportToExcel(res: Response, data: any[], filename: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  
  if (data.length > 0) {
    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value instanceof Date) {
          return value.toISOString().split('T')[0]; // Format dates as YYYY-MM-DD
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return value;
      });
      worksheet.addRow(row);
    });
    
    // Format headers to be bold
    worksheet.getRow(1).font = { bold: true };
  }
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
  
  await workbook.xlsx.write(res);
  res.end();
}

/**
 * Export data to CSV format
 * @param res Express response object
 * @param data Data to export
 * @param filename Filename for the downloaded file
 */
export function exportToCSV(res: Response, data: any[], filename: string): void {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
  
  if (data.length === 0) {
    res.end();
    return;
  }
  
  const stringifier = stringify({
    header: true,
    columns: Object.keys(data[0]).map(key => ({ key, header: key }))
  });
  
  stringifier.pipe(res);
  
  data.forEach(item => {
    const processedItem = { ...item };
    
    // Process data for CSV compatibility
    for (const key in processedItem) {
      const value = processedItem[key];
      if (value instanceof Date) {
        processedItem[key] = value.toISOString().split('T')[0]; // Format dates as YYYY-MM-DD
      } else if (typeof value === 'object' && value !== null) {
        processedItem[key] = JSON.stringify(value);
      }
    }
    
    stringifier.write(processedItem);
  });
  
  stringifier.end();
}

/**
 * Export data to PDF format
 * @param res Express response object
 * @param data Data to export
 * @param filename Filename for the downloaded file
 * @param title Title for the PDF document
 */
export function exportToPDF(res: Response, data: any[], filename: string, title: string): void {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
  
  doc.pipe(res);
  
  // Add title
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  
  if (data.length > 0) {
    const tableTop = 150;
    const headers = Object.keys(data[0]);
    
    // Calculate column widths based on page width
    const pageWidth = doc.page.width - 100; // 50pt margin on each side
    const colWidth = pageWidth / headers.length;
    
    // Draw headers
    doc.fontSize(12).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, 50 + (i * colWidth), tableTop, { width: colWidth, align: 'left' });
    });
    
    // Draw data rows
    doc.font('Helvetica');
    let rowTop = tableTop + 20;
    
    data.forEach((row, rowIndex) => {
      // Check if we need a new page
      if (rowTop > doc.page.height - 50) {
        doc.addPage();
        rowTop = 50;
      }
      
      headers.forEach((header, colIndex) => {
        let value = row[header];
        
        // Format values for display
        if (value instanceof Date) {
          value = value.toISOString().split('T')[0];
        } else if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        } else if (value === null || value === undefined) {
          value = '';
        }
        
        doc.fontSize(10).text(String(value), 50 + (colIndex * colWidth), rowTop, {
          width: colWidth,
          align: 'left'
        });
      });
      
      rowTop += 20;
    });
  } else {
    doc.fontSize(12).text('No data available', { align: 'center' });
  }
  
  doc.end();
}