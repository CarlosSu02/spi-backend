export type TOutputTeacher = {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  contractTypeId: string;
  shiftId: string;
  userId: string;
  categoryName: string;
  contractTypeName: string;
  shiftName: string;
  undergrads: {
    id: string;
    name: string;
  }[];
  postgrads: {
    id: string;
    name: string;
  }[];
};
