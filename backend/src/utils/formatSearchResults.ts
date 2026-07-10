export type SearchResult = {
  title: string;
  content: string;
  url: string;
};

export const formatSearchResults = (results: SearchResult[]) => {
  return results
    .map((result, index) => {
      return `
      Source ${index + 1}
      
      Title: ${result.title}

      Content: ${result.content}

      URL: ${result.url}`;
    })
    .join("\n======================\n");
};
