import { saveAs } from 'file-saver';
import { AppSettings } from 'app/app-settings';

const settings: AppSettings = new AppSettings();

export const download = (filename, content, contentType, extension) => {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, `${filename}.${extension}`);
}
