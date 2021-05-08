export declare function sign(payload: object, secretOrPrivateKey: string): Promise<string>;
export declare function verify(token: string): Promise<Record<string, any>>;
