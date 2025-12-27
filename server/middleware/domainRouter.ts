/**
 * Domain Router Middleware
 * Routes requests to appropriate handlers based on domain/subdomain
 */

import { Request, Response, NextFunction } from "express";

export interface DomainConfig {
  domain: string;
  subdomain?: string;
  section: string;
  description: string;
}

const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    domain: "csoai.org",
    section: "main",
    description: "Main CSOAI platform",
  },
  {
    domain: "ceasai.org",
    section: "main",
    description: "Redirect to csoai.org",
  },
  {
    domain: "csoai.org",
    subdomain: "training",
    section: "training",
    description: "Training & Certification Center",
  },
  {
    domain: "training.csoai.org",
    section: "training",
    description: "Training & Certification Center",
  },
  {
    domain: "csoai.org",
    subdomain: "council",
    section: "council",
    description: "33-Agent Council Portal",
  },
  {
    domain: "council.csoai.org",
    section: "council",
    description: "33-Agent Council Portal",
  },
  {
    domain: "csoai.org",
    subdomain: "api",
    section: "api",
    description: "API Documentation & Gateway",
  },
  {
    domain: "api.csoai.org",
    section: "api",
    description: "API Documentation & Gateway",
  },
  {
    domain: "csoai.org",
    subdomain: "admin",
    section: "admin",
    description: "Admin Dashboard",
  },
  {
    domain: "admin.csoai.org",
    section: "admin",
    description: "Admin Dashboard",
  },
  {
    domain: "safetyof.ai",
    section: "main",
    description: "Alternative domain - redirects to csoai.org",
  },
  {
    domain: "councilof.ai",
    section: "council",
    description: "Alternative council domain",
  },
  {
    domain: "ceasai.training",
    section: "training",
    description: "Training-focused domain",
  },
];

export function extractDomain(host: string): { domain: string; subdomain?: string } {
  // Remove port if present
  const hostWithoutPort = host.split(":")[0];

  // Check for subdomain
  const parts = hostWithoutPort.split(".");

  if (parts.length > 2) {
    // Has subdomain (e.g., training.csoai.org)
    const subdomain = parts[0];
    const domain = parts.slice(1).join(".");
    return { domain, subdomain };
  }

  return { domain: hostWithoutPort };
}

export function getDomainConfig(
  domain: string,
  subdomain?: string
): DomainConfig | null {
  return (
    DOMAIN_CONFIGS.find(
      (config) =>
        config.domain === domain &&
        (!subdomain || config.subdomain === subdomain || !config.subdomain)
    ) || null
  );
}

export function domainRouterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const host = req.get("host") || "";
  const { domain, subdomain } = extractDomain(host);
  const config = getDomainConfig(domain, subdomain);

  // Attach domain info to request
  (req as any).domainInfo = {
    domain,
    subdomain,
    config,
    section: config?.section || "main",
  };

  // Handle redirects for alternative domains
  if (domain === "ceasai.org" || domain === "safetyof.ai") {
    // Redirect to primary domain
    const protocol = req.protocol;
    const path = req.originalUrl;
    return res.redirect(301, `${protocol}://csoai.org${path}`);
  }

  next();
}

export function getSubdomainSection(req: Request): string {
  return (req as any).domainInfo?.section || "main";
}

export function getDomainInfo(req: Request) {
  return (req as any).domainInfo || {};
}

/**
 * Middleware to restrict access to specific sections
 */
export function restrictToSection(allowedSections: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const section = getSubdomainSection(req);

    if (!allowedSections.includes(section)) {
      return res.status(403).json({
        error: "Access denied",
        message: `This section is not available on ${section} domain`,
      });
    }

    next();
  };
}

/**
 * Get domain-specific configuration
 */
export function getDomainSpecificConfig(section: string) {
  const configs: Record<string, any> = {
    main: {
      title: "CSOAI - Open Public Regulatory Authority for AI Safety",
      description: "Global AI Safety Governance Platform",
      features: ["Dashboard", "AI Systems", "Compliance", "Watchdog", "Training"],
    },
    training: {
      title: "CSOAI Training & Certification Center",
      description: "Become a certified AI Safety Analyst",
      features: ["Courses", "Certifications", "Workbench", "Progress Tracking"],
    },
    council: {
      title: "CSOAI 33-Agent Council",
      description: "AI-powered governance and decision making",
      features: ["Voting", "Decisions", "Analytics", "Performance"],
    },
    api: {
      title: "CSOAI API Documentation",
      description: "Enterprise API for AI Safety Integration",
      features: ["REST API", "Webhooks", "SDK", "Rate Limiting"],
    },
    admin: {
      title: "CSOAI Admin Dashboard",
      description: "Administrative controls and monitoring",
      features: ["Users", "Systems", "Reports", "Audit Logs"],
    },
  };

  return configs[section] || configs.main;
}

export default domainRouterMiddleware;
