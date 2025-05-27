export const getCleanFilePath = (filePath: string) => {
    const parts = filePath.split('/');
    const cleanFilePath = parts.length > 1 ? parts[parts.length - 1] : filePath;
    return cleanFilePath;
};
