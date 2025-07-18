import fs from 'fs-extra';
import path from 'path';

export interface Repository {
    owner: string;
    name: string;
    displayName: string;
}

export interface GitHubRelease {
    tag_name: string;
    name: string;
    published_at: string;
    body: string;
    html_url: string;
    author: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    assets: Array<{
        name: string;
        browser_download_url: string;
        size: number;
        download_count: number;
    }>;
}

export interface ChangelogEntry {
    version: string;
    title: string;
    date: Date;
    content: string;
    htmlUrl: string;
    repository: Repository;
    author: {
        name: string;
        avatar: string;
        url: string;
    };
    assets: Array<{
        name: string;
        url: string;
        size: number;
        downloads: number;
    }>;
}

async function fetchFromGithub(url: string): Promise<Response> {
    const fetch_token = process.env.RELEASE_FETCH_GITHUB_TOKEN;
    if (fetch_token) {
        return await fetch(url, {
            headers: {
                Authorization: fetch_token,
                "X-Github-Api-Version": "2022-11-28",
            }
        })
    } else {
        return await fetch(url)
    }
}

export async function fetchGitHubReleases(
    owner: string,
    repo: string,
): Promise<GitHubRelease[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

    try {

        const response = await fetchFromGithub(url);// await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch releases: ${response.statusText}`);
        }

        const releases: GitHubRelease[] = await response.json();
        return releases;
    } catch (error) {
        console.error('Error fetching GitHub releases:', error);
        return [];
    }
}

export function transformReleaseToEntry(release: GitHubRelease, repository: Repository): ChangelogEntry {
    return {
        version: release.tag_name,
        title: release.name || release.tag_name,
        date: new Date(release.published_at),
        content: release.body || '',
        htmlUrl: release.html_url,
        repository,
        author: {
            name: release.author.login,
            avatar: release.author.avatar_url,
            url: release.author.html_url,
        },
        assets: release.assets.map(asset => ({
            name: asset.name,
            url: asset.browser_download_url,
            size: asset.size,
            downloads: asset.download_count,
        })),
    };
}

function formatPullRequestString(str) {
    // Regex to match lines starting with * and containing PR URLs
    // Captures: bullet point, description, " in ", PR URL, PR number, anything after
    const prRegex = /^(\*\s+)(.*?)\s+in\s+(https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/(\d+))(.*)/mg;

    return str.replace(prRegex, (match, bullet, description, url, prNumber, after) => {
        // Rearrange to put the PR link right after the bullet point
        return `${bullet}[#${prNumber}](${url}): ${description}${after}`;
    });
}

function replaceGitHubUsername(text: string): string {
    // Replace "by @username" with "([@username](https://github.com/username))"
    return text.replace(/by @(\w+)$/mg, '([@$1](https://github.com/$1))');
}

export function formatReleaseContent(entry: ChangelogEntry): string {
    const repositorySlug = entry.repository.name.replace(/[^a-zA-Z0-9]/g, '-');
    let content = `---
title: "${entry.title} (${entry.repository.displayName})"
date: ${entry.date.toISOString()}
tags: [release, ${repositorySlug}]
custom_edit_url: null
repository:
  name: ${entry.repository.name}
  displayName: ${entry.repository.displayName}
---

`;

    // TODO: The author only represents the person that created the release, ideally we'd
    // lookup all authors that contributed changes to the PR. Until we have more contributions,
    // skip populating the authors metadata.
    // authors:
    //   - name: ${entry.author.name}
    //     title: Contributor
    //     url: ${entry.author.url}
    //     image_url: ${entry.author.avatar}


    content += '\n<!-- truncate -->\n'

    // Add the release body content
    if (entry.content) {
        // Remove the Full Changelog link
        var body = formatPullRequestString(entry.content.replace(/^\*\*Full Changelog.*$/m, ''));
        body = replaceGitHubUsername(body);

        content += body + '\n\n';
    }

    // Add assets section if there are any
    if (entry.assets.length > 0) {
        content += `## Downloads\n\n`;
        entry.assets.forEach(asset => {
            const sizeInMB = (asset.size / (1024 * 1024)).toFixed(2);
            content += `- [${asset.name}](${asset.url}) (${sizeInMB} MB)\n`;
        });
        content += '\n';
    }

    // Add link to GitHub release
    content += `[View on GitHub](${entry.htmlUrl})\n`;

    return content;
}

export async function createBlogFiles(
    entries: ChangelogEntry[],
    outputPath: string,
): Promise<void> {
    // Ensure output directory exists
    await fs.ensureDir(outputPath);

    // Clear existing files
    await fs.emptyDir(outputPath);

    // Create individual release files
    for (const entry of entries) {
        //const fileName = `${entry.date.toISOString().split('T')[0]}-${entry.version.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
        const fileName = `${entry.repository.name}--${entry.version.replace(/[^a-zA-Z0-9]/g, '-')}.md`
        const filePath = path.join(outputPath, fileName);
        const content = formatReleaseContent(entry);

        await fs.writeFile(filePath, content);
    }
}

export async function generateChangelogFiles(
    repositories: Repository[],
    outputPath: string,
): Promise<void> {
    // Fetch releases from all repositories
    const allEntries: ChangelogEntry[] = [];

    for (const repository of repositories) {
        const releases = await fetchGitHubReleases(repository.owner, repository.name);
        const entries = releases.map(release => transformReleaseToEntry(release, repository));
        allEntries.push(...entries);
    }

    // Sort all entries by date (newest first)
    allEntries.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Create blog files
    await createBlogFiles(allEntries, path.resolve(outputPath));
}
