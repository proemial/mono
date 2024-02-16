export const analyticsKeys = {
  ui: {
    menu: {
      click: {
        ask: "menu:ask:click",
        feed: "menu:feed:click",
        read: "menu:read:click",
        you: "menu:profile:click",
      },
    },
    header: {
      click: {
        logo: "header:logo:click",
      },
    },
  },
  ask: {
    click: {
      stop: "ask:stop:click",
      clear: "ask:clear:click",
      starter: "ask:starter:click",
      answerCard: "ask:answer-card:click",
      answerLink: "ask:answer-link:click",
      share: "ask:share:click",
    },
    submit: {
      ask: "ask:input:submit",
    },
  },
  feed: {
    click: {
      card: "feed:card:click",
    },
  },
  read: {
    click: {
      feed: "read:feed:click",
      random: "read:random:click",
      askStarter: "read:ask_starter:click",
      fullPaper: "read:full-paper:click",
      share: "read:share:click",
      starter: "read:starter:click",
      explainer: "read:explainer:click",
      answers: "read:tab-answers:click",
      metadata: "read:tab-metadata:click",
    },
    submit: {
      ask: "read:ask_input:submit",
      question: "read:input:submit",
    },
  },
  profile: {
    click: {
      feedback: "profile:feedback:click",
      privacy: "profile:privacy:click",
      logout: "profile:logout:click",
    },
  },
  viewName: (path: string) => {
    return getViewName(path) + ":view";
  },
};

function getViewName(path: string) {
  if (path === "/") return "ask";
  if (path.startsWith("/oa")) return "read";
  if (path === "/profile") return "you";
  return path.slice(1);
}
