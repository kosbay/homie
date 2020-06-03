import * as ReactGA from "react-ga";

// declare var window: Window & {ga_client_id: string}

export const GaHelper = {
  initializeGa() {
    ReactGA.initialize("UA-150841201-1");
    // ReactGA.plugin.require('ec');
    // ReactGA.ga('require', 'displayfeatures');
    // ReactGA.ga((tracker: any) => {
    //   window.ga_client_id = tracker.get('clientId');
    // });
  },

  sendPageView(url: string) {
    ReactGA.pageview(url);
  }
};
