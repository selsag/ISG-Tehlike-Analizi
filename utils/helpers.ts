
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
};

export const getRiskSeviye = (skor: number): string => {
    if (skor <= 20) return 'Önemsiz Risk';
    if (skor <= 70) return 'Düşük Risk';
    if (skor <= 200) return 'Orta Risk';
    if (skor <= 400) return 'Önemli Risk';
    return 'Yüksek Risk';
};

export const toTitleCase = (str: string) => {
    return str.replace(/\S*/g, (word) => {
        return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLowerCase();
    });
};

export const toSentenceCase = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toLocaleUpperCase('tr-TR') + str.slice(1);
};

export const resizeImage = (file: File, maxWidth: number = 1024, quality: number = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context failure'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failure'));
                        return;
                    }
                    // Create a new file with the original name but jpeg extension/type usually preferred for compression
                    // Here keeping original name but forcing jpeg type for compression
                    const resizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(resizedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
