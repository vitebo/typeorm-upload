import fs from 'fs';
import csv from 'csv-parser';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  path: string;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  private createTransaction: CreateTransactionService;

  constructor() {
    this.createTransaction = new CreateTransactionService();
  }

  async execute({ path }: Request): Promise<Transaction[]> {
    const transactionsProps = await this.parseCsv(path);
    return this.createTransactions(transactionsProps);
  }

  private async createTransactions(
    transactionsProps: CreateTransactionDTO[],
  ): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    for (const prop of transactionsProps) {
      const transaction = await this.createTransaction.execute(prop);
      transactions.push(transaction);
    }
    return transactions;
  }

  private parseCsv(path: string): Promise<CreateTransactionDTO[]> {
    const result: CreateTransactionDTO[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim(),
          }),
        )
        .on('data', data => {
          result.push({ ...data, value: Number(data.value) });
        })
        .on('end', () => resolve(result))
        .on('error', error => reject(error));
    });
  }
}

export default ImportTransactionsService;
