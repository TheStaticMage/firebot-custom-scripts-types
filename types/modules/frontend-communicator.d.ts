/** A module for facilitating passing events to, and handling events raised by, the frontend. */
export type FrontendCommunicator = {
    /** Send a synchronous event to the frontend.
     * @template ExpectedArg The type of event data to supply.
     * @param eventName The name of the event to send.
     * @param data Data to provide to the event handler.
     */
    send<ExpectedArg = unknown>(
        eventName: string,
        data: ExpectedArg
    ): void;

    /** Handle a synchronous event triggered by the frontend.
     * @template ExpectedArgs The type of data provided with the event.
     * @template ReturnPayload The type of data returned from the event handler.
     * @param eventName The name of the event to handle.
     * @param callback A function to handle the event.
     */
    on<ExpectedArgs extends Array<unknown> = [], ReturnPayload = void>(
        eventName: string,
        callback: (...args: ExpectedArgs) => ReturnPayload
    ): void;

    /** Handle an asynchronous event triggered by the frontend.
     * @template ExpectedArgs The type of data provided with the event.
     * @template ReturnPayload The type of data returned from the event handler.
     * @param eventName The name of the event to handle asynchronously.
     * @param callback A function to asynchronously handle the event.
     */
    onAsync<ExpectedArgs extends Array<unknown> = [], ReturnPayload = void>(
        eventName: string,
        callback: (...args: ExpectedArgs) => Promise<ReturnPayload>
    ): void;

    /** Send an asynchronous event to the frontend that is capable of returning a result.
     * @template ReturnPayload The type of data returned from the event handler.
     * @template ExpectedArg The type of data provided with the event.
     * @param eventName The name of the event to send.
     * @param data The data to provide with the event.
     */
    fireEventAsync<ReturnPayload = void, ExpectedArg = unknown>(
        eventName: string,
        data: ExpectedArg
    ): Promise<ReturnPayload>;
};
