export interface FirebotViewer {
    _id: string;
    username: string;
    displayName: string;
    profilePicUrl: string;
    twitch: boolean;
    twitchRoles: string[];
    online: boolean;
    onlineAt: number;
    lastSeen: number;
    joinDate: number;
    minutesInChannel: number;
    chatMessages: number;
    disableAutoStatAccrual: boolean;
    disableActiveUserList: boolean;
    disableViewerList: boolean;
    metadata: Record<string, unknown>;
    currency: Record<string, number>;
    ranks: Record<string, string>;
}

export interface BasicViewer {
    id: string;
    username: string;
    displayName?: string;
    twitchRoles?: string[];
    profilePicUrl?: string;
}

export type ViewerDatabase = {
    /**
     * Creates a new user in the database. Returns the created user if successful.
     *
     * @param userId User's Twitch account ID
     * @param username Twitch username
     * @param displayName Twitch display name
     * @param profilePicUrl Profile pic URL, if available
     * @param twitchRoles List of role strings, if applicable
     * @param isOnline Whether the user is currently online, defaults to false
     */
    createNewViewer: (
        userId: string,
        username: string,
        displayName: string,
        profilePicUrl?: string,
        twitchRoles?: string[],
        isOnline?: boolean
    ) => Promise<FirebotViewer>;

    /**
     * Retrieves a viewer by their ID.
     * @param id The ID of the viewer to retrieve.
     */
    getViewerById: (id: string) => Promise<FirebotViewer | undefined>;

    /**
     * Retrieves a viewer by their username.
     * @param username The username of the viewer to retrieve.
     */
    getViewerByUsername: (username: string) => Promise<FirebotViewer | undefined>;

    /**
     * Gets all viewers in the database.
     * @returns A promise that resolves to an array of FirebotViewer objects.
     */
    getAllViewers: () => Promise<FirebotViewer[]>;

    getAllUsernames: () => Promise<string[]>;

    getAllUsernamesWithIds: () => Promise<{ id: string; username: string; displayName: string; }[]>;

    incrementDbField(userId: string, fieldName: string): Promise<void>;

    updateViewer(viewer: FirebotViewer): Promise<boolean>;

    updateViewerDataField(userId: string, field: string, value: unknown): Promise<void>;

    removeViewer(userId: string): Promise<boolean>;
};
