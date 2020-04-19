// import AppError from '../errors/AppError';

import { getRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  private readonly transactionsRepository: Repository<Transaction>;

  private readonly categoriesRepository: Repository<Category>;

  constructor() {
    this.transactionsRepository = getRepository(Transaction);
    this.categoriesRepository = getRepository(Category);
  }

  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const newCategory = this.categoriesRepository.create({ title: category });
    await this.categoriesRepository.save(newCategory);
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
      category_id: newCategory.id,
    });
    return this.transactionsRepository.save(transaction);
  }
}

export default CreateTransactionService;
