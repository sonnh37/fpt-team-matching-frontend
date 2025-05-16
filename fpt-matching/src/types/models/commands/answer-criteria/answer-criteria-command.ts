import { CriteriaValueType } from "@/types/enums/criteria";
import { CreateCommand } from "../_base/base-command";

export interface AnswerCriteriaCreateCommand extends CreateCommand{
    topicVersionRequestId?: string;
    criteriaId?: string;
    value?:string;
}