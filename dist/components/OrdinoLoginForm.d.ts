export declare function useGenerateRandomUser(): {
    status: import("tdp_core").useAsyncStatus;
    user: {
        username: string;
        password: string;
    };
};
export interface IOrdinoLoginFormProps {
    onLogin: (username: string, password: string) => Promise<void>;
}
/**
 * phovea_security_store_generated
 * @param param0
 * @returns
 */
export declare function OrdinoLoginForm({ onLogin }: IOrdinoLoginFormProps): JSX.Element;
//# sourceMappingURL=OrdinoLoginForm.d.ts.map