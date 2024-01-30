type ParseFunctionCallType = {
  lc_kwargs: {
    additional_kwargs: {
      function_call: {
        // name: string;
        arguments: string;
      };
      tool_calls: undefined;
    };
  };
};

/**
 * hacky way to handle optional JsonOutputFunctionsParser
 */
export function parseFunctionCall<T extends ParseFunctionCallType>(
  response: T
) {
  const args = response?.lc_kwargs?.additional_kwargs?.function_call?.arguments;
  return args && JSON.parse(args);
}
