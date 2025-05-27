import { ReceiptStatus } from 'models/fullReceipt';
import { ReceiptTransaction } from 'models/types';

export function getReceiptDueDate(fromDate = new Date()) {
    const date = new Date(fromDate.getTime());

    date.setHours(23, 59, 59, 999);

    const dayOfWeek = date.getDay();

    let daysUntilWednesday = (3 - dayOfWeek + 7) % 7;

    if (daysUntilWednesday === 0) {
        daysUntilWednesday = 7;
    }

    date.setDate(date.getDate() + daysUntilWednesday);

    date.setDate(date.getDate() - 1);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export function getReceiptDueDates() {
    const now = new Date();

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);

    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);

    return [startDate, endDate];
}

export function getReceiptStatusCounts(receiptData: ReceiptTransaction[]) {
    const counts: Record<ReceiptStatus, number> = {
        [ReceiptStatus.Missing]: 0,
        [ReceiptStatus.Pending]: 0,
        [ReceiptStatus.Complete]: 0,
        [ReceiptStatus.Submitted]: 0,
        [ReceiptStatus.None]: 0,
    };

    for (const receipt of receiptData) {
        counts[receipt.receiptStatus as ReceiptStatus] += 1;
    }

    return counts;
}
