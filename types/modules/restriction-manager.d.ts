import EventEmitter from "events";
import { RestrictionData } from "./command-manager";
import { RestrictionType } from "../restrictions";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

export type RestrictionManager = EventEmitter & {
    registerRestriction: <RestrictionModel>(
        restriction: RestrictionType<RestrictionModel>
    ) => void;
    getRestrictionById: <RestrictionModel>(restrictionId: string) => RestrictionType<RestrictionModel> | undefined;
    runRestrictionPredicates(triggerData: Effects.Trigger, restrictionData: RestrictionData, restrictionsAreInherited: boolean): Promise<void>;
};
