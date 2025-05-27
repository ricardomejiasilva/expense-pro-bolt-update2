/**
 * Date Conversion Utility Functions
 * @description This file contains functions to format date strings for display and storage.
 */

import { DateType } from 'react-native-ui-datepicker';

// Format a date string for display (e.g. yyyy-mm-dd to mm-dd-yyyy)
export const convertDateYmdToMdy = (dateString: string | null) => {
    if (!dateString) {
        return '';
    }

    if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('dateString is not in yyyy-mm-dd format');
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date string');
    }
    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
};

// Format a display string for storage (e.g. mm-dd-yyyy to yyyy-mm-dd)
export const convertDateMdyToYmd = (displayString: string) => {
    if (!displayString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        throw new Error('displayString is not in mm-dd-yyyy format');
    }

    const [month, day, year] = displayString.split('-');
    if (!month || !day || !year) {
        throw new Error('Invalid display string');
    }
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

// Format any Date or DateType to a string for storage (e.g. Date object to yyyy-mm-dd)
export const convertDateObjectToYmd = (date: Date | DateType | string | number) => {
    if (!date) {
        throw new Error('Invalid date object');
    }
    const dateObject =
        date instanceof Date
            ? date
            : new Date((date as any).toDate ? (date as any).toDate() : date);
    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date object');
    }
    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const formattedDate = `${month}-${day}-${year}`;
    return `${year}-${month}-${day}`;
};
