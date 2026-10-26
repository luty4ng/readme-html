# Privacy policy

Effective date: October 26, 2026. This policy describes README HTML v0.1.0.

README HTML has one purpose: display marked HTML documents from the current public GitHub repository inside its README.

## What the extension reads

On `https://github.com/*`, the content script reads the current repository URL and links in the rendered Markdown to find HTML links ending in `#html-preview`. The background worker validates that the requested file belongs to that repository, then requests it from `https://raw.githubusercontent.com/*`.

The extension processes the file's HTML in browser memory. It does not send the README, HTML content, or browsing activity to the project's maintainer, an analytics provider, or a separate rendering service.

## Requests to GitHub

Fetching a document sends its public repository/file URL to GitHub Raw. The request omits cookies and authentication credentials and uses a no-referrer policy. GitHub and network service providers can still observe ordinary connection information, including the file request and IP address, under their own policies.

The displayed document is sandboxed. Its scripts and external resources are blocked. Inline CSS, SVG, and permitted data images/fonts are processed locally.

## Storage and sharing

The extension has no account system, advertising, analytics, or extension storage. It does not persist document contents or usage records. Normal browser and network caching behavior remains outside the extension's own storage implementation.

The maintainer does not receive, sell, or share extension browsing data. GitHub receives the file requests required to provide the preview. The extension's use of data is limited to its disclosed document-preview purpose.

## Your choices

Disable the extension for GitHub, remove a preview marker from your README, or uninstall the extension to stop this functionality. Closing the page ends the document's in-memory preview session.

## Support

Privacy questions can be reported through [GitHub Issues](https://github.com/luty4ng/readme-html/issues). Issues are public: do not include credentials, private documents, or other sensitive information. Information you voluntarily post to GitHub is handled by GitHub separately from the extension.

This policy must be updated if future releases change these data practices.
