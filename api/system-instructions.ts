import type { IncomingMessage, ServerResponse } from "http";
import url from "url";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = url.parse(req.url || "", true);
  const mode = parsedUrl.query.mode === "dark" ? "dark" : "light";

  res.writeHead(200, { "Content-Type": "application/json" });

  if (mode === "dark") {
    res.end(
      JSON.stringify({
        roleName: "Peer Career Advisor/Mentor with Professional Experience",
        purpose:
          "Act as a guide or peer mentor in a professional context. Provide perspective and feedback as if they were a more experienced professional.",
        mode: "dark",
        context: "The user has worked full time and decided to resign.",
        knowledgeBase: [
          {
            title: "Phoenix: How to Write a Formal Resignation Letter with Examples",
            url: "http://phoenix.edu/blog/how-to-write-a-formal-resignation-letter-with-examples.html",
          },
          {
            title:
              "Monster & LinkedIn: How to Write a Resignation Letter that Leaves a Good Impression",
            url: "https://www.linkedin.com/pulse/how-write-resignation-letter-leaves-good-impression-monster-khgge/",
          },
          {
            title: "Indeed: Formal Letter of Resignation Guide & Samples",
            url: "https://www.indeed.com/career-advice/career-development/formal-letter-of-resignation",
          },
        ],
      })
    );
  } else {
    res.end(
      JSON.stringify({
        roleName: "Peer Career Advisor/Mentor with Professional Experience",
        purpose:
          "Act as a guide or peer mentor in a professional context. Provide perspective and feedback as if they were a more experienced professional.",
        mode: "light",
        context:
          "The user is a graduate student seeking professional mentorship and guidance on finding internships.",
        knowledgeBase: [
          {
            title: "Indeed: How to Write a Professional Email",
            url: "https://www.indeed.com/career-advice/career-development/how-to-write-a-professional-email",
          },
          {
            title: "Rutgers: Professional Email Templates",
            url: "https://e3-stem.camden.rutgers.edu/professional-email-templates/",
          },
          {
            title: "LinkedIn: Message Templates for Connection Requests",
            url: "https://www.linkedin.com/pulse/6-message-templates-linkedin-connection-request-success-/",
          },
          {
            title: "LinkedIn: Networking outreach examples (Mallory Contois)",
            url: "https://www.linkedin.com/posts/mallorycontois_i-got-lots-of-asks-for-an-example-of-a-good-share-7345415601470808067-dBkz/",
          },
          {
            title: "LinkedIn: Job search & ATS optimization (Rachel Bourne)",
            url: "https://www.linkedin.com/posts/rachel-bourne_jobsearch-resumetips-atsoptimization-share-7384585261961154560-ttcJ/",
          },
          {
            title: "LinkedIn: Design portfolios to inspire you (Tom Scott)",
            url: "https://www.linkedin.com/pulse/9-design-portfolios-inspire-you-tom-scott-rjyoe/",
          },
        ],
      })
    );
  }
}
