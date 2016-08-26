const GitHubApi = require('github');
const token = require('./githubToken.json');

const github = new GitHubApi();

github.authenticate({
  type: 'oauth',
  token: token
});

github.pullRequests.getAll({
  user: 'bufferapp',
  repo: 'buffer-web',
  state: 'closed',
  per_page: 100
}).then(data => {

  const mergedPRs = data.filter(pr => !!pr.merged_at);

  const prs = mergedPRs.map(pr => {
    pr.created_at = new Date(pr.created_at);
    pr.merged_at = new Date(pr.merged_at);
    pr.timeToMerge = Math.floor((pr.merged_at - pr.created_at) / 1000 / 60); // minutes
    return pr;
  });

  const getPrettyTime = time => `${Math.floor(time / 60)}h ${Math.ceil(time % 60)}m`;

  const total = mergedPRs.reduce((t, pr) => t + pr.timeToMerge, 0);
  const count = prs.length
  const avg = total / count;

  const sorted = prs.map(pr => pr.timeToMerge).sort((a, b) => a - b);

  const median = sorted[Math.floor(count / 2)];

  console.log(`
  ${count} prs merged since ${prs[count - 1].created_at}

    Average time to merge of ${getPrettyTime(avg)}
    Median time to merge of ${getPrettyTime(median)}
  `);
})
