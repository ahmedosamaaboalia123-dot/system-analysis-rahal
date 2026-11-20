export function verifyJobs(needs, expected) {
  if (
    !expected.length ||
    Object.keys(needs).length !== expected.length ||
    expected.some((job) => needs[job]?.result !== 'success')
  ) {
    throw new Error(
      `Mandatory CI jobs must all succeed: ${expected.map((job) => `${job}=${needs[job]?.result ?? 'missing'}`).join(', ')}`,
    );
  }
}

if (process.env.S02_REQUIRED_JOBS) {
  verifyJobs(JSON.parse(process.env.S02_JOB_RESULTS), process.env.S02_REQUIRED_JOBS.split(','));
  console.log('Required S02 foundation jobs all succeeded');
}
