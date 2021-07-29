export declare type JsonValue = {
    [key: string]: JsonValue | number | string | unknown[];
};
export declare type Serializer<T> = (obj: T) => JsonValue;
export declare type Deserializer<T> = (obj: JsonValue) => T;
