import React from 'react'
import { CreateCommand } from '../_base/base-command';

export interface CriteriaXCriteriaFormCreateCommand extends CreateCommand{
    criteriaFormId?: string;
    criteriaId?: string;
    
}
