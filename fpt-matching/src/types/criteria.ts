import { BaseEntity } from "./_base/base";


export interface Criteria extends BaseEntity {
  name?: string;
  description?: string;
  valueType?: string;

}