import Database, { Database as IDatabase } from 'better-sqlite3'

class SQLite {
  private _db:IDatabase;
  constructor(pathDatabase:string) {
    this._db = new Database(pathDatabase);
  }

  public createTable(table:string):void{
    this._db.prepare(table).run();
  }


  /**
   * Esta é uma função para retornar determinados valores do banco de dados no padrão SELECT
   *
   * @param table - Nome da tabela do banco de dados
   * @param columns - Colunas do banco de dados a serem retornada. valor padrão: ['*']
   * @param where - opcional: Uma string para uma busca expecifica utilizando o sinal de interrogação (?) no valor exemplo: slug = ?
   * @param whereValues - opcional: uma string de valores que irão substituir os placeholder do where obs: Obrigatório no caso de where ser informado
   * @returns Retorno de Lista de objetos do tipo generico informado
   * */
  public selectAll<T>(table:string, columns:string[] = ['*'], where?:string, whereValues?:(string | number)[]):T[]{
    const columnsJoin:string = columns.join(',');
    let instruction:string = `SELECT ${columnsJoin} FROM ${table}`;

    if(where) instruction += `WHERE ${where}`;

    const select = this._db.prepare(instruction);
    let result:T[] = [];

    if(where && whereValues){
      result = select.all(...whereValues) as T[];
    } else {
      result = select.all() as T[];
    }
    return result;
  }


  /**
   * Esta é uma função para retornar um único valor do banco de dados no padrão SELECT
   *
   * @param table - Nome da tabela do banco de dados
   * @param columns - Colunas do banco de dados a serem retornada. valor padrão: ['*']
   * @param where - Uma string para uma busca expecifica utilizando o sinal de interrogação (?) no valor exemplo: slug = ?
   * @param whereValues - uma string de valores que irão substituir os placeholder do where
   * @returns Retorno de Lista de objetos do tipo generico informado
   * */
  public selectSingle<T>(table:string, columns:string[] = ['*'], where:string, whereValues:(string | number)[]):T{
    const columnsJoin:string = columns.join(',');
    const instruction:string = `SELECT ${columnsJoin} FROM ${table} WHERE ${where}`;

    const select = this._db.prepare(instruction);
    let result = select.get(...whereValues) as T;

    return result;
  }


  /**
   *
   * Função para deletar items no banco de dados
   *
   * @param table - Nome da tabela do banco de dados.
   * @param where - Uma string para uma busca expecifica utilizando o sinal de interrogação (?) no valor exemplo: slug = ?.
   * @param whereValues - uma string de valores que irão substituir os placeholder do where
   * @returns - Número de alterações no banco
   * */
  public deleteItem(table:string, where:string, whereValues:(string | number)[]):number{
    const instruction:string = `DELETE FROM ${table} WHERE ${where}`;
    const query = this._db.prepare(instruction);
    const result = query.run(...whereValues);

    return result.changes;
  }


  /**
   *
   * Função para inserção de dados no banco
   *
   * @param table - Nome da tabela do banco de dados.
   * @param columns - Um array com a as colunas a serem preenchidas na tabela
   * @param values - um array com os valores que serão inseridos no banco
   * @returns - Número de alterações no banco
   * */
  public insertData(table:string, columns:string[], values:(string | number)[]):number{
    let placeholder:string[] | string = [];
    for(let i=0; i < columns.length; i++){
      placeholder.push("?");
    }
    placeholder = placeholder.join(', ');

    const instruction = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholder})`;

    const insert = this._db.prepare(instruction);
    const result = insert.run(...values)
    return result.changes;
  }


}

export default SQLite;
