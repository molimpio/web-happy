export default interface Orfanato {
    latitude: number
    longitude: number
    nome: string
    description: string
    about: string
    open_hours: string
    open_on_weekens: string
    images: Array<{
      id: number
      url: string
    }>
}