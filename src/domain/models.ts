export interface Word {
  id: string,
  content: string,
  description?: string,
  refs?: string[],
  [key: string]: any
}

export type Link = {
  id: number,
  sourceId: string,
  targetId: string,
  content: string,
  description?: string,
  refs?: string[],
  [key: string]: any
}

export type GraphType = '2d' | '3d'
export const GraphTypeArr = ['2d', '3d']

export type Graph = {
  id: string,
  name: string,
  userId: string,
  type: GraphType,
  [key: string]: any
}