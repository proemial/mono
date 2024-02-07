// More utilities: https://medium.com/@dhaniNishant/creating-limit-skip-between-exclude-functions-for-javascript-arrays-4d60a75aaae7
export function limit(array: any[], n: number) {
  return array.filter((x, i) => {
    if (i <= n - 1) {
      return true;
    }
  });
}
