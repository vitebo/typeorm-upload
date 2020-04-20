import { getCustomRepository, DeleteResult } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  private readonly transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public execute({ id }: Request): Promise<DeleteResult> {
    const transaction = this.transactionsRepository.findOne({ id });
    if (!transaction) {
      throw new AppError('non-existent transaction');
    }
    return this.transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
