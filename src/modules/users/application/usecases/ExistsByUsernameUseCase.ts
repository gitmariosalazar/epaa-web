import type { UserRepository } from '../../domain/repositories/UserRepository';

/**
 * Verifica si un usuario ya existe por username.
 * 
 * Clean Architecture: Application layer — orquesta la validación.
 * SOLID (SRP): Solo una responsabilidad — verificar existencia.
 * SOLID (DIP): Depende de la abstracción UserRepository.
 */
export class ExistsByUsernameUseCase {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(username: string): Promise<boolean> {
    return this.repository.existsByUsername(username);
  }
}
