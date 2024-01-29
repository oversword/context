const wrapElements = (
  elements: null | React.ReactElement | Array<React.ReactElement>,
): Array<React.ReactElement> => {
  if (!elements) return [];
  if (Array.isArray(elements)) return elements;
  return [elements];
};
export default wrapElements;
