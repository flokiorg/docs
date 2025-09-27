export type Contributor = {
  login: string;
  html_url: string;
  avatar_url: string;
};

type CommitAuthor = Partial<Contributor> | null | undefined;

export type Commit = {
  author?: CommitAuthor;
};

export const getContributors = (commits: Commit[]): Contributor[] => {
  const contributorMap = new Map<string, Contributor>();

  commits.forEach((commit) => {
    const author = commit.author;
    if (!author?.login || !author.html_url || !author.avatar_url) {
      return;
    }

    if (!contributorMap.has(author.login)) {
      contributorMap.set(author.login, {
        login: author.login,
        html_url: author.html_url,
        avatar_url: author.avatar_url,
      });
    }
  });

  return Array.from(contributorMap.values()).sort((a, b) =>
    a.login.localeCompare(b.login)
  );
};
