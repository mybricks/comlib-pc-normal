export const createrCatelogEditor = ({ catelog, items, ifVisible }: { catelog: string, items: any[], ifVisible?: (e: any) => boolean }) => {
    return items.map(item => {
        return {
            catelog,
            ifVisible,
            ...item
        }
    });
};

export const compressImage = (file: File, quality = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Cannot get canvas context'));
                    return;
                }
                const maxWidth = 1920; // 最大宽度
                const maxHeight = 1080; // 最大高度
                let { width, height } = img;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }
                    resolve(new File([blob], file.name, { type: file.type, lastModified: file.lastModified }));
                }, file.type, quality);
            };
        };
        reader.onerror = (event) => {
            reject(new Error('Failed to read file'));
        };
    });
};
