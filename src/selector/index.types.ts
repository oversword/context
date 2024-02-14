export enum SelectorParserMode {
  operator = 'operator',
  selector = 'selector',
}
export enum SelectorParserOperator {
  direct = 'direct',
  inside = 'inside',
}
export type SelectorParserStackItem = {
  operator: SelectorParserOperator;
  selector: string;
};
export type SelectorParserStack = Array<SelectorParserStackItem>;
export interface SelectorParserContext {
  mode: SelectorParserMode;
  operator: SelectorParserOperator;
  selector: string;
  stack: SelectorParserStack;
}
