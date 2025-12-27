import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Login endpoint - redirects to OAuth portal
  app.get("/api/auth/login", (req: Request, res: Response) => {
    const oauthPortalUrl = process.env.OAUTH_SERVER_URL;
    const appId = process.env.VITE_APP_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
    
    const params = new URLSearchParams({
      app_id: appId || '',
      redirect_uri: redirectUri,
    });
    
    res.redirect(302, `${oauthPortalUrl}/login?${params.toString()}`);
  });

  // Signup endpoint - redirects to OAuth portal signup
  app.get("/api/auth/signup", (req: Request, res: Response) => {
    const oauthPortalUrl = process.env.OAUTH_SERVER_URL;
    const appId = process.env.VITE_APP_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
    const ref = getQueryParam(req, 'ref');
    
    const state = ref ? JSON.stringify({ ref }) : undefined;
    const params = new URLSearchParams({
      app_id: appId || '',
      redirect_uri: redirectUri,
      ...(state && { state }),
    });
    
    res.redirect(302, `${oauthPortalUrl}/signup?${params.toString()}`);
  });

  // OAuth callback endpoint
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
