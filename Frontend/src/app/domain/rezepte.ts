export interface Rezept {
  id?: number,
  name?: string,
  online_links?: string,
  date?: string | Date,
  person?: string,
  status?: string,
  rating?: number
}
