import Database from 'tauri-plugin-sql-api';
import { Entity } from './Entity';
import { Constructor } from '~/types/Constructor';

export class TauriDatabase {
  private connected = false;

  private database!: Database;

  public constructor(public path: string) {}

  /**
   * Safely gets the local database connection.
   * @returns
   */
  private async getConnection() {
    if (!this.connected) {
      this.database = await Database.load(this.path);
    }
    return this.database;
  }

  /**
   * Ensures a table exists.
   * @param entity - The entity to model the table after.
   */
  private async ensureTable(entity: Entity) {
    let query = `CREATE TABLE IF NOT EXISTS ${entity.tableName} (`;
    Object.entries(entity.data).forEach(([name, value]) => {
      let str = `${name} `;
      if (typeof value === 'number') {
        str += 'INTEGER';
      } else if (typeof value === 'string') {
        str += 'TEXT';
      } else {
        throw new Error(`Unhandled data type for ${name}!`);
      }
      query += `${str}, `;
    });
    query = query.substring(0, query.length - 2);
    query += `)`;
    await this.execute(query);
  }

  /**
   * Shortcut for safely executing a SQL query.
   * @param query - The query to execute.
   */
  private async execute(query: string) {
    console.log(query);
    return await (await this.getConnection()).execute(query);
  }

  /**
   * Inserts items into a table.
   * @param into
   */
  public async insert(entity: Entity) {
    await this.ensureTable(entity);
    let query = `INSERT INTO ${entity.tableName} (`;
    let values = '';
    Object.keys(entity.data).forEach((name) => {
      query += `${name}, `;
      if (typeof entity.data[name] === 'string') {
        values += `'${entity.data[name]}', `;
      } else if (typeof entity.data[name] === 'number') {
        values += `${entity.data[name]}, `;
      } else {
        throw new Error(`Unhandled data type for ${name}!`);
      }
    });
    query = query.substring(0, query.length - 2);
    values = values.substring(0, values.length - 2);
    query += `) VALUES (${values})`;
    await this.execute(query);
  }

  /**
   * Performs a SELECT query.
   * @param query - The query to run.
   */
  private async select(query: string): Promise<any[]> {
    console.log(query);
    return await (await this.getConnection()).select(query);
  }

  /**
   * Selects and returns all entries from the given table.
   * @param from
   */
  public async selectAll<T extends Entity>(From: Constructor<T>): Promise<T[]> {
    try {
      const dummy = new From();
      return (await this.select(`SELECT * FROM ${dummy.tableName}`)).map(
        (result) => {
          return new From(result);
        },
      );
    } catch (err) {
      return [];
    }
  }
}
