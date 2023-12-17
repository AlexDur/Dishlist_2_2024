export interface Rezept {
  id?: number,
  name?: string,
  onlineAdresse?: string,
  datum?: Date | undefined,
  person?: string,
  status?: string,
  rating?: number
}
