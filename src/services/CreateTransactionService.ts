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
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
      category: await this.setupCategory(category),
    });
    return this.transactionsRepository.save(transaction);
  }

  private async setupCategory(title: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      title,
    });
    if (category) return category;
    const newCategory = this.categoriesRepository.create({ title });
    return this.categoriesRepository.save(newCategory);
  }
}

export default CreateTransactionService;
