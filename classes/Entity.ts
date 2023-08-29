export class Entity<T = any> {
  public static tableName = '';

  public constructor(
    public tableName: string,
    public data: T,
  ) {}
}
