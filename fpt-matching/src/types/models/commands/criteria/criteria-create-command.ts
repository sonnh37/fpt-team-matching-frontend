import { CriteriaValueType } from "@/types/enums/criteria";
import { CreateCommand } from "../_base/base-command";

export interface CriteriaCreateCommand extends CreateCommand{
    question?: string;
    valueType?: CriteriaValueType;
    
}