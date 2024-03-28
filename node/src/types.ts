export type Result = {
  parentId: number;
  id: number;
  status: string;
  data: any;
};
export type ProcessedTask = {
  parentId: number;
  id: number;
  code: string;
  args: any[];
};
