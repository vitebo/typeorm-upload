import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = this.sumTheValueOfTransactionsByType(transactions, 'income');
    const outcome = this.sumTheValueOfTransactionsByType(
      transactions,
      'outcome',
    );
    const total = income - outcome;
    return { income, outcome, total };
  }

  private sumTheValueOfTransactionsByType(
    transactions: Transaction[],
    type: 'income' | 'outcome',
  ): number {
    return transactions
      .filter(transaction => transaction.type === type)
      .map(transaction => transaction.value)
      .reduce((accumulator, value) => accumulator + value, 0);
  }
}

export default TransactionsRepository;
