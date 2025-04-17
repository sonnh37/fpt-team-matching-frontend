import { CreateCommand } from "../_base/base-command";

export interface CriteriaCreateCommand extends CreateCommand{
    name?: string;
    description?: string;
    valueType?: string;
    
}