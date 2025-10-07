# System Issue Management Documentation

## Overview

The System Issue Management system provides a production-safe way to handle and display system issues to users. It ensures that sensitive technical information is only shown in development environments, while user-friendly messages are displayed in production.

## Key Features

### 🔒 **Production Safety**
- **Environment-Aware**: Different behavior in development vs production
- **User-Facing Control**: Only appropriate messages shown to end users
- **Security**: No sensitive technical details exposed in production

### 🎯 **Smart Filtering**
- **Development Mode**: Shows all issues (including technical details)
- **Production Mode**: Only shows user-facing issues
- **Severity-Based**: Color coding based on issue severity

### 📊 **Issue Management**
- **Centralized Control**: All issues managed through `IssueManager`
- **Dynamic Updates**: Issues can be added/removed at runtime
- **Type Classification**: Different issue types (maintenance, service, payment, etc.)

## Usage

### Basic Usage

```typescript
import { IssueManager } from '@/lib/issue-manager';

// Load sample issues (for development/testing)
IssueManager.loadSampleIssues();

// Get filtered issues for current environment
const issues = IssueManager.getFilteredIssues();

// Check if there are user-facing issues
const hasIssues = IssueManager.hasUserFacingIssues();
```

### Creating Issues

#### User-Facing Issues (Production Safe)
```typescript
// These will be shown to users in production
IssueManager.createUserFacingIssue(
  'payment',           // type
  'critical',          // severity
  'سیستم پرداخت موقتاً غیرفعال است',  // title
  'Payment system temporarily unavailable',  // message
  ['payment-gateway']  // affected services
);
```

#### Internal Issues (Development Only)
```typescript
// These will only be shown in development
IssueManager.createInternalIssue(
  'service',           // type
  'high',             // severity
  'اتصال به پایگاه داده کند است',  // title
  'Database connection response time is above 2 seconds',  // message
  ['database', 'api']  // affected services
);
```

### Issue Types

| Type | Description | Example |
|------|-------------|---------|
| `maintenance` | Scheduled maintenance | "تعمیرات برنامه‌ریزی شده" |
| `service` | Service issues | "API endpoint down" |
| `payment` | Payment system issues | "Payment gateway unavailable" |
| `inventory` | Inventory issues | "Product out of stock" |
| `security` | Security-related issues | "Security breach detected" |

### Severity Levels

| Severity | Color | Description |
|----------|-------|-------------|
| `low` | Blue | Minor issues, informational |
| `medium` | Yellow | Moderate issues, warnings |
| `high` | Orange | Serious issues, attention needed |
| `critical` | Red | Critical issues, immediate action required |

## Environment Behavior

### Development Mode (`NODE_ENV=development`)
- ✅ Shows all issues (including technical details)
- ✅ Shows internal system information
- ✅ Displays "مشکلات سیستم:" (System Issues)
- ✅ Full debugging information available

### Production Mode (`NODE_ENV=production`)
- ✅ Only shows user-facing issues
- ✅ Hides technical details
- ✅ Displays "اطلاعیه مهم:" (Important Notice)
- ✅ User-friendly messages only

## Example Issues

### Development-Only Issues
```typescript
{
  type: 'service',
  severity: 'medium',
  title: 'اتصال به پایگاه داده کند است',
  message: 'Database connection response time is above 2 seconds',
  userFacing: false,        // Don't show to users
  showInProduction: false,   // Don't show in production
  showInDevelopment: true,   // Show in development
  affectedServices: ['database', 'api']
}
```

### Production-Safe Issues
```typescript
{
  type: 'payment',
  severity: 'critical',
  title: 'سیستم پرداخت موقتاً غیرفعال است',
  message: 'Payment gateway is experiencing issues. Please try again later.',
  userFacing: true,         // Show to users
  showInProduction: true,   // Show in production
  showInDevelopment: true,  // Show in development
  affectedServices: ['payment-gateway']
}
```

## Integration with Header

The header component automatically:
- ✅ Loads issues on component mount
- ✅ Filters issues based on environment
- ✅ Displays appropriate banner with color coding
- ✅ Shows correct title (System Issues vs Important Notice)
- ✅ Allows users to dismiss the banner

## Best Practices

### ✅ Do's
- Use user-friendly language for production issues
- Include helpful information for users
- Use appropriate severity levels
- Test in both development and production environments

### ❌ Don'ts
- Don't expose technical details in production
- Don't show sensitive system information to users
- Don't use overly technical language
- Don't forget to test environment-specific behavior

## Security Considerations

### Information Disclosure Prevention
- **No Technical Details**: Database errors, API failures, etc. are hidden in production
- **No System Architecture**: Internal system information is not exposed
- **No Debug Information**: Stack traces, error codes, etc. are development-only
- **User-Centric Messages**: Only information relevant to users is shown

### Example Security Scenarios

#### ❌ Bad (Security Risk)
```typescript
// This would expose sensitive information in production
{
  title: 'Database connection failed: mongodb://user:pass@host:port',
  message: 'Error: ECONNREFUSED 127.0.0.1:27017',
  userFacing: true,  // DANGER: Exposes connection details
  showInProduction: true
}
```

#### ✅ Good (Production Safe)
```typescript
// This is safe for production
{
  title: 'سیستم موقتاً در دسترس نیست',
  message: 'We are experiencing technical difficulties. Please try again later.',
  userFacing: true,
  showInProduction: true
}
```

## Testing

### Development Testing
```bash
# Set development environment
NODE_ENV=development npm run dev

# Should show all issues including technical details
# Banner title: "مشکلات سیستم:"
```

### Production Testing
```bash
# Set production environment
NODE_ENV=production npm run build
NODE_ENV=production npm start

# Should only show user-facing issues
# Banner title: "اطلاعیه مهم:"
```

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live issue updates
- **Issue History**: Track issue resolution and history
- **User Preferences**: Allow users to customize notification preferences
- **Multi-language Support**: Support for multiple languages
- **Analytics**: Track issue impact and user behavior
- **Integration**: Connect with monitoring systems (Sentry, DataDog, etc.)

This system ensures that your application maintains a professional appearance while providing appropriate information to users based on their environment and needs.
