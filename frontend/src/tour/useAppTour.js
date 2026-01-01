import Shepherd from "shepherd.js";

// Simple reusable hook to start the app tour
export function useAppTour() {
  const startTour = () => {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: "smooth", block: "center" },
        classes: "shadow-lg",
      },
    });

    tour.addStep({
      id: "welcome",
      title: "Welcome to Evidence Chain",
      text: "This quick tour will highlight the main areas of the console.",
      buttons: [
        { text: "Skip", action: tour.cancel, secondary: true },
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "logo",
      title: "Home & Branding",
      text: "Use this to jump back to Dashboard any time.",
      attachTo: { element: '[data-tour="app-logo"]', on: "bottom" },
      advanceOn: { selector: '[data-tour="app-logo"]', event: "click" },
      buttons: [
        { text: "Back", action: tour.back, secondary: true },
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "sidebar",
      title: "Primary Navigation",
      text: "Navigate between major workflows from here.",
      attachTo: { element: '[data-tour="sidebar-nav"]', on: "right" },
      buttons: [
        { text: "Back", action: tour.back, secondary: true },
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "content",
      title: "Work Area",
      text: "All actions and details appear in this main area.",
      attachTo: { element: '[data-tour="main-content"]', on: "top" },
      buttons: [
        { text: "Back", action: tour.back, secondary: true },
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "logout",
      title: "Session Controls",
      text: "Access user info and logout from here when you are done.",
      attachTo: { element: '[data-tour="logout-button"]', on: "bottom" },
      buttons: [
        { text: "Back", action: tour.back, secondary: true },
        { text: "Finish", action: tour.complete },
      ],
    });

    tour.start();
  };

  return { startTour };
}
