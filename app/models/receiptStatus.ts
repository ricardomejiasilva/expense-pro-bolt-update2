export enum ReceiptStatus {
    None = 0,
    Missing = 1,
    Pending = 2,
    Complete = 3,
    Submitted = 4,
}

export const ReceiptStatusLabels: { [key in ReceiptStatus]: string } = {
    [ReceiptStatus.None]: 'N/A',
    [ReceiptStatus.Missing]: 'Missing Receipt',
    [ReceiptStatus.Pending]: 'Pending',
    [ReceiptStatus.Complete]: 'Complete',
    [ReceiptStatus.Submitted]: 'Submitted',
};

export const ReceiptStatusColors: {
    [key in ReceiptStatus]: [string, string, string?];
} = {
    [ReceiptStatus.None]: ['#D3D3D3', '#A9A9A9', '#808080'],
    [ReceiptStatus.Missing]: ['#FFFBE6', '#AD6800', '#874D00'],
    [ReceiptStatus.Pending]: ['#E2F2F8', '#385F68', '#46747E'],
    [ReceiptStatus.Complete]: ['#F3F3F3', '#6E6E6E', '#3C3C3C'],
    [ReceiptStatus.Submitted]: ['#E2F2F8', '#385F68', '#46747E'],
};
