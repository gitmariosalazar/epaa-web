import type { SolicitudRepository, StartInstallationDto } from '../../domain/repositories/SolicitudRepository';

export class StartInstallationUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: StartInstallationDto): Promise<void> { return this.repo.startInstallation(dto); }
}
