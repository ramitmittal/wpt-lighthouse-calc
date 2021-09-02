chrome.commands.onCommand.addListener(async () => {
  try {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    if (!tab.url) {
      console.log(`WH LH Scorelcalc -> No url in tab`);
      return;
    }

    const { pathname, origin } = new URL(tab.url);
    const resultsPagePathRegex = /^\/result\/(?<testId>\w+)\/$/;
    const match = pathname.match(resultsPagePathRegex);
    const testId = match && match.groups.testId;

    if (!testId) {
      console.log(`WH LH Scorelcalc -> No testId in url`);
      return;
    }

    const jsonResultUrl = `${origin}/jsonResult.php?test=${testId}`;
    const data = await fetch(jsonResultUrl).then((res) =>
      res.ok ? res.json() : {}
    );

    if (data.statusCode !== 200) {
      console.log(
        `WH LH Scorelcalc -> TestId ${testId} -> StatusCode ${data.statusCode}`
      );
      return;
    }

    const lhParams = extractLHParams(data.data);
    chrome.tabs.create({
      active: false,
      url: `https://googlechrome.github.io/lighthouse/scorecalc/#${new URLSearchParams(
        lhParams
      )}`,
    });
  } catch (err) {
    console.error(`WH LH Scorecalc Errored -> ${err.message}`);
  }
});

function extractLHParams(data) {
  return {
    FCP: data.median.firstView.firstContentfulPaint,
    SI: data.median.firstView.SpeedIndex,
    LCP: data.median.firstView["chromeUserTiming.LargestContentfulPaint"],
    TTI: data.median.firstView.domInteractive,
    TBT: data.median.firstView.TotalBlockingTime,
    CLS: data.median.firstView["chromeUserTiming.CumulativeLayoutShift"],
    device: data.mobile === 1 ? "mobile" : "desktop",
    version: 8,
  };
}
