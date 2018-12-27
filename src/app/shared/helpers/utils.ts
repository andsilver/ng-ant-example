import { saveAs } from 'file-saver';
import { AppSettings } from 'app/app-settings';
import { formatDate as format } from '@angular/common';

const settings: AppSettings = new AppSettings();

export const download = (filename, content, contentType, extension) => {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, `${filename}.${extension}`);
}

export const formatDate = (date: Date) => {
  return format(date, settings.date_format, settings.locale);
}
