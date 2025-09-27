import React, { useState, useEffect, useMemo } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { getContributors, type Contributor, type Commit } from './contributors';
import styles from './contributors.module.scss';

type Props = {
  owner: string;
  repo: string;
  filePath: string;
  additionalContributors?: Contributor[];
};

const GitHubContributors: React.FC<Props> = ({ owner, repo, filePath, additionalContributors }) => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const url = useMemo(
      () => `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}`,
      [owner, repo, filePath],
    );

    useEffect(() => {
        let cancelled = false;

        const fetchFileContributors = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to load contributors (${response.status})`);
                }
                const commits = (await response.json()) as Commit[];
                const gitContributors = getContributors(commits);
                const extras = additionalContributors ?? [];
                if (!cancelled) {
                    setContributors([...gitContributors, ...extras]);
                }
            } catch (error) {
                console.error(error);
                if (!cancelled) {
                    setContributors(additionalContributors ?? []);
                }
            }
        };

        fetchFileContributors();

        return () => {
            cancelled = true;
        };
    }, [additionalContributors, url]);

    if (!contributors.length) {
        return null;
    }

    return (
        <div className={styles.contributors}>
            <Heading as="h3">Contributors</Heading>

            <ul className={styles.wrapper}>
                {contributors.map((contributor) => {
                    const name = contributor.login;
                    return (
                        <li
                            key={contributor.login}
                            className={styles.contributor}
                        >
                            <Link
                                to={contributor.html_url}
                                title={`@${name}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={contributor.avatar_url}
                                    alt={contributor.login}
                                    width={70}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default GitHubContributors;
