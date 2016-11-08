const GitHubApi = require('github');
const token = require('./githubToken.json');

const github = new GitHubApi();

github.authenticate({
  type: 'oauth',
  token: token
});

const LABELS = [
  { name: 'priority:P1', color: 'e11d21' },
  { name: 'priority:P2', color: 'eb6420' },
  { name: 'priority:P3', color: 'fbca04' },
  { name: 'priority:P4', color: '009800' },
  { name: 'severity:S1', color: 'e11d21' },
  { name: 'severity:S2', color: 'eb6420' },
  { name: 'severity:S3', color: 'fbca04' },
  { name: 'severity:S4', color: '009800' },
  { name: 'code-review-level:CR1', color: 'e11d21' },
  { name: 'code-review-level:CR2', color: 'eb6420' },
  { name: 'code-review-level:CR3', color: 'fbca04' },
  { name: 'code-review-level:CR4', color: '009800' },
  { name: 'code-review-status:pending', color: 'eb6420' },
  { name: 'code-review-status:complete', color: '009800' },
];

const user = 'bufferapp';
const repo = process.argv[2];

if (!repo) {
  console.log('Please pass the repo name as an argument');
  process.exit(1);
}

const basePayload = { owner: user, repo };
const payloads = LABELS.map(label => Object.assign(label, basePayload));

const createOrUpdateLabel = (payload) => {
  return github.issues.createLabel(payload)
    .then(result => `created ${payload.name}`)
    .catch(err => {
      const updatePayload = Object.assign({ oldname: payload.name }, payload);
      return github.issues.updateLabel(updatePayload)
        .then(result => `updated ${payload.name}`);
    })
}

const promsies = payloads.map((payload) => createOrUpdateLabel(payload));

Promise.all(promsies)
  .then(results => {
    console.log(`${LABELS.length} labels successfully created in ${user}/${repo}`);
    console.log(results.join('\n'));
  })
  .catch(err => console.log('Error:', err));
