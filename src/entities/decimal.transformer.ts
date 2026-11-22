// MySQL gives DECIMAL columns back as strings, so we convert them to numbers
export const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : parseFloat(value)),
};