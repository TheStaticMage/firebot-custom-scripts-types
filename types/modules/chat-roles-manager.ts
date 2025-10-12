import { BasicViewer } from "./viewer-database";

export type ChatRolesManager = {
    userIsKnownBot(userId: string): Promise<boolean>;
    getVips(): Promise<BasicViewer[]>;
    getUsersChatRoles(userId: string): Promise<string[]>;
};
