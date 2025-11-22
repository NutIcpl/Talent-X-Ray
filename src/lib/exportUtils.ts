import html2canvas from 'html2canvas';

// Export table data to CSV
export function exportToCSV(data: any[], filename: string, headers: string[]) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '_')];
        // Handle values with commas by wrapping in quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// Export chart/component to PNG
export async function exportToPNG(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Error exporting to PNG:', error);
  }
}

// Export all charts to PNG
export async function exportAllChartsToPNG(chartIds: string[], baseFilename: string) {
  for (const chartId of chartIds) {
    await exportToPNG(chartId, `${baseFilename}-${chartId}`);
    // Small delay between exports
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
