import EventEmitter from "events";
import { RestrictionType } from "../restrictions";
import { Trigger } from "../triggers";
import { RestrictionData } from "./command-manager";

export type RestrictionManager = EventEmitter & {
    registerRestriction: <RestrictionModel>(
        restriction: RestrictionType<RestrictionModel>
    ) => void;
    getRestrictionById: <RestrictionModel>(restrictionId: string) => RestrictionType<RestrictionModel> | undefined;
    runRestrictionPredicates(triggerData: Trigger, restrictionData: RestrictionData, restrictionsAreInherited: boolean): Promise<void>;
};
