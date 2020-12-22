declare global {
  type Options = {
    type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
    expires: number | 'infinity';
  };

}

export { };
