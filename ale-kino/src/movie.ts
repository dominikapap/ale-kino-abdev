export interface Movie {
  title: string,
  tags: string[],
  rated: string,
  description: string,
  image: string,
  premiere: boolean,
  score: string,
  schedule: {date: string, hours: string[]}[]
}


