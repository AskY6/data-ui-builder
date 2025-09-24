export type Tree<T> = {
    value: T
    children: Tree<T>[]
}

export type OneOrMore<T> = T | T[]