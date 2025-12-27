# Phase 5: Deployment Guide - Lovable Platform & councilof.ai Domain

## Overview
This guide covers deploying the COAI Dashboard to the Lovable platform with the councilof.ai domain.

## Prerequisites
- [ ] GitHub repository with latest code pushed
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Resend API key configured
- [ ] Stripe keys configured (if applicable)

## Step 1: Pre-Deployment Checklist

### Code Quality
```bash
# Run all tests
pnpm test

# Check TypeScript compilation
pnpm build

# Verify no console errors
pnpm lint
```

### Environment Variables
Ensure these are configured in Lovable Settings → Secrets:
- `RESEND_API_KEY` - For email notifications
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - For authentication
- `STRIPE_SECRET_KEY` - For payment processing (if applicable)
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- `BUILT_IN_FORGE_API_KEY` - For LLM integration
- `BUILT_IN_FORGE_API_URL` - LLM API endpoint

### Database Migrations
```bash
# Apply all pending migrations
pnpm db:push

# Verify schema
pnpm db:studio
```

## Step 2: Build Verification

### Local Build
```bash
# Clean build
rm -rf dist
pnpm build

# Verify build artifacts
ls -lah dist/
```

### Build Output Checklist
- [ ] No TypeScript errors
- [ ] No missing imports
- [ ] CSS properly bundled
- [ ] Assets optimized
- [ ] Build size reasonable (<5MB gzipped)

## Step 3: Lovable Platform Deployment

### Option A: Git-based Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Phase 5: Testing & Deployment - Ready for production"
   git push origin main
   ```

2. **Trigger Lovable Build**
   - Go to Lovable Management UI
   - Click "Deploy" button
   - Select "Deploy from Git"
   - Confirm main branch
   - Wait for build to complete

3. **Monitor Build Progress**
   - Check build logs in Lovable Dashboard
   - Verify no errors during build
   - Wait for deployment to complete

### Option B: Manual Deployment

1. **Export Project**
   - Download all project files
   - Create deployment package

2. **Upload to Lovable**
   - Use Lovable upload interface
   - Select all files
   - Trigger build

## Step 4: Domain Configuration

### Configure councilof.ai Domain

1. **In Lovable Management UI**
   - Go to Settings → Domains
   - Click "Add Custom Domain"
   - Enter: `councilof.ai`

2. **DNS Configuration**
   - Get DNS records from Lovable
   - Update domain registrar:
     - Add CNAME record pointing to Lovable
     - Or add A record with provided IP
   - Wait for DNS propagation (up to 24 hours)

3. **SSL Certificate**
   - Lovable automatically provisions SSL
   - Verify HTTPS works
   - Check certificate validity

### Verify Domain
```bash
# Test domain resolution
nslookup councilof.ai

# Test HTTPS
curl -I https://councilof.ai
```

## Step 5: Production Verification

### Smoke Tests
- [ ] Homepage loads (https://councilof.ai)
- [ ] Login page accessible
- [ ] Dashboard displays correctly
- [ ] API endpoints respond
- [ ] Database queries work
- [ ] Charts render properly
- [ ] Reports generate successfully

### Feature Testing
- [ ] Watchdog report submission works
- [ ] Legal flagging triggers automatically
- [ ] Case assignment creates notifications
- [ ] Email notifications send via Resend
- [ ] PDF reports generate
- [ ] CSV exports work
- [ ] Analytics dashboard updates

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Chart rendering < 1 second
- [ ] Report generation < 5 seconds

### Security Verification
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No console errors
- [ ] No XSS vulnerabilities
- [ ] No SQL injection vulnerabilities
- [ ] CSRF protection enabled

## Step 6: Monitoring & Logging

### Set Up Monitoring
1. **Error Tracking**
   - Configure Sentry (if available)
   - Set up error alerts

2. **Performance Monitoring**
   - Enable APM (Application Performance Monitoring)
   - Set up performance alerts

3. **Logging**
   - Configure centralized logging
   - Set up log aggregation

### Monitor Key Metrics
- [ ] Error rate < 0.1%
- [ ] Uptime > 99.9%
- [ ] Response time < 500ms
- [ ] Database query time < 100ms

## Step 7: Backup & Disaster Recovery

### Database Backups
```bash
# Verify automated backups are enabled
# Check backup frequency and retention
```

### Disaster Recovery Plan
- [ ] Backup strategy documented
- [ ] Recovery procedures tested
- [ ] Failover plan in place
- [ ] Data retention policy defined

## Step 8: Post-Deployment Tasks

### Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document rollback procedure

### Team Communication
- [ ] Notify team of production deployment
- [ ] Share production URL
- [ ] Provide access credentials
- [ ] Schedule training if needed

### Monitoring Setup
- [ ] Configure uptime monitoring
- [ ] Set up alert notifications
- [ ] Create monitoring dashboard
- [ ] Document alert procedures

## Rollback Procedure

If issues occur after deployment:

1. **Identify Issue**
   - Check error logs
   - Review recent changes
   - Assess impact

2. **Rollback Steps**
   ```bash
   # Option 1: Revert to previous commit
   git revert <commit-hash>
   git push origin main
   
   # Option 2: Redeploy from previous checkpoint
   # In Lovable: Select previous deployment version
   ```

3. **Verify Rollback**
   - [ ] Services restored
   - [ ] Data integrity verified
   - [ ] Users notified

## Troubleshooting

### Build Failures
- Check build logs for specific errors
- Verify all dependencies installed
- Ensure environment variables correct
- Check for TypeScript compilation errors

### Deployment Issues
- Verify GitHub repository accessible
- Check branch name is correct
- Ensure all files committed
- Review Lovable build logs

### Runtime Issues
- Check application logs
- Verify database connection
- Confirm environment variables
- Test API endpoints

### Domain Issues
- Verify DNS records propagated
- Check SSL certificate validity
- Test domain resolution
- Review Lovable domain settings

## Performance Optimization

### Frontend Optimization
- Minify CSS and JavaScript
- Optimize images
- Enable gzip compression
- Use CDN for static assets

### Backend Optimization
- Enable database query caching
- Implement API rate limiting
- Use connection pooling
- Optimize database indexes

### Monitoring & Alerts
- Set up performance alerts
- Monitor error rates
- Track user engagement
- Review analytics

## Security Hardening

### Pre-Production
- [ ] Run security audit
- [ ] Perform penetration testing
- [ ] Review OWASP Top 10
- [ ] Verify authentication/authorization

### Post-Deployment
- [ ] Monitor for security incidents
- [ ] Review access logs
- [ ] Update security policies
- [ ] Conduct security training

## Success Criteria

✅ All tests passing
✅ Build succeeds without errors
✅ Deployment completes successfully
✅ Domain resolves correctly
✅ HTTPS working
✅ All features functional
✅ Performance benchmarks met
✅ Monitoring configured
✅ Team notified
✅ Documentation complete

## Next Steps

After successful deployment:
1. Proceed to Phase 6: Integration Testing
2. Monitor production metrics
3. Gather user feedback
4. Plan Phase 7: Portfolio Expansion
5. Begin Phase 8: GPU Infrastructure Integration

## Support

For deployment issues:
- Check Lovable documentation
- Review build logs
- Contact Lovable support
- Check GitHub Actions logs

## Appendix: Useful Commands

```bash
# Check deployment status
curl -I https://councilof.ai

# View application logs
pnpm logs

# Database health check
pnpm db:studio

# Run production tests
pnpm test:prod

# Performance testing
pnpm test:performance

# Security scanning
pnpm audit
```

---

**Last Updated:** December 27, 2024
**Version:** 1.0
**Status:** Ready for Production
