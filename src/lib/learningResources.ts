// Curated learning resources for the most common developer skills.
//
// Source of truth: one entry per canonical skill name. Roadmap items whose
// title matches a canonical_name (case-insensitive) get a "Learn →" link
// jumping to /resources#{slug}. Unmapped skills silently omit the link.
//
// Maintenance: when a skill comes up repeatedly in roadmap_items without a
// matching resource here, add it below — that's the whole loop. Avoid linking
// to URLs that frequently change paths; prefer official docs and stable hubs.

export type ResourceCategory = "language" | "framework" | "database" | "devops" | "tool" | "concept";

export interface LearningLink {
  title: string;
  url: string;
}

export interface LearningResource {
  /** Anchor slug used in /resources#{slug} */
  slug: string;
  /** Should match a canonical_name in data/skills-taxonomy.json when one exists. */
  canonicalName: string;
  category: ResourceCategory;
  blurb: string;
  links: LearningLink[];
  /**
   * Extra phrases (lowercase) that should also resolve to this resource via
   * substring matching against roadmap item titles. Use this when AI roadmap
   * generators phrase a skill multiple ways ("production AI", "ai in production",
   * etc.) without each variant being its own taxonomy entry.
   */
  aliases?: string[];
}

export const LEARNING_RESOURCES: LearningResource[] = [
  // ── Languages ──────────────────────────────────────────────────────────────
  {
    slug: "javascript",
    canonicalName: "JavaScript",
    category: "language",
    blurb: "The language of the web. Browser-side scripting plus a massive server-side ecosystem via Node.js.",
    links: [
      { title: "MDN — Learn JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { title: "javascript.info", url: "https://javascript.info/" },
      { title: "freeCodeCamp — JS Algorithms & DS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
    ],
  },
  {
    slug: "typescript",
    canonicalName: "TypeScript",
    category: "language",
    blurb: "Typed superset of JavaScript. Essential for any non-trivial JS codebase.",
    links: [
      { title: "Official handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { title: "roadmap.sh — TypeScript", url: "https://roadmap.sh/typescript" },
      { title: "Total TypeScript (Matt Pocock)", url: "https://www.totaltypescript.com/tutorials" },
    ],
  },
  {
    slug: "python",
    canonicalName: "Python",
    category: "language",
    blurb: "General-purpose language dominant in data, ML, and backend scripting.",
    links: [
      { title: "Official tutorial", url: "https://docs.python.org/3/tutorial/" },
      { title: "Real Python", url: "https://realpython.com/" },
      { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/" },
    ],
  },
  {
    slug: "go",
    canonicalName: "Go",
    category: "language",
    blurb: "Compiled, statically typed language by Google. Dominant in cloud infrastructure.",
    links: [
      { title: "A Tour of Go", url: "https://go.dev/tour/" },
      { title: "Go by Example", url: "https://gobyexample.com/" },
      { title: "Effective Go", url: "https://go.dev/doc/effective_go" },
    ],
  },
  {
    slug: "rust",
    canonicalName: "Rust",
    category: "language",
    blurb: "Systems language with strong safety guarantees. Steep learning curve, big payoff.",
    links: [
      { title: "The Rust Book", url: "https://doc.rust-lang.org/book/" },
      { title: "Rust by Example", url: "https://doc.rust-lang.org/rust-by-example/" },
      { title: "Rustlings exercises", url: "https://github.com/rust-lang/rustlings" },
    ],
  },
  {
    slug: "sql",
    canonicalName: "SQL",
    category: "language",
    blurb: "The lingua franca of relational databases. Foundational for backend and data work.",
    links: [
      { title: "SQLBolt — interactive lessons", url: "https://sqlbolt.com/" },
      { title: "Mode — SQL tutorial", url: "https://mode.com/sql-tutorial" },
      { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/" },
    ],
  },
  {
    slug: "java",
    canonicalName: "Java",
    category: "language",
    blurb: "Mature enterprise language on the JVM. Backbone of large backends, Android, and big data.",
    links: [
      { title: "Oracle Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/" },
      { title: "Baeldung", url: "https://www.baeldung.com/" },
      { title: "Java by Comparison (book)", url: "https://java.by-comparison.com/" },
    ],
  },
  {
    slug: "csharp",
    canonicalName: "C#",
    category: "language",
    blurb: "Microsoft's flagship language. Powers .NET, Unity game dev, and a lot of enterprise backends.",
    links: [
      { title: "Microsoft Learn — C#", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
      { title: "C# in Depth (Jon Skeet)", url: "https://csharpindepth.com/" },
    ],
  },
  {
    slug: "kotlin",
    canonicalName: "Kotlin",
    category: "language",
    blurb: "Modern JVM language. Official choice for Android, increasingly used server-side via Ktor and Spring.",
    links: [
      { title: "Official docs", url: "https://kotlinlang.org/docs/home.html" },
      { title: "Kotlin Koans (interactive)", url: "https://play.kotlinlang.org/koans/overview" },
    ],
  },
  {
    slug: "swift",
    canonicalName: "Swift",
    category: "language",
    blurb: "Apple's modern language for iOS, macOS, and server-side. Strong type system, great tooling.",
    links: [
      { title: "Swift.org documentation", url: "https://www.swift.org/documentation/" },
      { title: "Hacking with Swift", url: "https://www.hackingwithswift.com/" },
      { title: "Apple — SwiftUI tutorials", url: "https://developer.apple.com/tutorials/swiftui" },
    ],
  },
  {
    slug: "bash",
    canonicalName: "Bash",
    category: "language",
    blurb: "Unix shell scripting. Unsexy until you need to glue 30 things together at 2am — then essential.",
    links: [
      { title: "The Bash Guide", url: "https://guide.bash.academy/" },
      { title: "explainshell.com", url: "https://explainshell.com/" },
      { title: "ShellCheck", url: "https://www.shellcheck.net/" },
    ],
    aliases: ["shell", "shell scripting", "linux", "linux & bash"],
  },

  // ── Frameworks ─────────────────────────────────────────────────────────────
  {
    slug: "react",
    canonicalName: "React",
    category: "framework",
    blurb: "Component-based UI library. The default choice for most web frontends.",
    links: [
      { title: "react.dev — Learn", url: "https://react.dev/learn" },
      { title: "roadmap.sh — React", url: "https://roadmap.sh/react" },
      { title: "Patterns.dev", url: "https://www.patterns.dev/react" },
    ],
  },
  {
    slug: "nextjs",
    canonicalName: "Next.js",
    category: "framework",
    blurb: "React meta-framework with SSR, RSC, and full-stack capabilities. The de-facto choice for production React.",
    links: [
      { title: "Official Learn course", url: "https://nextjs.org/learn" },
      { title: "Next.js docs", url: "https://nextjs.org/docs" },
    ],
  },
  {
    slug: "vue",
    canonicalName: "Vue",
    category: "framework",
    blurb: "Progressive JavaScript framework. Lower entry cost than React, strong DX.",
    links: [
      { title: "Vue.js guide", url: "https://vuejs.org/guide/introduction.html" },
      { title: "Vue Mastery (free intro)", url: "https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3/" },
    ],
  },
  {
    slug: "express",
    canonicalName: "Express.js",
    category: "framework",
    blurb: "Minimalist Node.js web framework. Still the most common way to build a Node HTTP server.",
    links: [
      { title: "Express docs", url: "https://expressjs.com/" },
      { title: "MDN — Express/Node tutorial", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs" },
    ],
  },
  {
    slug: "django",
    canonicalName: "Django",
    category: "framework",
    blurb: "Batteries-included Python web framework. Great for full-stack apps with auth, admin, and ORM built in.",
    links: [
      { title: "Official tutorial", url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/" },
      { title: "Django for Beginners (book)", url: "https://djangoforbeginners.com/" },
    ],
  },
  {
    slug: "fastapi",
    canonicalName: "FastAPI",
    category: "framework",
    blurb: "Modern Python API framework with automatic OpenAPI docs and async-first design.",
    links: [
      { title: "Official tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
      { title: "Full Stack FastAPI Template", url: "https://github.com/tiangolo/full-stack-fastapi-template" },
    ],
  },
  {
    slug: "tailwind-css",
    canonicalName: "Tailwind CSS",
    category: "framework",
    blurb: "Utility-first CSS framework. Once you internalize the utility model, it's faster than writing custom CSS.",
    links: [
      { title: "Tailwind docs", url: "https://tailwindcss.com/docs" },
      { title: "Tailwind UI (paid, with free previews)", url: "https://tailwindui.com/components" },
    ],
  },
  {
    slug: "graphql",
    canonicalName: "GraphQL",
    category: "framework",
    blurb: "Query language and runtime for APIs. Worth knowing even if you mostly ship REST.",
    links: [
      { title: "graphql.org — Learn", url: "https://graphql.org/learn/" },
      { title: "How to GraphQL", url: "https://www.howtographql.com/" },
    ],
  },
  {
    slug: "angular",
    canonicalName: "Angular",
    category: "framework",
    blurb: "Full-featured opinionated framework from Google. Heavier than React but with everything included.",
    links: [
      { title: "angular.dev — Tutorials", url: "https://angular.dev/tutorials" },
      { title: "Angular docs", url: "https://angular.dev/overview" },
    ],
  },
  {
    slug: "svelte",
    canonicalName: "Svelte",
    category: "framework",
    blurb: "Compiler-based framework with minimal runtime. Famously concise; SvelteKit is the meta-framework.",
    links: [
      { title: "Svelte interactive tutorial", url: "https://svelte.dev/tutorial" },
      { title: "SvelteKit docs", url: "https://svelte.dev/docs/kit/introduction" },
    ],
    aliases: ["sveltekit", "svelte kit"],
  },
  {
    slug: "spring-boot",
    canonicalName: "Spring Boot",
    category: "framework",
    blurb: "Production-ready Spring applications without the XML hell. Dominant in Java backend.",
    links: [
      { title: "Spring — Getting Started Guides", url: "https://spring.io/guides" },
      { title: "Baeldung — Spring tutorials", url: "https://www.baeldung.com/spring-tutorial" },
    ],
  },
  {
    slug: "nestjs",
    canonicalName: "NestJS",
    category: "framework",
    blurb: "Opinionated Node.js framework with TypeScript and decorators — Angular's mental model on the server.",
    links: [
      { title: "Official docs", url: "https://docs.nestjs.com/" },
      { title: "NestJS Fundamentals (free course)", url: "https://courses.nestjs.com/" },
    ],
  },
  {
    slug: "react-native",
    canonicalName: "React Native",
    category: "framework",
    blurb: "Build mobile apps with React. Expo is the recommended starting point in 2025.",
    links: [
      { title: "React Native docs", url: "https://reactnative.dev/docs/getting-started" },
      { title: "Expo — Getting Started", url: "https://docs.expo.dev/get-started/introduction/" },
    ],
  },
  {
    slug: "flutter",
    canonicalName: "Flutter",
    category: "framework",
    blurb: "Google's cross-platform UI toolkit using Dart. One codebase, native-ish performance on iOS/Android/web.",
    links: [
      { title: "Flutter docs", url: "https://docs.flutter.dev/get-started/install" },
      { title: "Flutter Codelabs", url: "https://docs.flutter.dev/codelabs" },
    ],
  },
  {
    slug: "pytorch",
    canonicalName: "PyTorch",
    category: "framework",
    blurb: "Dominant deep learning framework. Pythonic, researcher-friendly, runs almost all modern ML papers.",
    links: [
      { title: "Official tutorials", url: "https://pytorch.org/tutorials/" },
      { title: "Learn PyTorch (Daniel Bourke)", url: "https://www.learnpytorch.io/" },
      { title: "fast.ai — uses PyTorch", url: "https://course.fast.ai/" },
    ],
  },
  {
    slug: "langchain",
    canonicalName: "LangChain",
    category: "framework",
    blurb: "Framework for building LLM apps. Useful patterns; some bloat — read the source if you go deep.",
    links: [
      { title: "Official docs (Python)", url: "https://python.langchain.com/docs/introduction/" },
      { title: "LangChain Academy — LangGraph", url: "https://academy.langchain.com/courses/intro-to-langgraph" },
    ],
  },

  // ── Databases ──────────────────────────────────────────────────────────────
  {
    slug: "postgresql",
    canonicalName: "PostgreSQL",
    category: "database",
    blurb: "The default relational database for serious work. Rich feature set, excellent docs.",
    links: [
      { title: "Official tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
      { title: "PostgreSQL Exercises", url: "https://pgexercises.com/" },
      { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/" },
    ],
  },
  {
    slug: "mongodb",
    canonicalName: "MongoDB",
    category: "database",
    blurb: "Document-oriented NoSQL database. Different mental model than SQL — schema lives in your code.",
    links: [
      { title: "MongoDB University (free)", url: "https://learn.mongodb.com/" },
      { title: "Docs — get started", url: "https://www.mongodb.com/docs/manual/tutorial/getting-started/" },
    ],
  },
  {
    slug: "redis",
    canonicalName: "Redis",
    category: "database",
    blurb: "In-memory data store. Caching, queues, rate limiting, pub/sub — Redis touches all of it.",
    links: [
      { title: "Try Redis (interactive)", url: "https://try.redis.io/" },
      { title: "Redis docs", url: "https://redis.io/docs/latest/" },
    ],
  },
  {
    slug: "mysql",
    canonicalName: "MySQL",
    category: "database",
    blurb: "The other big open-source RDBMS. Still everywhere — WordPress, classic LAMP stacks, many enterprise apps.",
    links: [
      { title: "Official MySQL tutorial", url: "https://dev.mysql.com/doc/refman/8.0/en/tutorial.html" },
      { title: "MySQL Tutorial (free)", url: "https://www.mysqltutorial.org/" },
    ],
  },

  // ── Cloud / DevOps ─────────────────────────────────────────────────────────
  {
    slug: "aws",
    canonicalName: "AWS",
    category: "devops",
    blurb: "Amazon's cloud platform. Vast surface — start with the core: IAM, EC2, S3, RDS, Lambda.",
    links: [
      { title: "AWS Skill Builder (free)", url: "https://skillbuilder.aws/" },
      { title: "Adrian Cantrill's free courses", url: "https://learn.cantrill.io/courses/category/Free%20Courses" },
      { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/" },
    ],
  },
  {
    slug: "docker",
    canonicalName: "Docker",
    category: "devops",
    blurb: "Containers. Skip the dev-environment war stories — Docker is table-stakes for backend work.",
    links: [
      { title: "Docker — Get Started", url: "https://docs.docker.com/get-started/" },
      { title: "Play with Docker (sandbox)", url: "https://labs.play-with-docker.com/" },
    ],
  },
  {
    slug: "kubernetes",
    canonicalName: "Kubernetes",
    category: "devops",
    blurb: "Container orchestration. Heavy concepts; learn pods, deployments, services first.",
    links: [
      { title: "Official tutorials", url: "https://kubernetes.io/docs/tutorials/" },
      { title: "Kubernetes the Hard Way (Kelsey Hightower)", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way" },
      { title: "Play with Kubernetes", url: "https://labs.play-with-k8s.com/" },
    ],
  },
  {
    slug: "terraform",
    canonicalName: "Terraform",
    category: "devops",
    blurb: "Infrastructure as code. Declarative cloud resource provisioning across most major providers.",
    links: [
      { title: "HashiCorp tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
      { title: "Up & Running (Gruntwork book)", url: "https://www.terraformupandrunning.com/" },
    ],
  },
  {
    slug: "gcp",
    canonicalName: "GCP",
    category: "devops",
    blurb: "Google Cloud. Strong on data and ML (BigQuery, Vertex AI); good DX for serverless and containers.",
    links: [
      { title: "Google Cloud Skills Boost (free quests)", url: "https://www.cloudskillsboost.google/" },
      { title: "Cloud Architecture Center", url: "https://cloud.google.com/architecture" },
    ],
    aliases: ["google cloud", "google cloud platform"],
  },
  {
    slug: "azure",
    canonicalName: "Azure",
    category: "devops",
    blurb: "Microsoft's cloud. Dominant in enterprise/Microsoft shops; best-in-class integration with .NET and AD.",
    links: [
      { title: "Microsoft Learn — Azure", url: "https://learn.microsoft.com/en-us/training/azure/" },
      { title: "Azure Architecture Center", url: "https://learn.microsoft.com/en-us/azure/architecture/" },
    ],
    aliases: ["microsoft azure"],
  },
  {
    slug: "github-actions",
    canonicalName: "GitHub Actions",
    category: "devops",
    blurb: "CI/CD baked into GitHub. Cheap, flexible, and the path of least resistance for most repos in 2025.",
    links: [
      { title: "Official docs", url: "https://docs.github.com/en/actions" },
      { title: "awesome-actions", url: "https://github.com/sdras/awesome-actions" },
    ],
  },
  {
    slug: "ci-cd",
    canonicalName: "CI/CD",
    category: "concept",
    blurb: "Automating tests, builds, and deploys. Concept-first; the tool (GitHub Actions, GitLab CI, etc.) is interchangeable.",
    links: [
      { title: "Martin Fowler — Continuous Integration", url: "https://martinfowler.com/articles/continuousIntegration.html" },
      { title: "GitHub Actions docs", url: "https://docs.github.com/en/actions/learn-github-actions" },
    ],
  },

  // ── Tools ──────────────────────────────────────────────────────────────────
  {
    slug: "git",
    canonicalName: "Git",
    category: "tool",
    blurb: "Distributed version control. You'll never escape it — invest the time to understand the model.",
    links: [
      { title: "Pro Git book (free)", url: "https://git-scm.com/book/en/v2" },
      { title: "Learn Git Branching (interactive)", url: "https://learngitbranching.js.org/" },
      { title: "Oh Shit, Git!?!", url: "https://ohshitgit.com/" },
    ],
  },
  {
    slug: "jest",
    canonicalName: "Jest",
    category: "tool",
    blurb: "JavaScript testing framework. Mostly transferable to Vitest if you go that direction.",
    links: [
      { title: "Jest docs", url: "https://jestjs.io/docs/getting-started" },
      { title: "Testing Library — best practices", url: "https://testing-library.com/docs/" },
    ],
  },
  {
    slug: "vitest",
    canonicalName: "Vitest",
    category: "tool",
    blurb: "Vite-native test runner. Drop-in Jest replacement for Vite/TS projects — faster and less config.",
    links: [
      { title: "Vitest docs", url: "https://vitest.dev/" },
      { title: "Migrating from Jest", url: "https://vitest.dev/guide/migration.html" },
    ],
  },
  {
    slug: "playwright",
    canonicalName: "Playwright",
    category: "tool",
    blurb: "Cross-browser E2E testing from Microsoft. Has overtaken Cypress as the default for most teams in 2025.",
    links: [
      { title: "Official docs", url: "https://playwright.dev/docs/intro" },
      { title: "Playwright Codegen", url: "https://playwright.dev/docs/codegen" },
    ],
  },

  // ── Concepts ───────────────────────────────────────────────────────────────
  {
    slug: "system-design",
    canonicalName: "System Design",
    category: "concept",
    blurb: "Designing scalable, reliable distributed systems. Interview staple; also useful in real life.",
    links: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
      { title: "ByteByteGo (paid newsletter, free archive)", url: "https://blog.bytebytego.com/" },
      { title: "Designing Data-Intensive Applications (book)", url: "https://dataintensive.net/" },
    ],
  },
  {
    slug: "rest-api",
    canonicalName: "REST API",
    category: "concept",
    blurb: "HTTP-based architectural style for APIs. Still the default for most public APIs.",
    links: [
      { title: "MDN — HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { title: "restfulapi.net — guide", url: "https://restfulapi.net/" },
    ],
  },
  {
    slug: "microservices",
    canonicalName: "Microservices Architecture",
    category: "concept",
    blurb: "Architectural pattern with small, independently deployable services. Trade complexity for autonomy.",
    links: [
      { title: "Martin Fowler — Microservices", url: "https://martinfowler.com/articles/microservices.html" },
      { title: "microservices.io patterns", url: "https://microservices.io/patterns/" },
    ],
  },
  {
    slug: "tdd",
    canonicalName: "Test-Driven Development",
    category: "concept",
    blurb: "Write the test first, then the code. Easier said than done; pays off in design clarity.",
    links: [
      { title: "Martin Fowler — TDD", url: "https://martinfowler.com/bliki/TestDrivenDevelopment.html" },
      { title: "Kent Beck — TDD by Example (book)", url: "https://www.oreilly.com/library/view/test-driven-development/0321146530/" },
    ],
  },
  {
    slug: "oauth-2",
    canonicalName: "OAuth 2.0",
    category: "concept",
    blurb: "Authorization framework you've used a thousand times without reading the spec. Worth reading.",
    links: [
      { title: "oauth.net — OAuth 2.0", url: "https://oauth.net/2/" },
      { title: "Auth0 — Intro to IAM", url: "https://auth0.com/intro-to-iam" },
    ],
  },
  {
    slug: "authentication",
    canonicalName: "Authentication & Authorization",
    category: "concept",
    blurb: "Broader than OAuth: sessions, tokens, password hashing, MFA, RBAC/ABAC. Get the threat model right before picking a library.",
    links: [
      { title: "OWASP Authentication Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
      { title: "OWASP Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
      { title: "Auth0 blog — concepts", url: "https://auth0.com/blog/" },
    ],
    aliases: ["authentication", "authorization", "auth", "iam", "identity"],
  },
  {
    slug: "algorithms",
    canonicalName: "Algorithms & Data Structures",
    category: "concept",
    blurb: "The interview gauntlet, and also genuinely useful when you hit a real perf problem. Pattern-based study beats brute force.",
    links: [
      { title: "NeetCode roadmap", url: "https://neetcode.io/roadmap" },
      { title: "Algorithms (Princeton, Coursera)", url: "https://www.coursera.org/learn/algorithms-part1" },
      { title: "LeetCode patterns cheatsheet", url: "https://github.com/seanprashad/leetcode-patterns" },
    ],
    aliases: ["algorithms", "data structures", "dsa", "leetcode"],
  },
  {
    slug: "design-patterns",
    canonicalName: "Design Patterns",
    category: "concept",
    blurb: "Reusable solutions to recurring problems. Knowing them is useful; over-applying them is the real anti-pattern.",
    links: [
      { title: "Refactoring.Guru", url: "https://refactoring.guru/design-patterns" },
      { title: "Game Programming Patterns (free book)", url: "https://gameprogrammingpatterns.com/contents.html" },
      { title: "SOLID principles overview", url: "https://en.wikipedia.org/wiki/SOLID" },
    ],
    aliases: ["solid", "gof patterns", "oop patterns"],
  },
  {
    slug: "websockets",
    canonicalName: "WebSockets",
    category: "concept",
    blurb: "Full-duplex client-server communication. Real-time chat, live cursors, multiplayer — anywhere SSE isn't enough.",
    links: [
      { title: "MDN — WebSocket API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
      { title: "Ably — WebSockets concept guide", url: "https://ably.com/topic/websockets" },
    ],
    aliases: ["socket.io", "real-time websockets"],
  },
  {
    slug: "caching",
    canonicalName: "Caching",
    category: "concept",
    blurb: "Cache invalidation is one of the two hard problems in CS. Learn patterns before reaching for Redis.",
    links: [
      { title: "AWS — Caching best practices", url: "https://aws.amazon.com/caching/best-practices/" },
      { title: "Redis — Client-side caching", url: "https://redis.io/docs/latest/develop/reference/client-side-caching/" },
      { title: "MDN — HTTP caching", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
    ],
    aliases: ["cache", "cache invalidation", "caching strategies"],
  },
  {
    slug: "observability",
    canonicalName: "Observability",
    category: "concept",
    blurb: "Logs, metrics, traces. You can't operate what you can't measure — start instrumenting before you need it.",
    links: [
      { title: "OpenTelemetry docs", url: "https://opentelemetry.io/docs/concepts/" },
      { title: "Google SRE Book — Monitoring", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
      { title: "Honeycomb — guide to observability", url: "https://www.honeycomb.io/blog/observability-101-terminology-and-concepts" },
    ],
    aliases: ["o11y", "monitoring", "logging", "tracing"],
  },
  {
    slug: "machine-learning",
    canonicalName: "Machine Learning",
    category: "concept",
    blurb: "Algorithms that learn from data. Start with classical ML before diving into deep learning.",
    links: [
      { title: "Andrew Ng — ML Specialization (Coursera)", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { title: "fast.ai — Practical Deep Learning", url: "https://course.fast.ai/" },
      { title: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
    ],
  },
  {
    slug: "deep-learning",
    canonicalName: "Deep Learning",
    category: "concept",
    blurb: "Neural networks at scale. Foundation for modern AI — vision, language, multimodal.",
    links: [
      { title: "fast.ai — Practical Deep Learning", url: "https://course.fast.ai/" },
      { title: "DeepLearning.AI specialization", url: "https://www.coursera.org/specializations/deep-learning" },
      { title: "The Little Book of Deep Learning", url: "https://fleuret.org/francois/lbdl.html" },
    ],
  },
  {
    slug: "llm",
    canonicalName: "Large Language Models",
    category: "concept",
    blurb: "Foundation models for text. Understand tokenization, attention, and prompting before frameworks.",
    links: [
      { title: "Andrej Karpathy — LLM intro (1hr video)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
      { title: "Anthropic docs — building with Claude", url: "https://docs.anthropic.com/en/docs/intro" },
      { title: "OpenAI cookbook", url: "https://cookbook.openai.com/" },
    ],
  },
  {
    slug: "prompt-engineering",
    canonicalName: "Prompt Engineering",
    category: "concept",
    blurb: "The discipline of getting useful, reliable outputs from LLMs. Pattern-driven, not magic.",
    links: [
      { title: "Anthropic — Prompt engineering overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { title: "OpenAI — Prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" },
      { title: "Prompting Guide (open-source)", url: "https://www.promptingguide.ai/" },
    ],
  },
  {
    slug: "rag",
    canonicalName: "Retrieval-Augmented Generation",
    category: "concept",
    blurb: "Combining retrieval over your data with LLM generation. The default pattern for AI products that need to cite or stay current.",
    links: [
      { title: "Anthropic — Contextual retrieval", url: "https://www.anthropic.com/news/contextual-retrieval" },
      { title: "LangChain — RAG tutorial", url: "https://python.langchain.com/docs/tutorials/rag/" },
      { title: "Pinecone — Learning Center", url: "https://www.pinecone.io/learn/" },
    ],
  },
  {
    slug: "vector-search",
    canonicalName: "Vector Search",
    category: "concept",
    blurb: "Search by semantic similarity using embeddings. Powers RAG, recommendations, semantic search.",
    links: [
      { title: "Pinecone — Vector DB primer", url: "https://www.pinecone.io/learn/vector-database/" },
      { title: "Weaviate — academy", url: "https://weaviate.io/developers/academy" },
      { title: "pgvector docs (Postgres extension)", url: "https://github.com/pgvector/pgvector" },
    ],
  },
  {
    slug: "embedding-models",
    canonicalName: "Embedding Models",
    category: "concept",
    blurb: "Models that turn text/images into vectors. The substrate under RAG and vector search.",
    links: [
      { title: "Cohere — embeddings guide", url: "https://docs.cohere.com/docs/embeddings" },
      { title: "MTEB leaderboard (compare embedding models)", url: "https://huggingface.co/spaces/mteb/leaderboard" },
      { title: "Hugging Face — sentence-transformers", url: "https://www.sbert.net/" },
    ],
  },
  {
    slug: "mlops",
    canonicalName: "MLOps",
    category: "concept",
    blurb: "Putting ML/AI in production: versioning, monitoring, evaluation, drift detection, A/B testing of models.",
    links: [
      { title: "Made With ML — MLOps course (free)", url: "https://madewithml.com/" },
      { title: "Google — MLOps whitepaper", url: "https://cloud.google.com/resources/mlops-whitepaper" },
      { title: "Chip Huyen — Designing ML Systems (book)", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" },
    ],
    aliases: ["production ai", "ai in production", "ml in production", "production ml"],
  },
  {
    slug: "ai-safety-ethics",
    canonicalName: "AI Safety & Ethics",
    category: "concept",
    blurb: "Bias, privacy, evaluation, alignment, and responsible deployment of AI systems.",
    links: [
      { title: "Anthropic — Responsible Scaling Policy", url: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
      { title: "Google — Responsible AI practices", url: "https://ai.google/responsibility/responsible-ai-practices/" },
      { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    ],
    aliases: ["data privacy", "ai ethics", "responsible ai", "ai safety"],
  },
];

// ── Lookup index: canonical name (lowercased) → resource slug ────────────────
const SLUG_BY_CANONICAL: Map<string, string> = new Map(
  LEARNING_RESOURCES.map((r) => [r.canonicalName.toLowerCase().trim(), r.slug])
);

// All searchable phrases (canonical names + aliases), sorted longest first.
// Longest-first means more specific phrases win over shorter ones.
const SEARCH_PHRASES: { needle: string; slug: string }[] = LEARNING_RESOURCES.flatMap((r) => {
  const phrases: { needle: string; slug: string }[] = [
    { needle: r.canonicalName.toLowerCase().trim(), slug: r.slug },
  ];
  for (const alias of r.aliases ?? []) {
    phrases.push({ needle: alias.toLowerCase().trim(), slug: r.slug });
  }
  return phrases;
}).sort((a, b) => b.needle.length - a.needle.length);

/**
 * Resolve a roadmap item title to a /resources anchor slug. Returns null when
 * the title doesn't match any curated resource.
 *
 * Matching strategy:
 *   1. Exact match on the lowercased+trimmed title (fast path)
 *   2. Substring containment: does the title contain a canonical name as a
 *      whole-word? Picks the longest match to avoid e.g. matching "ML" inside
 *      "XMLParser". Bounded with simple word-boundary checks.
 *
 * AI-generated roadmap titles are frequently phrased like "Machine Learning
 * Fundamentals" or "Vector Databases & Embeddings" — exact match alone misses
 * these even when the underlying skill is clearly in our resource list.
 */
export function findResourceSlug(itemTitle: string): string | null {
  const normalized = itemTitle.toLowerCase().trim();
  if (!normalized) return null;

  // Tier 1 — exact match
  const exact = SLUG_BY_CANONICAL.get(normalized);
  if (exact) return exact;

  // Tier 2 — substring containment with word-boundary checks
  for (const { needle, slug } of SEARCH_PHRASES) {
    const idx = normalized.indexOf(needle);
    if (idx === -1) continue;
    const before = idx === 0 ? "" : normalized[idx - 1];
    const after = normalized[idx + needle.length] ?? "";
    const isWordStart = before === "" || !/[a-z0-9]/i.test(before);
    const isWordEnd = after === "" || !/[a-z0-9]/i.test(after);
    if (isWordStart && isWordEnd) return slug;
  }

  return null;
}

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  language: "Languages",
  framework: "Frameworks & Libraries",
  database: "Databases",
  devops: "Cloud & DevOps",
  tool: "Tools",
  concept: "Concepts",
};

export const CATEGORY_ORDER: ResourceCategory[] = [
  "language",
  "framework",
  "database",
  "devops",
  "tool",
  "concept",
];
