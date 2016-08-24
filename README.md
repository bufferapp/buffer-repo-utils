# buffer-repo-utils

Some scripts to help us manage all of our repos.

## Setup

Head over to Github and create a new [personal access token](https://github.com/settings/tokens)
with the "repo" scope selected. Create a new file called `githubToken.json` in this repo's
directory with your key wrapped in `"` as it's only contents, no objects/curly braces needed.

## Labels

To add the base labels to your repo, run this script padding the repo name

```
node ./addLabels.js buffer-images
```
