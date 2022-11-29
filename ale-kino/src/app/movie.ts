export interface Movie {
  title: string,
  tags: string[],
  length: string,
  rated: string,
  description: string,
  image: string,
  premiere: boolean,
  score: string,
  schedule: Schedule[]
}

export interface Schedule {
  date: string,
  hours: string[]
}


