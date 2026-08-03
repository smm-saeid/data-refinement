export type baseInfoData = {
  id: string;
  key: string;
  value: string;
  isActive: boolean;
  orderNo: number | null;
  parentId: number | null;
  commonBaseTypeId?: number;
  commonBaseTypeName?: string;
  description?: string;
  className: string;
};
