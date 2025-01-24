import {TagType} from "./tagType";

export interface Tag {
  id:number;
  selected: boolean;
  label: string;
  type: TagType;
  count: number;
  disabled: boolean;
}
