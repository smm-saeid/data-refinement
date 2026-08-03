export type BaseInfoType = {
  id: string; 
  title: string; 
  className: string; 
  isActive: boolean; 
  parentId: number | null;
  description?: string; 
  createdAt?: string; 
  updatedAt?: string;
  commonBaseTypeId?: string;

};
