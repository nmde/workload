import { Entity } from './Entity';

type CategoryData = {
  name: string;
  color: string;
};

export class Category extends Entity<CategoryData> {
  public constructor(data: CategoryData) {
    super('Category', data);
  }
}
