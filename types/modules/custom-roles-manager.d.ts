export type CustomRolesManager = {
    getAllCustomRolesForViewer(userId: string): CustomRole[];
    userIsInRole(userId: string, userTwitchRoles: string[], roleIdsToCheck: string[]): boolean;
};

export interface CustomRole {
    id: string;
    name: string;
    viewers: Array<{
        id: string;
        username: string;
        displayName: string;
    }>;
}
