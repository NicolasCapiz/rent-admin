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
  delete?: boolean;
  selected?: boolean;
};
