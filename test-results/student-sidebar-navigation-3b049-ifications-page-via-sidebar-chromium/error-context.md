# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student-sidebar-navigation.spec.ts >> Student Portal Sidebar Navigation >> should navigate to Notifications page via sidebar
- Location: e2e/student-sidebar-navigation.spec.ts:4:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/student/notifications"
Received string:    "http://localhost:3000/student"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - link "🎓 CampBus – A Smart App student Portal" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: 🎓
        - generic [ref=e8]:
          - generic [ref=e9]: CampBus – A Smart App
          - generic [ref=e10]: student Portal
      - navigation [ref=e11]:
        - link "🏠 Dashboard" [ref=e12] [cursor=pointer]:
          - /url: /student
          - generic [ref=e13]: 🏠
          - text: Dashboard
        - link "🗺️ Live Tracking" [ref=e14] [cursor=pointer]:
          - /url: /student/tracking
          - generic [ref=e15]: 🗺️
          - text: Live Tracking
        - link "⏱️ ETA & Alarm" [ref=e16] [cursor=pointer]:
          - /url: /student/eta
          - generic [ref=e17]: ⏱️
          - text: ETA & Alarm
        - link "🔔 Notifications" [ref=e18] [cursor=pointer]:
          - /url: /student/notifications
          - generic [ref=e19]: 🔔
          - text: Notifications
        - link "📦 Lost & Found" [ref=e21] [cursor=pointer]:
          - /url: /student/lost-found
          - generic [ref=e22]: 📦
          - text: Lost & Found
        - link "🛡️ Safety" [ref=e23] [cursor=pointer]:
          - /url: /student/safety
          - generic [ref=e24]: 🛡️
          - text: Safety
      - generic [ref=e26]:
        - generic [ref=e27]: P
        - generic [ref=e28]:
          - generic [ref=e29]: Priya Sharma
          - generic [ref=e30]: student
        - link "⏏" [ref=e31] [cursor=pointer]:
          - /url: /login
    - generic [ref=e32]:
      - banner [ref=e33]:
        - generic [ref=e34]: Live · 6:58:26 AM
        - generic [ref=e37]:
          - button "🔔" [ref=e39] [cursor=pointer]
          - generic [ref=e40]: P
      - main [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - heading "Notifications 🔔" [level=1] [ref=e45]
              - paragraph [ref=e46]: 0 unread notifications
            - button "Mark all read" [ref=e47] [cursor=pointer]
          - generic [ref=e48]:
            - button "all" [ref=e49] [cursor=pointer]
            - button "unread" [ref=e50] [cursor=pointer]
            - button "BUS APPROACHING" [ref=e51] [cursor=pointer]
            - button "BUS ARRIVING" [ref=e52] [cursor=pointer]
            - button "BUS ARRIVED" [ref=e53] [cursor=pointer]
            - button "BUS DEPARTED" [ref=e54] [cursor=pointer]
            - button "BUS DELAYED" [ref=e55] [cursor=pointer]
            - button "ETA CHANGED" [ref=e56] [cursor=pointer]
            - button "TRAFFIC DELAY" [ref=e57] [cursor=pointer]
            - button "TRIP STARTED" [ref=e58] [cursor=pointer]
            - button "TRIP COMPLETED" [ref=e59] [cursor=pointer]
            - button "ROUTE CHANGED" [ref=e60] [cursor=pointer]
            - button "STUDENT PICKED_UP" [ref=e61] [cursor=pointer]
            - button "STUDENT DROPPED_OFF" [ref=e62] [cursor=pointer]
            - button "SYSTEM" [ref=e63] [cursor=pointer]
          - generic [ref=e64]:
            - generic [ref=e65]:
              - generic [ref=e66]: ▶️
              - generic [ref=e67]:
                - generic [ref=e68]: Trip Started
                - paragraph [ref=e70]: Route A — Gandhipuram Loop has started
                - generic [ref=e71]:
                  - generic [ref=e72]: 18m ago
                  - generic [ref=e73]: TN 38 AB 1234
              - button "×" [ref=e74] [cursor=pointer]
            - generic [ref=e75]:
              - generic [ref=e76]: ✅
              - generic [ref=e77]:
                - generic [ref=e78]: Bus Arrived
                - paragraph [ref=e80]: BUS-01 has arrived at Gandhipuram Bus Stand
                - generic [ref=e81]:
                  - generic [ref=e82]: 4h ago
                  - generic [ref=e83]: TN 38 AB 1234
              - button "×" [ref=e84] [cursor=pointer]
          - generic [ref=e85]:
            - heading "⚙️ Notification Preferences" [level=3] [ref=e86]
            - generic [ref=e87]:
              - generic [ref=e88]:
                - generic [ref=e89]: Bus arriving (5 min)
                - generic [ref=e90] [cursor=pointer]
              - generic [ref=e92]:
                - generic [ref=e93]: ETA updates
                - generic [ref=e94] [cursor=pointer]
              - generic [ref=e96]:
                - generic [ref=e97]: Delay alerts
                - generic [ref=e98] [cursor=pointer]
              - generic [ref=e100]:
                - generic [ref=e101]: Trip updates
                - generic [ref=e102] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Student Portal Sidebar Navigation', () => {
  4  |   test('should navigate to Notifications page via sidebar', async ({ page }) => {
  5  |     // Start at student dashboard
  6  |     await page.goto('/student');
  7  |     await page.waitForLoadState('networkidle');
  8  | 
  9  |     // Click the Notifications link in the sidebar
  10 |     const notificationsLink = page.locator('a[href="/student/notifications"]');
  11 |     await expect(notificationsLink).toBeVisible();
  12 |     await notificationsLink.click();
  13 | 
  14 |     // Wait for navigation
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     // Verify we're on the correct route
> 18 |     expect(page.url()).toContain('/student/notifications');
     |                        ^ Error: expect(received).toContain(expected) // indexOf
  19 | 
  20 |     // Verify the Notifications page renders
  21 |     await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  22 |   });
  23 | 
  24 |   test('should navigate to Notifications page and return HTTP 200', async ({ page }) => {
  25 |     // Navigate directly to the notifications page
  26 |     const response = await page.goto('/student/notifications');
  27 |     await page.waitForLoadState('networkidle');
  28 | 
  29 |     // Verify HTTP 200 response
  30 |     expect(response?.status()).toBe(200);
  31 | 
  32 |     // Verify the page renders correctly
  33 |     await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  34 |   });
  35 | });
  36 | 
```