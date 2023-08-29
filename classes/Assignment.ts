import { Entity } from './Entity';

type AssignmentData = {
  title: string;
  startDate: string;
  endDate: string;
  weight: number;
  category: string;
};

export class Assignment extends Entity<AssignmentData> {
  public static tableName = 'Assignment';

  public constructor(data: AssignmentData) {
    super('Assignment', data);
  }

  public get startDate() {
    return new Date(Date.parse(this.data.startDate));
  }

  public get endDate() {
    return new Date(Date.parse(this.data.endDate));
  }
}
