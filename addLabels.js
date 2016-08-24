const GitHubApi = require('github');
const token = require('./githubToken.json');

const github = new GitHubApi();

github.authenticate({
  type: 'oauth',
  token: token
});

const LABELS = [
  { name: 'P1', color: 'e11d21' },
  { name: 'P2', color: 'eb6420' },
  { name: 'P3', color: 'fbca04' },
  { name: 'P4', color: '009800' },
  { name: 'S1', color: 'e11d21' },
  { name: 'S2', color: 'eb6420' },
  { name: 'S3', color: 'fbca04' },
  { name: 'S4', color: '009800' },
  { name: 'CR1', color: 'e11d21' },
  { name: 'CR2', color: 'eb6420' },
  { name: 'CR3', color: 'fbca04' },
  { name: 'CR4', color: '009800' },
  { name: 'code review pending', color: 'eb6420' },
  { name: 'code review complete', color: '009800' },
];

const user = 'bufferapp';
const repo = process.argv[2];

if (!repo) {
  console.log('Please pass the repo name as an argument');
  process.exit(1);
}

const basePayload = { user, repo };
const payloads = LABELS.map(label => Object.assign(label, basePayload));

const createOrUpdateLabel = (payload) => {
  return github.issues.createLabel(payload)
    .then(result => `created ${payload.name}`)
    .catch(err => github.issues.updateLabel(payload).then(result => `updated ${payload.name}`))
}

const promsies = payloads.map((payload) => createOrUpdateLabel(payload));

Promise.all(promsies)
  .then(results => {
    console.log(`${LABELS.length} labels successfully created in ${user}/${repo}`);
    console.log(results.join('\n'));
  })
  .catch(err => console.log('Error:', err));
