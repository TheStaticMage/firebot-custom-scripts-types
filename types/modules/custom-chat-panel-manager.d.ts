/** Position for injecting a custom chat panel. */
export type CustomChatPanelPosition =
    | "append"
    | "prepend"
    | { afterMessageId: string }
    | { beforeMessageId: string };

/** Data required to inject a custom chat panel into the chat feed. */
export type InjectChatPanelData = {
    /**
     * The name of the AngularJS component to render.
     * This component must be registered via UIExtensionManager before injection.
     */
    componentName: string;

    /**
     * Optional data to pass to the component.
     * This will be bound to the component's `data` binding.
     */
    componentData?: unknown;

    /**
     * Position where the panel should be inserted in the chat feed.
     * - "append": Add to end of chat queue (default)
     * - "prepend": Add to beginning of chat queue
     * - { afterMessageId: "id" }: Insert immediately after the specified message
     * - { beforeMessageId: "id" }: Insert immediately before the specified message
     *
     * If the target message is not found, it will fallback to append/prepend with a console warning.
     */
    position?: CustomChatPanelPosition;

    /**
     * Optional unique identifier for the panel.
     * Required if you want to remove the panel later.
     * If not provided, a UUID will be auto-generated.
     */
    panelId?: string;

    /**
     * Optional flag to hide the panel in the chat feed.
     * If true, the panel will be injected but not displayed.
     * Can be toggled later using updatePanel().
     */
    hidden?: boolean;
};

/**
 * A module for injecting custom AngularJS components into Firebot's chat feed.
 *
 * @remarks
 * Custom chat panels allow plugins to inject arbitrary UI elements into the chat feed.
 * Panels are subject to the same pruning rules as regular chat messages.
 *
 * @example
 * ```typescript
 * // Step 1: Register an AngularJS component
 * modules.uiExtensionManager.registerUIExtension({
 *     id: "my-plugin",
 *     providers: {
 *         components: [{
 *             name: "myCustomPanel",
 *             template: `
 *                 <div style="background: hotpink; padding: 15px;">
 *                     <h3 style="color: white;">Hello from plugin!</h3>
 *                 </div>
 *             `
 *         }]
 *     }
 * });
 *
 * // Step 2: Inject the panel into the chat feed
 * modules.customChatPanelManager.injectPanel({
 *     componentName: "myCustomPanel",
 *     position: "append",
 *     panelId: "my-panel-1"
 * });
 *
 * // Step 3: Remove the panel later (optional)
 * modules.customChatPanelManager.removePanel("my-panel-1");
 * ```
 */
export type CustomChatPanelManager = {
    /**
     * Inject a custom panel into the chat feed.
     *
     * @param data - Configuration for the panel to inject.
     *
     * @remarks
     * The component specified in `componentName` must be registered with UIExtensionManager
     * before calling this method, otherwise the panel will fail to render silently.
     *
     * Panels are added to the chat queue and are subject to the same pruning rules as
     * regular messages (default: 75 messages displayed at once).
     *
     * @example
     * ```typescript
     * modules.customChatPanelManager.injectPanel({
     *     componentName: "myPanel",
     *     componentData: { message: "Hello!" },
     *     position: "append",
     *     panelId: "panel-" + Date.now()
     * });
     * ```
     */
    injectPanel(data: InjectChatPanelData): void;

    /**
     * Remove a previously injected panel from the chat feed.
     *
     * @param panelId - The unique ID of the panel to remove. This must match the
     *                  `panelId` provided when the panel was injected.
     *
     * @remarks
     * If the panel is not found (already pruned or never existed), this method
     * will log a warning but will not throw an error.
     *
     * @example
     * ```typescript
     * modules.customChatPanelManager.removePanel("my-panel-1");
     * ```
     */
    removePanel(panelId: string): void;

    /**
     * Update properties of an existing panel in the chat feed.
     *
     * @param data - Configuration containing the panel ID and updates to apply.
     *
     * @remarks
     * Only `hidden` and `componentData` can be updated. Other properties
     * like `componentName`, `id`, and `type` are immutable.
     *
     * If the panel is not found (already pruned or never existed), this method
     * will log a warning but will not throw an error.
     *
     * @example
     * ```typescript
     * // Hide a visible panel
     * modules.customChatPanelManager.updatePanel({
     *     panelId: "my-panel-1",
     *     updates: {
     *         hidden: true
     *     }
     * });
     *
     * // Update panel data
     * modules.customChatPanelManager.updatePanel({
     *     panelId: "my-panel-1",
     *     updates: {
     *         componentData: { newValue: "updated!" }
     *     }
     * });
     * ```
     */
    updatePanel(data: {
        panelId: string;
        updates: {
            hidden?: boolean;
            componentData?: unknown;
        };
    }): void;

    /**
     * Get the current properties of a panel by its ID.
     *
     * @param panelId - The unique ID of the panel to retrieve.
     * @returns A promise that resolves to the panel data, or null if not found.
     *
     * @remarks
     * This method queries the chat feed for the panel. If the panel has been
     * pruned or never existed, it will return null.
     *
     * The returned object contains:
     * - `id`: The panel's unique identifier
     * - `type`: Always "custom" for custom panels
     * - `hidden`: Whether the panel is currently hidden
     * - `componentName`: The registered component name
     * - `componentData`: The current data passed to the component
     *
     * @example
     * ```typescript
     * const panel = await modules.customChatPanelManager.getPanel("my-panel-1");
     * if (panel) {
     *     console.log(`Panel is ${panel.hidden ? "hidden" : "visible"}`);
     *     console.log(`Component data:`, panel.componentData);
     * } else {
     *     console.log("Panel not found");
     * }
     * ```
     */
    getPanel(panelId: string): Promise<{
        id: string;
        type: string;
        hidden?: boolean;
        componentName: string;
        componentData?: unknown;
    } | null>;
};
