// Branded types prevent accidentally passing a RoomId where a PlayerId is expected
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type UserId     = Brand<string, 'UserId'>;
export type CharacterId = Brand<string, 'CharacterId'>;
export type RoomId     = Brand<string, 'RoomId'>;
export type ItemId     = Brand<string, 'ItemId'>;

export const asUserId      = (id: string): UserId      => id as UserId;
export const asCharacterId = (id: string): CharacterId => id as CharacterId;
export const asRoomId      = (id: string): RoomId      => id as RoomId;
export const asItemId      = (id: string): ItemId      => id as ItemId;
