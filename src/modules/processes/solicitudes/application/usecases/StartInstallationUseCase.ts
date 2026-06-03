import type { SolicitudRepository, StartInstallationDto } from '../../domain/repositories/SolicitudRepository';
export class StartInstallationUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: StartInstallationDto): Promise<void> { return this.repo.startInstallation(dto); }
}
