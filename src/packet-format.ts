export enum PacketType {
    CONNECT = 0,
    DISCONNECT = 1,
    EVENT = 2,
    ACK = 3,
    CONNECT_ERROR = 4,
}

export type Packet = {
    id: number | undefined;
    type: PacketType;
    nsp: string;
    data: Record<string, unknown> | unknown[] | string | undefined;
};
