import { getRepository, Repository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  private readonly transactionsRepository: TransactionsRepository;

  private readonly categoriesRepository: Repository<Category>;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
    this.categoriesRepository = getRepository(Category);
  }

  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    await this.assertTransactionValue(value, type);
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
      category: await this.setupCategory(category),
    });
    return this.transactionsRepository.save(transaction);
  }

  private async assertTransactionValue(
    value: number,
    type: 'income' | 'outcome',
  ): Promise<void> {
    if (type !== 'outcome') return;
    const { total } = await this.transactionsRepository.getBalance();
    if (total < value) throw new AppError('insufficient funds', 400);
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
