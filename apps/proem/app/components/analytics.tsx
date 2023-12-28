"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import va from "@vercel/analytics";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import ReactGA from "react-ga4";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import * as Sentry from "@sentry/nextjs";
// import {Env} from "data/adapters/env";

// https://www.npmjs.com/package/react-ga4
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
  // const pathname = usePathname();
  // const initialized = useGoogleAnalytics();
  // useSentry();

  // const getViewName = (path: string) => {
  //   if (path === "/") return "home";
  //   if (path.startsWith("/arxiv")) return "reader";
  //   return path.slice(1);
  // };

  // useEffect(() => {
  //   if (initialized) {
  //     ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
  //     console.log("[AnalyticsClient] ", `view:${getViewName(pathname)}`);
  //     Analytics.track(`view:${getViewName(pathname)}`, {
  //       path: pathname,
  //     });
  //   }
  // }, [initialized, pathname]);

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}

/*

// Paste this code as high in the <head> of the page as possible:

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WWZ6WDTF');</script>
<!-- End Google Tag Manager -->


// Additionally, paste this code immediately after the opening <body> tag:

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WWZ6WDTF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

 */

export const Analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    // ReactGA.event(event, properties);
    console.log("[AnalyticsClient] event:", event, properties);
  },
};

// function useGoogleAnalytics() {
//   const { user } = useUser();
//   const [initialized, setInitialized] = useState(false);
//
//   useEffect(() => {
//     if (user) {
//       // const email = user["https://paperflow.ai/email"] as string;
//       ReactGA.initialize("G-2H4D1N8XGN", {
//         gaOptions: {
//           userId: user.sub,
//         },
//       });
//       console.log("[AnalyticsClient] init");
//
//       setInitialized(true);
//     }
//   }, [setInitialized, user]);
//
//   return initialized;
// }
//
// function useSentry() {
//   const [initialized, setInitialized] = useState(false);
//
//   useEffect(() => {
//     if (!initialized && Env.isProd) {
//       Sentry.init({
//         dsn: "https://e2c9474531c243f9aae26fb24b1b8653@o4505557013168128.ingest.sentry.io/4505557015199744",
//         integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
//         // Performance Monitoring
//         tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
//         // Session Replay
//         replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//         replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//       });
//
//       setInitialized(true);
//     }
//   }, [setInitialized]);
//
//   return initialized;
// }
