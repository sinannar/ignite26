
# Azure
AI has moved into production, and agents need the whole stack. Azure brings silicon, infrastructure, data and operations into one system. Azure Cobalt 200 virtual machines, Azure HorizonDB, Rayfin and Fabric apps are now generally available. New previews bring Microsoft Foundry models and agents to Azure Kubernetes Service, with Azure SRE Agent and expanded confidential computing to operate and protect them.

These updates and the ones listed below mark the next chapter of Azure: built from chip to agent, with the security and control organizations need to run AI at scale.


## Azure Chaos Studio
Azure Chaos Studio Workspaces and the Azure Chaos Studio extension for Azure Kubernetes Service (AKS) are now generally available, expanding the ways organizations can test how applications respond to and recover from disruptions. These updates expand Azure Chaos Studio, a managed service that allows organizations to introduce controlled failures into applications to test how they respond and recover.

Azure Chaos Studio Workspaces provide a simpler way to organize and run resilience tests. Organizations can define the resources they want to test and apply reusable scenarios that represent disruptions, such as the loss of an availability zone or database failover. This makes it easier to test how an application responds to realistic disruptions and repeat those tests over time.

The Azure Chaos Studio extension for AKS brings resilience testing to applications running on AKS. The extension requires fewer permissions to run experiments, providing a more secure way for organizations to introduce controlled disruptions to Kubernetes pods and observe how applications respond and recover.

These updates help organizations validate whether applications can recover from disruptions as expected. By introducing failures in a controlled environment, organizations can identify weaknesses and make improvements before similar failures occur unexpectedly.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/reliability-and-resiliency-in-azure/introducing-the-next-chapter-of-azure-chaos-studio/4574151)



## Azure expands agentic operations with new monitoring, AI capabilities
Agentic operations bring AI agents directly into Azure, helping teams investigate issues faster, optimize resources continuously and act with greater confidence. Expanded agentic capabilities across Azure Monitor, Azure Copilot and Azure SRE Agent will deliver richer operational context, stronger governance and a common foundation for operational agents, while keeping humans in control.

New natural language capabilities, now generally available in Azure Monitor, help users plan and deploy cloud workloads. Azure Copilot spaces and custom skills, in preview, will allow teams to tailor agents for faster, more efficient and accurate operations while carrying persistent context. Users will also be able to extend agentic operations to Oracle and SAP through Azure Workload Center, in preview, for workload health monitoring and configuration validation.

New Azure SRE Agent capabilities, in preview, will enable secure agentic operations at enterprise scale. Customer-managed keys will give teams full control of agent data, while Entra Agent ID and Agent 365 integration will provide users with a consistent way to discover, govern, audit and manage agents throughout their lifecycle. Cross-agent communications will enable context and task-sharing across agents for faster incident resolution. Azure SRE Agent will also integrate with Microsoft Teams and extend investigations across multicloud environments. These updates will help organizations move from agent experimentation to deployment across complex production environments.

Azure Monitor health models, now generally available, turn telemetry into actionable health context. Users can translate telemetry into a real-time health graph that connects application architecture, dependencies and business priorities. This helps teams understand what is affected, distinguish platform issues from application failures and prioritize incidents by business impact. The same context enables AI agents to investigate issues, identify root causes, recommend remediation and automate workflows.

- [Learn more about this news.](hhttps://techcommunity.microsoft.com/blog/azureinfrastructureblog/advancing-agentic-operations-on-azure-at-ignite-2026/4573831)


## Introducing Azure Catalyst
Azure Catalyst is a new, unified experience for agentic modernization across Azure and GitHub that helps organizations modernize infrastructure, applications and data, and accelerate AI transformation. It is generally available.

Azure Catalyst brings together AI-powered discovery, planning, migration and modernization to help IT teams and developers work across the modernization lifecycle. By connecting estate-wide insights with agent-assisted execution in Azure Copilot and GitHub Copilot, organizations can reduce manual effort, modernize complex systems and unlock the business logic within existing applications to build new AI-powered experiences and agentic business processes.

Azure Catalyst brings together new and expanded capabilities, including:
- Azure Catalyst agent (formerly Azure Copilot migration agent), now generally available, with new capabilities in preview that extend the agent from migration planning into deeper modernization and execution. Enhancements include richer estate insights, AI-powered application discovery, modernization strategy and cost comparisons, and expanded planning and execution across applications, databases, storage and networking.
- GitHub Copilot modernization updates, including agent governance rulebooks, bring-your-own-model support in command-line interfaces and integrated development environments, now generally available. New capabilities, in preview, expand modernization scenarios like integrated application and database modernization, and migration from BizTalk to Azure Logic Apps.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-catalyst-one-connected-agent-led-modernization-experience-across-apps-data/4573988)



## Azure Cosmos DB improves development, retrieval and data protection
Azure Cosmos DB is introducing seven updates that improve search and retrieval quality, help developers design and evolve applications and strengthen protection for production data. They include:

Developer tools and application design
- Azure Cosmos DB Shell: Now generally available in Visual Studio Code and the Azure portal, the shell gives developers interactive access to explore resources, query and manage data, and enable AI-assisted workflows through MCP integration.
- AI-assisted data modeler and other updates in Azure Cosmos DB extension for VS Code: Now in preview, these updates will bring account insights, AI-powered recommendations and guided data modeling for partition keys and container configurations directly into VS Code.
- Rust SDK for Azure Cosmos DB: Now generally available, the SDK provides a native Rust client with built-in performance and resilience capabilities to help teams build reliable distributed production applications.

Search and retrieval quality
- Semantic reranker: Now generally available, this capability uses an AI model to evaluate candidate search results and reorder them according to the meaning and context of the query and content.
- FuzzyBM25 score projection updates in full-text search: Now generally available, these updates expand full-text search by making relevance scores available to applications.

Data movement and production protection
- Azure Backup for Azure Cosmos DB: Now generally available, Azure Backup adds an independent, vault-based protection layer for centralized backup policies, monitoring, retention and recovery.

Together, these updates support the Azure Cosmos DB application lifecycle: improving retrieval relevance, helping teams design and evolve applications and protecting production data.

- [Learn more about this news.](https://devblogs.microsoft.com/cosmosdb/whats-new-azure-cosmos-db-ignite-2026/)



## Azure DocumentDB expands developer tools, sovereignty and security
Azure DocumentDB is introducing five feature updates to help developers build applications, apply more-granular access controls and run MongoDB-compatible workloads across hybrid environments.

Faster development and provisioning
- Azure DocumentDB extension for Visual Studio Code: Now generally available, the extension lets developers connect to clusters, browse databases and collections, inspect documents and run queries—all within Visual Studio Code.
- Near-instant Azure DocumentDB cluster provisioning: Now generally available for M10 through M30 clusters, this capability reduces the wait for new environments. Developers and AI agents can begin testing, experimentation and production onboarding faster.

Hybrid deployment and data sovereignty
- DocumentDB enabled by Azure Arc: Now in preview, this offering will extend Azure DocumentDB to hybrid and multicloud environments. Organizations will have more flexibility to run MongoDB-compatible workloads where their applications and data need to reside, including scenarios with data sovereignty, residency and infrastructure-control requirements.
- DocumentDB on Azure Local: Now in preview, this offering will run MongoDB-compatible document workloads on Azure Local infrastructure. Organizations will be able to keep applications and data within their own environments to support sovereignty, residency and regulatory requirements.

More-granular access controls
- Fine-grained role-based access control for databases and collections: Now in preview, Azure DocumentDB will let organizations scope custom roles and permissions to individual databases and collections. This will support least-privilege access without granting users and applications broader cluster-level permissions than they need.

- [Learn more about this news.](https://devblogs.microsoft.com/documentdb/whats-new-azure-documentdb-ignite-2026/)



## Azure Managed Redis previews Redis 8 and an agent kit
Azure Managed Redis is introducing two preview updates to help developers build responsive modern and AI applications:
- Redis 8 in Azure Managed Redis: This update to the existing service will combine support for JSON, search, time-series data, vector search and other data types in one Redis version, simplifying capability management. Applications will be able to find related information, provide recommendations, reuse relevant responses to similar AI requests and give AI agents access to context and memory. The update will expand how applications can store, search and work with data while retaining Azure Managed Redis as a managed Azure service.
- Azure Managed Redis agent kit: This preview will bring Redis and Azure guidance into AI-assisted development by reviewing how applications connect to and use Azure Managed Redis. The agent kit will identify configuration settings that could affect reliability, network connections and performance, then suggest changes for developers to evaluate. This will help teams identify common configuration concerns and apply more consistent development practices.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/azure-managed-redis/what%E2%80%99s-new-in-azure-managed-redis-at-microsoft-ignite-2026/4574168)



## Azure SQL expands modernization, resiliency and local development options
Azure SQL updates will help organizations modernize SQL Server workloads and build cloud and AI applications. They expand resiliency and resource flexibility, simplify migration and disaster recovery, and bring Azure SQL Database development to local environments.

### Resiliency and flexible resources
The Azure SQL Managed Instance Next-gen General Purpose tier now offers two generally available updates:

- Zone redundancy: Service components are distributed across Azure availability zones in supported regions, helping protect applications against datacenter outages without changing application logic.
- Flexible memory for zone-redundant instances: Customers using Premium-series hardware can adjust memory independently of processing capacity to meet workload needs without adding processor cores.
Azure SQL Managed Instance is a fully managed cloud database service based on SQL Server. It handles routine backups, patching and database engine updates. The new capabilities help organizations improve resiliency and tailor resources to their workloads.

### Migration and disaster recovery
- Now generally available, Azure SQL Managed Instance link supports SQL Server Always On availability groups containing multiple databases. It replicates database changes from SQL Server to Azure SQL Managed Instance in near real time, enabling migrations with minimal downtime and disaster recovery in Azure.
- Customers can extend supported existing availability groups or create new groups from standalone databases. A single link can replicate every database in a group, reducing the need to configure a separate link for each one.

### Local development with Azure SQL Database
- Azure SQL Database container, now in preview, will allow developers to run the Azure SQL Database engine locally without an Azure subscription, shared cloud instance or credit card. Developers will be able to build and test with the same database engine, T-SQL dialect, system views, connection protocol and driver behavior used in Azure SQL Database.

- The container will support Always Encrypted with secure enclaves, ledger, vector search and embedding workflows. Developers will be able to use familiar drivers, frameworks and Visual Studio Code tooling, and run integration tests in continuous integration environments before moving applications to Azure SQL Database. Local development will be free; cloud database and model usage will remain subject to their respective charges.

- [Learn more about this news.](https://devblogs.microsoft.com/azure-sql/whats-new-across-microsoft-sql-at-microsoft-ignite-2026/)



## PostgreSQL on Azure simplifies migration and expands modernization options
Microsoft is investing across the PostgreSQL lifecycle to simplify adoption and modernization. The updates help enterprises move workloads to Azure, keep them current and run demanding applications with built-in performance, security and resilience.
- Simpler migration and modernization. Azure Database Migration Service (DMS) support for Oracle-to-PostgreSQL data migration is now in preview. Combined with assessment, schema conversion and application conversion in the Microsoft PostgreSQL extension for VS Code, it will provide a first-party path from preparation and code conversion to data movement. Additionally, customers will be able to use Azure DMS, in preview, to move existing Azure Database for PostgreSQL workloads to Azure HorizonDB through a seamless, managed experience. DMS will handle connectivity validation, data copy, continuous synchronization for online migrations, monitoring and planned cutover, simplifying modernization on a high-performance, scalable PostgreSQL platform.
- More choice for performance and scale. Burstable v2 compute, in preview, will add flexibility for development and workloads with changing demands. Cobalt 200, now generally available for Azure Database for PostgreSQL, adds Microsoft-designed Arm64-based compute alongside Intel and AMD x64-based options. Customers can choose the architecture that best fits their workloads as they modernize and scale on Azure.
- Stronger protection for sensitive workloads. AMD v6 confidential compute, now generally available, helps protect data in use. Point-in-time restore immutability, also generally available, helps protect backups against changes or deletion.
- Expanded backup and resilience. Azure Backup for Azure Database for PostgreSQL flexible server and elastic clusters version 2, in preview, will support larger databases with snapshot-based backups and direct restore. Same-zone to zone-redundant high availability conversion, now generally available, helps protect against availability zone failures without recreating servers.

These enhancements strengthen PostgreSQL on Azure for critical and regulated applications. Organizations can expand their use of PostgreSQL as their needs grow while maintaining performance, protection and resilience.


- [Learn more about this news.](https://techcommunity.microsoft.com/blog/adforpostgresql/more-power-more-resilience-better-value-azure-database-for-postgresql-at-ignite-/4573613)


# Foundry
Updates to Foundry provide new capabilities to enable continuous improvement for AI agents and models, leveraging live signals to suggest and promote changes to every layer of AI systems.

Led by agent optimizer, Foundry updates each step of the agent loop leveraging the customer’s unique definition of good and respective evaluations.

This is combined with new training capabilities that enable models to be post-trained automatically, with programable options for advanced users. To support this, Foundry is bringing new Microsoft AI (MAI) models and partner offerings.

Foundry IQ, part of Microsoft IQ, now provides an enterprise knowledge graph out of the box over customers full estate of unstructured and application data, enabling rich experiences for custom applications and use cases.

## Microsoft-Decision-1.1 now generally available
Microsoft-Decision-1.1, now generally available, is a fast, cost-effective model designed to make reliable decisions in software at scale. It enables applications to make intelligent decisions dynamically, rather than relying on hard-coded rules, while addressing three key challenges to embedding AI more broadly in software: cost, latency and control. The model is ready for enterprise production deployment and available in Microsoft Foundry and through OpenRouter and Vercel. 

Unlike general-purpose LLMs, Microsoft-Decision-1.1 is purpose-built for structured decisions such as routing, classification, prioritization, verification and workflow control. It chooses among permitted actions within developer-defined constraints and provides calibrated confidence scores, allowing applications to defer when uncertainty is high. It handles decisions quickly at a fraction of the cost of larger models, which can then be reserved for more complex reasoning tasks. 

Building on Microsoft-Decision-1, released in October, the new model delivers significant improvements in intelligence and speed, at the same competitive price. It’s built on a new base, Gemma 4 26B A4B, and adds multimodal support to analyze images in question instructions.

On the Artificial Analysis Decision Index v2.1, Microsoft-Decision-1.1 scores 68, up six points from the first model and ahead of Jev 1.14, Google’s Gemini-Decision-1 and OpenAI’s GPT-6 Luna (Decisions). Microsoft-Decision-1.1 is also more than twice as fast as the first model.

The model is being integrated across Microsoft products to make faster, more token-efficient decisions, including:
- In Copilot, Microsoft-Decision-1.1 routes user requests to the right experience, determining whether they’re best handled by Copilot or Cowork. 
- In Cowork, it powers Auto, dynamically adjusting how much reasoning effort Cowork applies to each task.

- [Learn more about this news.](https://commandline.microsoft.com/microsoft-decision-model-ga/)


## Microsoft Foundry adds new AI models for coding, images, security
New models in Microsoft Foundry give organizations more choice in matching the right model to each task, along with the control to keep improving models with their own context. Foundry now includes a growing first-party family from Microsoft AI (MAI) and others, built for enterprise trust and efficiency at scale. Benefits of the new models include:
- Code: MAI-Code-2 handles demanding agentic coding work, while MAI-Code-2-Flash supports high-volume, everyday coding, so developers can pick the balance of performance and cost that fits the task. Both are generally available in GitHub, and Code-2-Flash is in private preview in Foundry.
- Create: MAI-Image-2.7 and MAI-Image-2.7-Flash are in preview and will offer sharper editing and more consistent image generation, helping brands keep one look across a campaign.
- Secure: MAI-Cyber-2-Flash is purpose-built for cybersecurity and available in preview only in Codename MDASH. With new capabilities spanning code vulnerability discovery, validation and remediation, it helps security teams find, confirm and fix vulnerabilities faster and more cost-effectively.
- Decisions: Microsoft-Decision-1.1 is now generally available. Built on Gemma, it supports fast, cost-effective routing, classification, prioritization and verification, now including image inputs. Alongside Laya and the Decisions API, it gives developers more ways to choose the decision model that fits each workload and bring decision capabilities into agents and workflows with less integration complexity.
- Route: Model router in Foundry Models makes model selection easier. With an expanded model pool featuring the top 50 models in Foundry, support for the model router in AI Gateway and expanded support for messages and responses APIs, customers can bring intelligent model selection into their existing workflows. They can also access a broader range of models and optimize for quality, cost and performance without the complexity of manually selecting and managing models.
- Choice: Microsoft Foundry offers more than 11,000 models from OpenAI, Claude, Muse, Mistral, the open-source community and others. Video generation models from fal, including Kling, LTX and MiniMax, are now in preview in Foundry. Baseten on Foundry, also in preview, will bring Baseten’s inference platform into Foundry so organizations can run open models optimized for speed, throughput and cost, with serverless pay-as-you-go deployments globally or in the US Data Zone.

Supported models can be evaluated and deployed in Foundry as part of the same continuous improvement workflow used for agents.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/from-model-choice-to-your-durable-advantage-build-ai-that-keeps-improving/4573609)




# GitHub
New Copilot capabilities are helping developers build agents, work across tools and ship higher-quality code. Microsoft Copilot SDK 2.0 brings a production-proven harness to secure, scalable agent deployments. Powered by a native Rust runtime, the harness is available in six languages. The GitHub Copilot app takes Azure DevOps repos from clone to merge, and brings testing to a real, logged-in browser. Copilot code review helps catch issues earlier with local reviews in the CLI and app, secret detection, adaptive review effort, cross-repository context and repository insights.



## Microsoft Copilot SDK 2.0 improves security and scale for AI apps
Microsoft Copilot SDK is now 2.0, a major improvement for enterprises seeking to build agents, especially for large-scale deployments. This update includes the improved Copilot harness built on a native Rust runtime, enabling developers to integrate agents directly inside applications, as well as multi-tenant, high-scale applications that require robust enterprise security.

The SDK uses the same harness technology deployed in production across Microsoft and GitHub and is supported across six programming languages. This is now generally available.

- [Learn more about this news.](https://commandline.microsoft.com/microsoft-copilot-sdk-2-0-github/)


# Microsoft Copilot
As the way we work with AI has evolved, so has Microsoft Copilot. The new Copilot includes Home, the single starting point for Chat and Cowork; Auto, the smart router for Copilot that dynamically picks the right models and effort for your task, optimizing for quality, speed and cost; and Word, Excel and PowerPoint in Copilot to create and collaborate on files alongside your conversation. It also includes Code, which lets anyone build secure apps using natural language and Autopilot, a persistent, proactive agent for personal productivity. Copilot Managed Runtime securely hosts what you build in Cowork, Code and Copilot Studio. 

These updates, detailed below, signal the next chapter of Copilot built for work: a connected platform where people and AI collaborate, with the context, choice and control organizations need to get more done. 
- [Learn more about this news.](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)

## Autopilot is rolling out to Frontier customers
Autopilot is Microsoft’s first enterprise-grade, long-running agent for personal productivity. It will live in an organization’s tenant with its own identity, memory and access to tools, and can follow up on threads, run recurring work and continue a project without waiting for another prompt. Designed for collaboration, colleagues will be able to @mention a person’s Autopilot in a Teams channel or group chat to ask for information or request supported actions. Autopilot is designed for security: Actions it takes (even on a user’s behalf) aretied to its own agent ID and safety-checked, and it is visible and manageable by admins. Customers will be able to find Autopilot in the left navigation of the Copilot app. Autopilot is rolling out through the Frontier program.

- [Learn more about this news.](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)
- [Autopilot](https://www.microsoft.com/en-us/copilot/features/autopilot)



## Copilot Managed Runtime is now generally available, with new capabilities
Copilot Managed Runtime provides Microsoft-managed hosting and execution for applications, separate from where those applications are created. Builders can start with experiences, including Copilot Code, Copilot Cowork and Microsoft Copilot Studio, or use compatible third-party development tools. When an app is published to Copilot Managed Runtime, organizations gain a common way to host, run and govern it.

With the general availability of Copilot Managed Runtime, Microsoft is expanding this product, giving apps built across Microsoft Copilot and compatible third-party development tools an optional data backend with services from Microsoft Fabric.

With the new integration, applications that optionally need persistent data or additional backend capabilities can use Fabric as their underlying data foundation out of the box. Fabric can provide backend capabilities including database, storage and data APIs, while Copilot Managed Runtime continues to provide the application hosting and enterprise management layer.

The integration brings together flexible app creation, Microsoft-managed hosting and governance and an optional Fabric data backend, allowing organizations to choose the development experience that fits their needs while providing a consistent path for running applications in their Microsoft environment.

Microsoft is also announcing Agents and Workflows in Copilot Managed Runtime. The first iteration will allow users to build custom Copilot Studio agents and workflows locally, make modifications with their dev tool of choice and then publish to Copilot Studio using the CLI. This also gives developers a collaborative approach to agent development on Copilot Studio, alongside version control through platforms like GitHub.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/copilot-managed-runtime-blog/copilot-managed-runtime-is-now-generally-available-with-additional-new-preview-f/4571846)


## Copilot Workspaces helps teams work together with Copilot
Copilot Workspaces brings teams, their work and Copilot together in a shared space in the Microsoft Copilot app. As the evolution of Copilot Notebooks, Workspaces helps teams turn shared context into shared progress on an ongoing workstream.

Work IQ can suggest relevant workspaces based on current workstreams to help people get started quickly. Once in a workspace, team members can work together on shared documents while Copilot connects the dots across the work, surfacing what changed, what remains unresolved and which actions need attention so everyone can quickly catch up and keep the work moving. And coming soon, teams will be able to bring their personal Autopilot into Workspaces, so humans and agents can collaborate in one space and team members can shift from doing the work to directing it.

Copilot Workspaces is available in the Copilot app through the Frontier program.

- [Learn more about this news.](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)


## Easily build secure apps with Copilot Code
Copilot Code will empower everyone to build dashboards, trackers and apps with natural language, using the same agentic technology as GitHub Copilot. Cloud projects will run in a secure sandbox, stay within your tenant and are easy to share internally and take on the go with iOS and Android. A new local sandbox will extend those protections to people’s devices, limiting what Code and everything it runs can read, write and access on the network.

IT will be able to stay in control. Supported apps will be able to be published through Copilot Managed Runtime, extending existing Microsoft 365 identity, security and governance controls, with apps visible and managed in the Microsoft 365 admin center.

Copilot Code is available in the Frontier program on Windows, web, iOS and Android, with local sandbox available on Windows and coming soon to macOS. Copilot Code will be generally available in December.

- [Learn more about this news.](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)

## TODAY helps people prioritize and act on what matters
TODAY is a new experience in the Microsoft Copilot app and Outlook that will help people stay on top of their work by surfacing key priorities and proactively preparing next steps.

TODAY will bring together information from across emails, calendars, chats and meetings to create a personalized view of what needs attention. It will also proactively prepare work, including email drafts, chat messages and scheduling changes, for users to review and approve. 

The experience includes two capabilities: 
- TODAY Brief will provide a personalized morning briefing that highlights priorities and prepares next steps, helping users start their day caught up and ready to act. This daily refresh is included with a Microsoft 365 Copilot license. 
- TODAY Feed will build on the morning briefing by automatically refreshing throughout the day as new emails, messages and meetings come in, helping users stay on top of shifting priorities as the day unfolds. Recurring updates throughout the day require Copilot credits.

TODAY will begin rolling out in private preview through the Frontier program. 

- [Learn more about this news.](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)


# Microsoft IQ
Microsoft believes that AI should amplify customers’ business advantage. Today, Microsoft IQ is expanding to be a complete enterprise context management platform.

Microsoft IQ brings together the data, knowledge, expertise and proven ways of working that make every organization distinctive and is putting that intelligence to work across apps and agents. New features provide a governed home to reuse skills, tools and agents across teams with business plugins. Enhanced context management capabilities connect agents to work, business data, unstructured content and real-world knowledge through Work IQ, Fabric IQ, Foundry IQ and Web IQ, with continuous improvement provided by Microsoft Foundry.

Together, these updates help organizations retain, apply and grow their own IQ, so what they build today becomes the foundation for what they build next.

## Introducing Microsoft IQ, the platform for enterprise AI
Microsoft IQ, now generally available, puts customers’ intelligence to work in the apps and agents that they build, so teams can reuse what works and preserve what they learn as models, tools and business needs change. Each improvement adds to the customer’s IQ, giving future work a stronger starting point. Microsoft IQ brings together two capabilities:
- Enterprise context management connects agents to how people work, business data, unstructured content and real-world information through Work IQ, Fabric IQ, Foundry IQ and Web IQ, along with reusable business plugins, skills, tools and agents. Business plugins organize that context and expertise for each scenario.
- Continuous improvement in Microsoft Foundry connects evaluations and production insights to agent optimization and model training, enabling significantly improved customer outcomes.

The new Microsoft IQ is built on products customers already use, with no new SKU or subscription. Together with Microsoft Agent 365 for governance, it helps customers retain, apply and grow their IQ as they extend applications, adopt new models and improve agents.

- [Learn more about this news.](https://azure.microsoft.com/en-us/blog/introducing-the-new-microsoft-iq-putting-your-organizations-intelligence-to-work-in-every-agent/)


## Foundry IQ brings unstructured data to applications and agents
Foundry IQ helps developers put unstructured data to work in both traditional application search and agentic workloads. It combines keyword, vector and hybrid search with semantic ranking for search-driven applications and agentic retrieval that plans and iterates across knowledge sources for more complex questions. New capabilities deepen how applications and agents find and connect information:
- Knowledge graphs (in preview) will connect entities and relationships across documents and organize content into topics. Agents will be able to trace connections from a regulation through suppliers to affected products, citing supporting sources. Topic-based retrieval will help answer broader questions across a collection, such as themes running through a set of contracts.
- Microsoft-Retriever-1 (in preview), a new retrieval model, will run iterative search and query planning for faster, more efficient grounding.
- A Foundry IQ resource in every new Foundry project (in preview) will provide grounding from day 1 on a usage-based, serverless plan.
- The SharePoint indexed knowledge source is now generally available, bringing SharePoint content into Foundry IQ retrieval so applications and agents can find relevant information while respecting source permissions.

These updates help developers build search experiences and agents that can retrieve relevant content, follow relationships across documents and ground responses in organizational data.

- [Learn more about this news.](https://azure.microsoft.com/en-us/blog/introducing-the-new-microsoft-iq-putting-your-organizations-intelligence-to-work-in-every-agent/)


## Web IQ now generally available to Azure customers
Web IQ is now generally available to all Azure customers, making it easier for developers to bring fresh, relevant knowledge from across the web into AI agents and applications at a new, lower price. Web IQ connects real-world knowledge — from web pages, news, images, videos and more — with specialized data to expand what agents know beyond their underlying models and business data, so they can deliver better answers and actions. Other updates include:
- Auto mode in Web IQ makes it simpler to bring the right real-world knowledge into agents.Instead of requiring developers to select and orchestrate individual APIs, Auto mode brings Web, Images, Videos, News and the new Places and Weather categories together in a single, fast and cost-effective experience. This reduces the work required to build web grounding into an application while helping agents retrieve relevant external context for their responses. Now generally available.
- Web IQ Auto Advanced improves retrieval for more complex questions.When an initial result is not sufficient, Auto Advanced can evaluate the response, refine the query and retrieve additional information. This gives developers a way to improve results for demanding scenarios without building that iterative retrieval logic themselves. Now generally available.
- Web IQ Scopes gives organizations greater control over the web content their AI agents can access. This lets developers and enterprise administrators include or exclude specific URLs, domains, sites and paths when grounding AI responses. Now generally available.
- Specialized knowledge domains feature three new data categories. Web IQ Places provides intelligence on 207.5 million real-world entities tohelp customers build location-aware experiences faster, improve local discovery and recommendations, and reduce the effort to maintain place data. Web IQ Weather brings Microsoft’s weather intelligence directly into AI agents to help customers build weather-aware experiences faster, improve planning and recommendations, and respond to changing conditions. Web IQ Places and Web IQ Weather are generally available. Web IQ Commerce will give AI shopping agents structured product data across more than 40 billion listings. Product IDs, images, descriptions, pricing, availability and multi-merchant offers will help agents compare products and deliver faster, higher-quality recommendations at scale. Web IQ Commerce is in private preview.
- Healthcare enhancements to Web IQ help organizations build better health agents and other AI experiences with credible, cited health evidence. A new health-aware ranking uses source credibility signals, informed by principles established independently by the National Academy of Medicine in the US, to surface credible health sources ahead of forums and blogs. It runs on the Web IQ API with no new integration or separate SKU needed. Generally available.

- [Learn more about this news.](https://blogs.bing.com/webiq/2026/11/web-iq-is-now-broadly-available-build-better-agents-that-keep-up-with-the-world/)


# Security
As AI agents move from answering questions to taking action, security becomes the foundation for trust. Microsoft Perception is now generally available, bringing specialized security agents and playbooks together to investigate threats and strengthen defenses. New agent governance and security capabilities across Agent 365, Microsoft Entra, Intune, Defender and Purview give organizations greater visibility and control over agents, their identities, tools, access and data.

Together, these updates and the ones below help organizations establish trust at every layer of the agentic enterprise, giving people and agents the freedom to act with the security, control and accountability organizations need.

## Codename MDASH, a new agentic code security system, available in preview
Codename MDASH, Microsoft’s agentic code security system, is in preview for eligible organizations. It adds new capabilities that will help security and engineering teams work from validated findings. Advances in AI models are changing how vulnerabilities are discovered and exploited.

Codename MDASH uses more than 100 specialized AI agents in a four-stage pipeline. It will map the attack surface, scan code, validate findings through agent debate, remove duplicates and, where possible, reproduce findings with a triggering input.

New capabilities for Codename MDASH include:
- Quality improvements: Reduces low-quality results and false positives, so teams can spend less time triaging and more time on actionable vulnerabilities.
- Repository sharding: Analyzes large repositories by partitioning codebases into logical units, using fewer tokens per scan.
- Progress visibility: Makes scan stages, completed work, elapsed time and result availability more visible to better understand scan progress.
- Broader MAI Cyber model support: Codename MDASH now supports more of the MAI Cyber model family, including MAI Cyber 1.1 Flash, and will use MAI-Cyber-2 once evaluation testing is complete, improving efficiency while maintaining the quality of security findings.

- [Learn more about this news.](https://techcommunity.microsoft.com/blog/perception-blog/whats-new-with-microsoft-perception-at-ignite-2026/4571834)

