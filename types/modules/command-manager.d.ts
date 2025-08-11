import { Effects } from "../effects";
import EffectList = Effects.EffectList;
import { FirebotChatMessage } from "../chat";

type CommandType = "system" | "custom";

type Cooldown = {
    /**
     * Global cooldown to use a command in seconds.
     */
    global: number | undefined;
    /**
     * Cooldown for each user to use a command in seconds.
     */
    user: number | undefined;
};

export type RestrictionData = {
    /**
     * Sets the command to only trigger when all/any/none of the restrictions pass.
     */
    mode: "all" | "any" | "none";
    /**
     * If a chat message should be sent when the restrictions are not met.
     */
    sendFailMessage: boolean;
    failMessage: string;
    restrictions: any[]; // ToDo: change when restriction-manager and companion types are added
};

export type SubCommand = BasicCommandDefinition & {
    arg: string;
    usage: string;
    minArgs?: number;
    regex?: boolean;
    fallback?: boolean;
};

export type CommandDefinition = {
    id?: string;
    name?: string;
    description?: string;
    type?: CommandType;
    createdBy?: string;
    createdAt?: Date | string;
    lastEditBy?: string | undefined;
    lastEditAt?: Date | string | undefined;
    /**
     * Describes how many times the command has been used in chat.
     */
    count?: number;
    active: boolean;
    trigger: string;
    triggerIsRegex?: boolean | undefined;
    scanWholeMessage?: boolean | undefined;
    aliases?: string[];
    usage?: string;
    /**
     * If the chat message that triggered the command should be deleted automatically.
     */
    autoDeleteTrigger?: boolean | undefined;
    /**
     * If the UI should show the edit page in simple or advanced mode.
     */
    simple?: boolean;
    /**
     * If the command should be hidden from the `!commands` list.
     */
    hidden?: boolean | undefined;
    ignoreStreamer?: boolean | undefined;
    ignoreBot?: boolean | undefined;
    ignoreWhispers?: boolean | undefined;
    /**
     * If a chat message should be sent when the command is tried to be used but
     * the cooldown is not yet over.
     */
    sendCooldownMessage?: boolean;
    useCustomCooldownMessage?: boolean;
    cooldownMessage?: string;
    baseCommandDescription?: string | undefined;
    sortTags?: string[];
    cooldown?: Cooldown | undefined;
    effects?: EffectList;
    restrictionData?: RestrictionData;
    subCommands?: SubCommand[] | undefined;
    fallbackSubcommand?: SubCommand | undefined;
    treatQuotedTextAsSingleArg?: boolean | undefined;
    minArgs?: number;
    options?: Record<string, any>;
    /**
     * Only set for currency system commands.
     */
    currency?: {
        name: string;
        id: string;
    };
    allowTriggerBySharedChat?: boolean | "inherit" | undefined;
};

type UserCommand = {
    trigger: string;
    args: string[];
    triggeredSubcmd?: SubCommand;
    isInvalidSubcommandTrigger: boolean;
    triggeredArg?: string;
    subcommandId?: string;
    commandSender: string;
    senderRoles: string[];
};

type SystemCommandTriggerEvent = {
    command: CommandDefinition;
    commandOptions: Record<string, any>;
    userCommand: UserCommand;
    chatMessage?: FirebotChatMessage;
};

type BasicCommandDefinition = Omit<
    CommandDefinition,
    | "type"
    | "createdBy"
    | "createdAt"
    | "lastEditBy"
    | "lastEditAt"
    | "count"
    | "simple"
>;

export type SystemCommand<CD extends CommandDefinition = CommandDefinition> = {
    definition: CD;
    onTriggerEvent: (
        event: SystemCommandTriggerEvent
    ) => PromiseLike<void> | void;
};

export type SystemCommandDefinition = CommandDefinition & {
    hideCooldowns?: boolean;
};

type CommandManager = {
    getAllActiveCommands: () => CommandDefinition[];
    triggerIsTaken: (trigger: string) => boolean;

    registerSystemCommand: (
        command: SystemCommand<BasicCommandDefinition>
    ) => void;
    unregisterSystemCommand: (id: string) => void;
    getSystemCommandById: (id: string) => SystemCommand | undefined;
    getSystemCommands: () => SystemCommand[];
    getSystemCommandTrigger: (id: string) => string | undefined;
    getAllSystemCommandDefinitions: () => CommandDefinition[];
    hasSystemCommand: (id: string) => boolean;

    getCustomCommandById: (id: string) => CommandDefinition | undefined;
    getAllCustomCommands: () => CommandDefinition[];
    /**
     * Creates a new custom command or updates an existing one.
     * @param command the command to create/update.
     * @param user the user making the change.
     * @param isNew if the command is a new one or if an existing one should be updated.
     *              Default: true.
     */
    saveCustomCommand: (
        command: CommandDefinition,
        user?: string,
        isNew?: boolean
    ) => void;
    removeCustomCommandByTrigger: (trigger: string) => void;
};
