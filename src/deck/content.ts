import type { Announcement, Chapter } from './types';

export const event = {
  name: 'Microsoft Ignite 2026',
  subtitle: 'Azure · Foundry · GitHub',
};

// Authored from news/*.md. Keep facts faithful to the source; keep wording short.
// See .agents/skills/update-presentation/SKILL.md for the style guide.

export const chapters: Chapter[] = [
  {
    id: 'azure',
    title: 'Azure',
    accent: '#3b9cff',
    tagline: 'AI has moved into production, and agents need the whole stack: built from chip to agent.',
    points: [
      { name: 'Azure Cobalt 200 virtual machines', status: 'GA' },
      { name: 'Azure HorizonDB', status: 'GA' },
      { name: 'Rayfin', status: 'GA' },
      { name: 'Fabric apps', status: 'GA' },
      { name: 'Foundry models and agents on Azure Kubernetes Service', status: 'Preview' },
      { name: 'Azure SRE Agent and expanded confidential computing', note: 'To operate and protect them' },
    ],
    takeaway: 'Built from chip to agent, with the security and control to run AI at scale.',
  },
  {
    id: 'foundry',
    title: 'Foundry',
    accent: '#b58cff',
    tagline: 'AI systems that keep improving, driven by live signals and your own definition of good.',
    points: [
      { name: 'Agent optimizer', note: 'Improves each step of the agent loop using your evaluations' },
      { name: 'Automatic post-training for models', note: 'Programmable options for advanced users' },
      { name: 'New Microsoft AI (MAI) models and partner offerings' },
      { name: 'Foundry IQ', note: 'An enterprise knowledge graph over your unstructured and application data, out of the box' },
    ],
    takeaway: 'Agents and models that improve continuously from live signals.',
  },
  {
    id: 'github',
    title: 'GitHub',
    accent: '#46d37a',
    tagline: 'Build agents, work across tools and ship higher-quality code.',
    points: [
      { name: 'Microsoft Copilot SDK 2.0', note: 'Native Rust runtime, six languages' },
      { name: 'GitHub Copilot app', note: 'Azure DevOps repos from clone to merge; testing in a real, logged-in browser' },
      { name: 'Copilot code review', note: 'Local reviews in the CLI and app, secret detection, adaptive effort, cross-repo context, repository insights' },
    ],
    takeaway: 'Build agents, work across tools, ship higher-quality code.',
  },
];

export const announcements: Announcement[] = [
  // ───────────── Azure ─────────────
  {
    id: 'chaos-studio',
    chapter: 'azure',
    source: 'Azure Chaos Studio',
    name: 'Azure Chaos Studio',
    title: 'Test failure before it finds you',
    problem: 'Will your app recover when an availability zone or a database goes down?',
    announced: 'Chaos Studio Workspaces and the Chaos Studio extension for AKS are generally available.',
    why: 'Find weaknesses and fix them in a controlled environment, before similar failures happen unexpectedly.',
    statuses: ['GA'],
    visuals: [
      {
        kind: 'flow',
        title: 'How a resilience test runs',
        steps: [
          { label: 'Define', detail: 'Choose the resources to test in a workspace' },
          { label: 'Apply a scenario', detail: 'Reusable: loss of an availability zone, database failover' },
          { label: 'Inject controlled failure', detail: 'On AKS: pods, with fewer permissions required' },
          { label: 'Observe recovery', detail: 'See how the app responds and recovers' },
          { label: 'Repeat', detail: 'Re-run the same tests over time' },
        ],
      },
    ],
    whatsNew: [
      { name: 'Chaos Studio Workspaces', status: 'GA', note: 'Organize and run resilience tests' },
      { name: 'Chaos Studio extension for AKS', status: 'GA', note: 'A more secure way to disrupt Kubernetes pods' },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/reliability-and-resiliency-in-azure/introducing-the-next-chapter-of-azure-chaos-studio/4574151' }],
    notes: 'Workspaces make tests repeatable: define resources once, reuse scenarios. The AKS extension needs fewer permissions to run experiments.',
  },
  {
    id: 'agentic-operations',
    chapter: 'azure',
    source: 'Azure expands agentic operations with new monitoring, AI capabilities',
    name: 'Agentic operations',
    title: 'AI agents join your operations team',
    problem: 'Teams want faster investigations and continuous optimization, without giving up control.',
    announced: 'New agentic capabilities across Azure Monitor, Azure Copilot and Azure SRE Agent.',
    why: 'Move from agent experimentation to production, with governance and humans in control.',
    statuses: ['GA', 'Preview'],
    highlight: true,
    visuals: [
      {
        kind: 'flow',
        title: 'From telemetry to resolution',
        steps: [
          { label: 'Telemetry', detail: 'Signals from your applications' },
          { label: 'Health model', detail: 'A real-time health graph of architecture, dependencies and business priorities' },
          { label: 'Agents investigate', detail: 'Root cause, remediation, automated workflows' },
          { label: 'Governed', detail: 'Customer-managed keys, Entra Agent ID, Agent 365 integration' },
          { label: 'Humans in control', detail: 'Cross-agent context, Teams, multicloud investigations' },
        ],
      },
    ],
    whatsNew: [
      { name: 'Natural language in Azure Monitor', status: 'GA', note: 'Plan and deploy cloud workloads' },
      { name: 'Azure Monitor health models', status: 'GA', note: 'Prioritize incidents by business impact' },
      { name: 'Azure Copilot spaces and custom skills', status: 'Preview', note: 'Tailored agents with persistent context' },
      { name: 'Azure Workload Center', status: 'Preview', note: 'Oracle and SAP health monitoring and validation' },
      { name: 'Azure SRE Agent', status: 'Preview', note: 'Enterprise-scale security, governance and collaboration' },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/azureinfrastructureblog/advancing-agentic-operations-on-azure-at-ignite-2026/4573831' }],
    notes: 'Health models tell agents (and people) what is affected and whether it is the platform or the app. Governance is the story for SRE Agent: customer-managed keys, Entra Agent ID, Agent 365. Verify the source link: the original had a typo (hhttps).',
  },
  {
    id: 'azure-catalyst',
    chapter: 'azure',
    source: 'Introducing Azure Catalyst',
    name: 'Azure Catalyst',
    title: 'One connected, agent-led path to modernization',
    problem: 'Modernizing infrastructure, applications and data takes a lot of manual effort.',
    announced: 'A unified experience for agentic modernization across Azure and GitHub, generally available.',
    why: 'Unlock the business logic in existing applications to build new AI-powered experiences and agentic business processes.',
    statuses: ['GA', 'Preview'],
    highlight: true,
    visuals: [
      {
        kind: 'flow',
        title: 'The modernization lifecycle',
        steps: [
          { label: 'Discover', detail: 'AI-powered application discovery and estate-wide insights' },
          { label: 'Plan', detail: 'Modernization strategy and cost comparisons' },
          { label: 'Migrate', detail: 'Applications, databases, storage and networking' },
          { label: 'Modernize', detail: 'Agent-assisted execution in Azure Copilot and GitHub Copilot' },
        ],
      },
    ],
    whatsNew: [
      { name: 'Azure Catalyst agent', status: 'GA', note: 'Formerly the Azure Copilot migration agent' },
      { name: 'Deeper modernization and execution', status: 'Preview', note: 'New agent capabilities' },
      { name: 'GitHub Copilot modernization', status: 'GA', note: 'Agent governance rulebooks; bring your own model in CLI and IDEs' },
      { name: 'App + database modernization, BizTalk to Logic Apps', status: 'Preview' },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/appsonazureblog/azure-catalyst-one-connected-agent-led-modernization-experience-across-apps-data/4573988' }],
    notes: 'The pitch is one lifecycle across Azure Copilot and GitHub Copilot. Catalyst agent is the renamed Azure Copilot migration agent.',
  },
  {
    id: 'cosmos-db',
    chapter: 'azure',
    source: 'Azure Cosmos DB improves development, retrieval and data protection',
    name: 'Azure Cosmos DB',
    title: 'Build, retrieve, protect',
    problem: 'Apps need better retrieval, faster design and safer production data.',
    announced: 'Updates across the Cosmos DB application lifecycle.',
    why: 'Improve retrieval relevance, help teams design and evolve applications, and protect production data.',
    statuses: ['GA', 'Preview'],
    visuals: [
      {
        kind: 'grid',
        title: 'What is new',
        groups: [
          {
            title: 'Build',
            items: [
              { name: 'Cosmos DB Shell', status: 'GA', note: 'In VS Code and the portal, with MCP integration' },
              { name: 'AI-assisted data modeler', status: 'Preview', note: 'Guided partition key and container modeling in VS Code' },
              { name: 'Rust SDK', status: 'GA', note: 'Native client with built-in resilience' },
            ],
          },
          {
            title: 'Retrieve',
            items: [
              { name: 'Semantic reranker', status: 'GA', note: 'Reorders results by meaning and context' },
              { name: 'FuzzyBM25 score projection', status: 'GA', note: 'Relevance scores available to your app' },
            ],
          },
          {
            title: 'Protect',
            items: [{ name: 'Azure Backup for Cosmos DB', status: 'GA', note: 'Independent, vault-based policies, retention and recovery' }],
          },
        ],
      },
    ],
    links: [{ label: 'Cosmos DB blog', url: 'https://devblogs.microsoft.com/cosmosdb/whats-new-azure-cosmos-db-ignite-2026/' }],
    notes: 'The source says seven updates but lists six; confirm the count before saying a number on stage.',
  },
  {
    id: 'documentdb',
    chapter: 'azure',
    source: 'Azure DocumentDB expands developer tools, sovereignty and security',
    name: 'Azure DocumentDB',
    title: 'MongoDB-compatible, where your data has to live',
    problem: 'Some workloads must stay where data must reside, and still need least-privilege access.',
    announced: 'Five updates for faster development, hybrid deployment and finer access control.',
    why: 'Keep applications and data in your own environments for sovereignty and residency, with least-privilege access.',
    statuses: ['GA', 'Preview'],
    visuals: [
      {
        kind: 'grid',
        title: 'What is new',
        groups: [
          {
            title: 'Build faster',
            items: [
              { name: 'VS Code extension', status: 'GA', note: 'Browse, inspect and query without leaving the editor' },
              { name: 'Near-instant provisioning', status: 'GA', note: 'M10 through M30 clusters' },
            ],
          },
          {
            title: 'Run anywhere',
            items: [
              { name: 'DocumentDB enabled by Azure Arc', status: 'Preview', note: 'Hybrid and multicloud' },
              { name: 'DocumentDB on Azure Local', status: 'Preview', note: 'In your own environment' },
            ],
          },
          {
            title: 'Control access',
            items: [{ name: 'Fine-grained RBAC', status: 'Preview', note: 'Scope roles to databases and collections' }],
          },
        ],
      },
    ],
    links: [{ label: 'DocumentDB blog', url: 'https://devblogs.microsoft.com/documentdb/whats-new-azure-documentdb-ignite-2026/' }],
    notes: 'Sovereignty angle: Arc and Azure Local run MongoDB-compatible workloads where data needs to reside. Both are preview.',
  },
  {
    id: 'managed-redis',
    chapter: 'azure',
    source: 'Azure Managed Redis previews Redis 8 and an agent kit',
    name: 'Azure Managed Redis',
    title: 'Redis 8 and an agent kit',
    problem: 'AI apps need search, vectors and memory, without managing capabilities one by one.',
    announced: 'Redis 8 and an Azure Managed Redis agent kit, both in preview.',
    why: 'Store, search and work with more kinds of data in one managed Azure service.',
    statuses: ['Preview'],
    visuals: [
      {
        kind: 'converge',
        title: 'One Redis version',
        from: ['JSON', 'Search', 'Time series', 'Vector search'],
        to: { name: 'Redis 8 in Azure Managed Redis', status: 'Preview', note: 'Simpler capability management' },
      },
    ],
    whatsNew: [
      { name: 'Redis 8', status: 'Preview', note: 'Related info, recommendations, reused AI responses, agent context and memory' },
      { name: 'Agent kit', status: 'Preview', note: 'Reviews how your app uses Redis and suggests reliability, network and performance fixes' },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/azure-managed-redis/what%E2%80%99s-new-in-azure-managed-redis-at-microsoft-ignite-2026/4574168' }],
    notes: 'Two previews. The agent kit brings Redis and Azure guidance into AI-assisted development.',
  },
  {
    id: 'azure-sql',
    chapter: 'azure',
    source: 'Azure SQL expands modernization, resiliency and local development options',
    name: 'Azure SQL',
    title: 'Modernize, stay resilient, develop locally',
    problem: 'SQL Server workloads need a path to modernize, protect and develop against Azure SQL.',
    announced: 'Updates for resiliency, migration and disaster recovery, and local development.',
    why: 'Build and test locally on the same engine, then move to Azure SQL Database with resilient, low-downtime paths.',
    statuses: ['GA', 'Preview'],
    visuals: [
      {
        kind: 'grid',
        title: 'What is new',
        groups: [
          {
            title: 'Stay resilient',
            items: [
              { name: 'Zone redundancy', status: 'GA', note: 'Managed Instance Next-gen General Purpose' },
              { name: 'Flexible memory', status: 'GA', note: 'Adjust memory without adding cores' },
            ],
          },
          {
            title: 'Migrate and recover',
            items: [{ name: 'Managed Instance link for multi-database availability groups', status: 'GA', note: 'Near real-time replication with minimal downtime' }],
          },
          {
            title: 'Develop locally',
            items: [{ name: 'Azure SQL Database container', status: 'Preview', note: 'Same engine, no Azure subscription; free locally' }],
          },
        ],
      },
    ],
    links: [{ label: 'Azure SQL blog', url: 'https://devblogs.microsoft.com/azure-sql/whats-new-across-microsoft-sql-at-microsoft-ignite-2026/' }],
    notes: 'Local development is free; cloud database and model usage stay subject to their charges. The container supports Always Encrypted with secure enclaves, ledger and vector search.',
  },
  {
    id: 'postgresql',
    chapter: 'azure',
    source: 'PostgreSQL on Azure simplifies migration and expands modernization options',
    name: 'PostgreSQL on Azure',
    title: 'A first-party path to PostgreSQL',
    problem: 'Moving workloads to Azure, keeping them current and protecting them is a lifecycle problem.',
    announced: 'Updates across the PostgreSQL lifecycle: migrate, scale, protect and stay available.',
    why: 'Grow your use of PostgreSQL for critical and regulated applications without giving up performance, protection or resilience.',
    statuses: ['GA', 'Preview'],
    visuals: [
      {
        kind: 'grid',
        title: 'What is new',
        groups: [
          {
            title: 'Migrate',
            items: [
              { name: 'Azure DMS: Oracle to PostgreSQL', status: 'Preview' },
              { name: 'Azure DMS: to Azure HorizonDB', status: 'Preview' },
            ],
          },
          {
            title: 'Scale',
            items: [
              { name: 'Burstable v2 compute', status: 'Preview' },
              { name: 'Cobalt 200', status: 'GA', note: 'Arm64 alongside Intel and AMD x64' },
            ],
          },
          {
            title: 'Protect',
            items: [
              { name: 'AMD v6 confidential compute', status: 'GA', note: 'Protects data in use' },
              { name: 'Point-in-time restore immutability', status: 'GA', note: 'Backups safe from change or deletion' },
            ],
          },
          {
            title: 'Stay available',
            items: [
              { name: 'Backup v2', status: 'Preview', note: 'Snapshot-based, larger databases' },
              { name: 'Same-zone to zone-redundant HA', status: 'GA', note: 'No server recreation' },
            ],
          },
        ],
      },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/adforpostgresql/more-power-more-resilience-better-value-azure-database-for-postgresql-at-ignite-/4573613' }],
    notes: 'First-party migration path: assessment, schema and app conversion in the VS Code extension, then data movement with Azure DMS.',
  },

  // ───────────── Foundry ─────────────
  {
    id: 'decision-model',
    chapter: 'foundry',
    source: 'Microsoft-Decision-1.1 now generally available',
    name: 'Microsoft-Decision-1.1',
    title: 'A model built for decisions, not conversations',
    problem: 'Hard-coded rules are brittle, and large general-purpose models cost too much for every decision.',
    announced: 'Microsoft-Decision-1.1 is generally available in Microsoft Foundry, OpenRouter and Vercel.',
    why: 'Decide dynamically at a fraction of the cost of larger models, and keep those for complex reasoning.',
    statuses: ['GA'],
    highlight: true,
    visuals: [
      {
        kind: 'flow',
        title: 'How it decides',
        steps: [
          { label: 'A request arrives', detail: 'Routing, classification, prioritization, verification, workflow control' },
          { label: 'Choose an action', detail: 'Only among permitted actions, within your constraints' },
          { label: 'Score confidence', detail: 'Calibrated, so the app can defer when uncertainty is high' },
          { label: 'Escalate if needed', detail: 'Larger models handle the complex reasoning' },
        ],
      },
      {
        kind: 'stats',
        title: 'Faster and more capable',
        items: [
          { value: '68', label: 'Artificial Analysis Decision Index v2.1' },
          { value: '+6', label: 'points over Microsoft-Decision-1' },
          { value: '2×', label: 'more than twice as fast as the first model' },
        ],
        footnote: 'Benchmark as reported in the Book of News. Same price as the first model; now with image inputs.',
      },
    ],
    whatsNew: [
      { name: 'Multimodal', note: 'Analyzes images in question instructions' },
      { name: 'In Copilot', note: 'Routes requests to Copilot or Cowork' },
      { name: 'In Cowork', note: 'Powers Auto, adjusting reasoning effort per task' },
    ],
    links: [{ label: 'Command Line', url: 'https://commandline.microsoft.com/microsoft-decision-model-ga/' }],
    notes: 'Three barriers to embedding AI in software: cost, latency, control. Benchmark comparison names competitors; quote it only as the source states, with the index name.',
  },
  {
    id: 'foundry-models',
    chapter: 'foundry',
    source: 'Microsoft Foundry adds new AI models for coding, images, security',
    name: 'Microsoft Foundry models',
    title: 'The right model for each task',
    problem: 'Different tasks call for different trade-offs of performance, cost and control.',
    announced: 'A growing first-party MAI family, plus partner models, in Microsoft Foundry.',
    why: 'Evaluate and deploy supported models in the same continuous-improvement workflow used for agents.',
    statuses: ['GA', 'Preview', 'Private preview'],
    highlight: true,
    visuals: [
      {
        kind: 'grid',
        title: 'New models and choices',
        groups: [
          {
            title: 'Code',
            items: [
              { name: 'MAI-Code-2', status: 'GA', note: 'Demanding agentic coding; GA in GitHub' },
              { name: 'MAI-Code-2-Flash', status: 'Private preview', note: 'High-volume coding; GA in GitHub, private preview in Foundry' },
            ],
          },
          { title: 'Create', items: [{ name: 'MAI-Image-2.7 and Flash', status: 'Preview', note: 'Sharper editing, consistent images' }] },
          { title: 'Secure', items: [{ name: 'MAI-Cyber-2-Flash', status: 'Preview', note: 'Find, confirm and fix vulnerabilities; only in Codename MDASH' }] },
          { title: 'Decisions', items: [{ name: 'Microsoft-Decision-1.1', status: 'GA', note: 'Now with image inputs' }] },
          { title: 'Route', items: [{ name: 'Model router', note: 'Top 50 models; AI Gateway support' }] },
          {
            title: 'Choice',
            items: [
              { name: '11,000+ models', note: 'OpenAI, Claude, Muse, Mistral, open source' },
              { name: 'Video models from fal', status: 'Preview', note: 'Kling, LTX, MiniMax' },
              { name: 'Baseten on Foundry', status: 'Preview' },
            ],
          },
        ],
      },
    ],
    links: [{ label: 'Tech Community blog', url: 'https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/from-model-choice-to-your-durable-advantage-build-ai-that-keeps-improving/4573609' }],
    notes: 'Availability varies per model; check each chip. MAI-Code-2-Flash is GA in GitHub but only private preview in Foundry. MAI-Cyber-2-Flash is preview only in Codename MDASH.',
  },

  // ───────────── GitHub ─────────────
  {
    id: 'copilot-sdk',
    chapter: 'github',
    source: 'Microsoft Copilot SDK 2.0 improves security and scale for AI apps',
    name: 'Microsoft Copilot SDK 2.0',
    title: 'Production-grade agents inside your apps',
    problem: 'Large-scale, multi-tenant applications need agents with robust enterprise security.',
    announced: 'Copilot SDK 2.0 is generally available, with a native Rust runtime.',
    why: 'The same harness technology deployed in production across Microsoft and GitHub, now for your own applications.',
    statuses: ['GA'],
    highlight: true,
    visuals: [
      {
        kind: 'stats',
        title: 'Copilot SDK 2.0',
        items: [
          { value: '2.0', label: 'Major release' },
          { value: 'Rust', label: 'Native runtime for the Copilot harness' },
          { value: '6', label: 'Supported programming languages' },
        ],
      },
    ],
    whatsNew: [
      { name: 'Agents inside applications', note: 'Integrate the harness directly in your app' },
      { name: 'Multi-tenant, high-scale apps', note: 'With enterprise-grade security' },
    ],
    links: [{ label: 'Command Line', url: 'https://commandline.microsoft.com/microsoft-copilot-sdk-2-0-github/' }],
    notes: 'The GitHub chapter intro also mentions the Copilot app (Azure DevOps clone to merge, real-browser testing) and Copilot code review; only the SDK has its own Book of News entry so far.',
  },
];
