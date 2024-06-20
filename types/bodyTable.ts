export type BodyTable = {
  id?: string;
  title?: string;
  name?: string;
  address?: string;
  manager?: object;
  renter?: object;

  showDelete?: boolean;
  modified?: boolean;
  isEdit?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  isNew?: boolean;
  selected?: boolean;
};
