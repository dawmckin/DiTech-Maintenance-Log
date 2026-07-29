export interface EmailRecipient {
    name: string,
    email: string,
    all_shifts: boolean,
    first_shift: boolean,
    second_shift: boolean,
    third_shift: boolean,
    enabled: boolean,
    created_at: string
}

export interface InsertResult {
    success: boolean;
    data?: EmailRecipient;
    error?: unknown;
}