const GitHubApi = require('github');
const token = require('./githubToken.json');

const github = new GitHubApi();

github.authenticate({
  type: 'oauth',
  token: token
});

const LABELS = [
  { oldname: 'P1', name: 'priority:P1', color: 'e11d21' },
  { oldname: 'P2', name: 'priority:P2', color: 'eb6420' },
  { oldname: 'P3', name: 'priority:P3', color: 'fbca04' },
  { oldname: 'P4', name: 'priority:P4', color: '009800' },
  { oldname: 'S1', name: 'severity:S1', color: 'e11d21' },
  { oldname: 'S2', name: 'severity:S2', color: 'eb6420' },
  { oldname: 'S3', name: 'severity:S3', color: 'fbca04' },
  { oldname: 'S4', name: 'severity:S4', color: '009800' },
  { oldname: 'CR1', name: 'code-review-level:CR1', color: 'e11d21' },
  { oldname: 'CR2', name: 'code-review-level:CR2', color: 'eb6420' },
  { oldname: 'CR3', name: 'code-review-level:CR3', color: 'fbca04' },
  { oldname: 'CR4', name: 'code-review-level:CR4', color: '009800' },
  { oldname: 'code review pending', name: 'code-review-status:pending', color: 'eb6420' },
  { oldname: 'code review complete', name: 'code-review-status:complete', color: '009800' },
];

const user = 'bufferapp';
const repo = process.argv[2];

if (!repo) {
  console.log('Please pass the repo name as an argument');
  process.exit(1);
}

const basePayload = { owner: user, repo };
const payloads = LABELS.map(label => Object.assign(label, basePayload));

const migrateLabel = (payload) => {
  return github.issues.updateLabel(payload).then(result => `updated ${payload.name}`)
    .catch(err => console.log(`failed at ${payload.name}`, err));
}

const promsies = payloads.map((payload) => migrateLabel(payload));


Promise.all(promsies)
  .then(results => {
    console.log(`${LABELS.length} labels successfully migrated in ${user}/${repo}`);
    console.log(results.join('\n'));
  })
  .catch(err => console.log('Error:', err));
