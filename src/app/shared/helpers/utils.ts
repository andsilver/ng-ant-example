import { saveAs } from 'file-saver';

export const download = (filename, content, contentType, extension) => {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, `${filename}.${extension}`);
}