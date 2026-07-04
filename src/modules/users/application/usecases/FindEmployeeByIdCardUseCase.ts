import type { User } from '@/modules/users/domain/models/User';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

/**
 * Busca un empleado por su número de cédula (idCard).
 * Retorna null si no se encuentra (no lanza error).
 *
 * Principio SRP: responsabilidad única — buscar por cédula.
 * Principio DIP: depende de la abstracción UserRepository.
 */
export class FindEmployeeByIdCardUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(idCard: string): Promise<User | null> {
    if (!idCard || idCard.trim().length === 0) {
      return null;
    }
    return this.userRepository.findByIdCard(idCard.trim());
  }
}
