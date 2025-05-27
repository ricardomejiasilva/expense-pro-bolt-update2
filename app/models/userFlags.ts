export enum UserFlags {
    None = 0,
    Admin = 1 << 1,      // 2
    SuperAdmin = 1 << 2, // 4
    ShortForm = 1 << 3,  // 8 
    Cardholder = 1 << 4, // 16 
}

export function hasFlag(flags: number, flag: UserFlags): boolean {
    return (flags & flag) === flag;
}

