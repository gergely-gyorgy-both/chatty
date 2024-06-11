export interface MessageDto {
    text: string;
    senderUsername: string;
    dateMs: number;
    roomId?: string;
}
