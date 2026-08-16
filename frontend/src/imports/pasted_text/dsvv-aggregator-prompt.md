# Figma Prototype Prompt

Design a modern, clean, responsive web application prototype called **“DSVV Unified Notice & Circular Aggregator”**.

The application is a centralized platform for collecting and displaying DSVV university notices, circulars, examination updates, timetable changes, academic announcements, and other important information in one searchable and filterable feed.

The system has **three user roles**:

1. **Student**
2. **Department Admin**
3. **Super Admin**

The system also includes an **Automatic Notice Collector** that detects new information from authorized DSVV official sources. Automatically detected information first goes through classification and verification before being published.

---

## 1. Overall Design

Create a professional university-style dashboard.

Design style:

* Clean and minimal
* Modern academic/university interface
* White/light background
* Professional blue primary accent
* Subtle gray borders
* Rounded cards
* Clear typography
* Responsive desktop-first layout
* Also show mobile-responsive behavior
* Avoid excessive gradients
* Use professional icons
* Use clear status badges

Application name:

**DSVV Updates**

Subtitle:

**Unified Notice & Circular Aggregator**

Top navigation should include:

* Dashboard
* Notices
* Circulars
* Timetable
* Examinations
* Academic Updates
* Notifications

Right side:

* Notification bell
* User profile
* Role indicator

---

# 2. STUDENT SIDE

Create the following student screens.

## Screen 1 — Student Dashboard

Header:

**DSVV Updates**

Search bar:

“Search notices, circulars, timetable…”

Category filters:

* All
* Notices
* Circulars
* Examination
* Timetable
* Academic
* Admission
* Events
* Holiday

Dashboard sections:

### Latest Updates

Show notice cards containing:

* Notice title
* Department
* Category
* Published date
* Short description
* PDF/document icon
* “View Details” button

Example notices:

**BCA 2nd Semester Examination Timetable Updated**

Department: BCA

Category: Examination

Priority: High

Date: 15 August 2026

---

**University Holiday Circular**

Department: Administration

Category: Circular

Date: 14 August 2026

---

**BCA Classroom Timetable Revised**

Department: BCA

Category: Timetable

Date: 13 August 2026

Add a sidebar/card called:

**Important Updates**

Show high-priority notices.

---

# 3. Student Search & Filter Screen

Create a dedicated search page.

Large search bar:

“Search notices…”

Advanced filters:

* Department
* Category
* Course
* Year
* Date
* Priority
* Notice Type

Example:

Department: BCA

Year: 2nd Year

Category: Examination

Show filtered results.

Include:

**Clear Filters**

and

**Apply Filters**

buttons.

---

# 4. Student Notice Details Screen

When a student clicks a notice, open a detailed notice page.

Show:

Title:

**BCA 2nd Semester Examination Timetable Updated**

Metadata:

Department: BCA

Category: Examination

Type: Timetable

Published: 15 August 2026

Priority: High

Source: DSVV Official Source

Show document/PDF preview area.

Buttons:

* View PDF
* Download
* Share
* Save/Favorite

Show:

**Related Notices**

at the bottom.

---

# 5. Student Notifications Screen

Create a notification center.

Example:

🔴 **Important**

BCA 2nd Semester Examination Timetable has been updated.

5 minutes ago

---

🔵 **New Circular**

University Holiday Circular published.

1 hour ago

---

🟢 **Timetable Update**

BCA classroom timetable changed.

Today

Include:

* Mark all as read
* Notification settings

---

# 6. STUDENT PROFILE & NOTIFICATION PREFERENCES

Create a settings page.

Profile:

Name

Course

Department

Year

Notification Preferences:

☑ Examination Updates

☑ Timetable Updates

☑ Department Notices

☑ Important Circulars

☐ Events

Also include:

**My Departments**

BCA

and

**Logout**

---

# 7. DEPARTMENT ADMIN

Create a separate Department Admin dashboard.

The Department Admin should only manage information belonging to their department.

Example role:

**BCA Department Admin**

Sidebar:

* Dashboard
* Add Notice
* My Notices
* Timetable
* Circulars
* Pending
* Notifications
* Profile

Dashboard cards:

Total Notices

Published

Pending Approval

Rejected

---

# 8. Department Admin — Add Notice

Create a professional form.

Fields:

Notice Title

Description

Department

Category

Notice Type

Target Course

Target Year

Priority

Publish Date

Attachment/PDF

Notification Required

Category dropdown:

* Notice
* Circular
* Examination
* Timetable
* Academic
* Admission
* Holiday
* Event
* Other

Buttons:

**Save Draft**

**Submit for Approval**

After submission show:

“Notice submitted successfully and is waiting for Super Admin approval.”

---

# 9. Department Admin — My Notices

Create a table.

Columns:

Title

Category

Date

Status

Notification

Actions

Statuses:

* Draft
* Pending
* Approved
* Published
* Rejected

Actions:

View

Edit

Delete

---

# 10. SUPER ADMIN DASHBOARD

Create a powerful central administration dashboard.

Header:

**Super Admin Panel**

Sidebar:

* Dashboard
* All Notices
* Pending Approvals
* Automatic Collector
* Departments
* Department Admins
* Categories
* Notifications
* System Settings

Dashboard statistics:

Total Notices

Pending Approval

Published

Auto Detected

Departments

Notifications Sent

---

# 11. Super Admin — Pending Approval

Create an approval screen.

Show:

### New Automatically Detected Notice

Title:

**Revised BCA 2nd Semester Examination Timetable**

Source:

DSVV Official Website

Detected:

15 August 2026

System Classification:

Department: BCA

Category: Examination

Type: Timetable

Priority: High

Show a confidence indicator:

**Classification Confidence: 94%**

Buttons:

**Approve & Publish**

**Edit Classification**

**Reject**

---

# 12. AUTOMATIC NOTICE COLLECTOR SCREEN

This is an important screen because it represents the unique part of the project.

Create a page:

**Automatic Notice Collector**

Show source status:

DSVV Official Website

Status: Connected

Last Checked:

10 minutes ago

Next Check:

In 5 minutes

Show:

### Newly Detected Information

1.

**BCA 2nd Semester Examination Timetable**

Status: New

Detected: 5 minutes ago

2.

**University Academic Circular**

Status: New

Detected: 15 minutes ago

For each item show:

Source

Detected date

Title

Extracted content

Suggested department

Suggested category

Confidence

Buttons:

**Review**

**Approve**

**Reject**

---

# 13. AUTOMATIC CLASSIFICATION SCREEN

Create a screen explaining how the system classifies a detected notice.

Example:

Input:

**“BCA 2nd Semester Examination Schedule Revised”**

System analyzes:

Keywords:

BCA

Semester

Examination

Schedule

Revised

System suggestion:

Department:

**BCA**

Category:

**Examination**

Type:

**Timetable**

Priority:

**High**

Confidence:

**94%**

Buttons:

**Confirm**

**Edit**

---

# 14. SUPER ADMIN — ALL NOTICES

Create a complete notice management table.

Columns:

Notice

Department

Category

Source

Date

Status

Notification

Actions

Filters:

Department

Category

Source

Status

Date

Example source badges:

**Automatic**

**Department Admin**

---

# 15. NOTIFICATION MANAGEMENT

Create a Super Admin notification screen.

Show:

Notification title

Target audience

Department

Category

Priority

Status

Example:

**BCA Timetable Updated**

Target:

BCA — 2nd Year

Status:

Sent

Recipients:

128

---

# 16. DEPARTMENT MANAGEMENT

Create a department management screen.

Departments:

BCA

B.Sc IT

MCA

Computer Science

Management

etc.

Each department should show:

Department Name

Department Admin

Total Notices

Status

Actions

---

# 17. DEPARTMENT ADMIN MANAGEMENT

Super Admin can:

* Create Department Admin
* Edit Department Admin
* Disable Admin
* Reset access

Example:

BCA Department Admin

Status: Active

Permissions:

Create Notice

Manage Timetable

Manage Circulars

View Department Analytics

---

# 18. IMPORTANT SYSTEM WORKFLOW SCREEN

Create a visual workflow/architecture page inside the prototype.

Show this flow clearly:

DSVV Official Sources

↓

Automatic Collector

↓

New Information Detected

↓

Content Extraction

↓

Automatic Classification

↓

Department + Category + Priority

↓

Super Admin Verification

↓

Approve / Edit / Reject

↓

Database

↓

Unified Student Feed

↓

Search + Filter

↓

Push Notification

Also show the second route:

Department Admin

↓

Add Notice

↓

Select Category

↓

Submit

↓

Super Admin Approval

↓

Database

↓

Student Feed

↓

Push Notification

---

# 19. ROLE-BASED ACCESS

Make the prototype clearly show that users have different permissions.

Student:

View

Search

Filter

Download

Save

Receive Notifications

Department Admin:

Create

Edit

Submit

Manage Own Department Notices

Super Admin:

Full System Access

Approve

Reject

Manage Departments

Manage Admins

Manage Categories

Manage Notifications

Manage Automatic Collector

---

# 20. DESIGN SYSTEM

Use a consistent design system.

Primary color:

Professional university blue.

Secondary:

Neutral gray.

Status colors:

Green = Published / Approved

Yellow = Pending

Red = Rejected / High Priority

Blue = Automatic / Information

Typography:

Modern sans-serif such as Inter.

Cards:

12–16px rounded corners.

Buttons:

Clear primary and secondary hierarchy.

Tables:

Clean rows with status badges.

Use Lucide-style outline icons.

Keep the UI realistic and suitable for an actual university project.

---

# 21. PROTOTYPE INTERACTIONS

Create clickable prototype connections:

Student Dashboard → Notice Details

Notice Details → PDF Preview

Dashboard → Search

Search → Filtered Results

Notification Bell → Notification Center

Department Admin Dashboard → Add Notice

Add Notice → Submit for Approval

Submit → Pending Status

Super Admin Dashboard → Pending Approvals

Pending Approval → Notice Review

Notice Review → Approve & Publish

Approve → Published Notice

Automatic Collector → Review

Review → Classification

Classification → Approve

Approve → Student Feed

Student Feed → Push Notification

---

# 22. Important Prototype Principle

Do NOT design this as only a normal notice-board website.

The prototype must visually communicate that this is an:

**AGGREGATION + CLASSIFICATION + VERIFICATION + SEARCH + NOTIFICATION SYSTEM**

The key unique workflow should be visible:

**Automatic Detection → Classification → Super Admin Verification → Unified Feed → Push Notification**

Use realistic DSVV-style academic notice examples, but keep the interface modern and professional.
