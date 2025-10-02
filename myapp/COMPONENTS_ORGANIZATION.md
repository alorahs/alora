# Components Organization

This document describes the new organization structure for the components in the Alora application.

## New Folder Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── RatingStats.tsx
│   │   └── index.ts
│   ├── auth/
│   │   └── index.ts
│   ├── booking/
│   │   ├── booking_form.tsx
│   │   └── index.ts
│   ├── contact/
│   │   └── index.ts
│   ├── feedback/
│   │   ├── feedback.tsx
│   │   ├── review_form.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── scroll_to_top.tsx
│   │   ├── notification_dropdown.tsx
│   │   └── index.ts
│   ├── profile/
│   │   ├── professional-profile-modal.tsx
│   │   └── index.ts
│   ├── services/
│   │   └── index.ts
│   ├── shared/
│   │   ├── advanced-search-filters.tsx
│   │   ├── loader.tsx
│   │   ├── not_found.tsx
│   │   └── index.ts
│   └── ui/
│       └── [All UI components]
├── pages/
│   ├── layout/
│   │   └── page.tsx
│   └── [Other page directories]
└── professionals-dashboard/
    └── page.tsx
```

## Component Grouping

### Layout Components

- Header (`components/layout/header.tsx`)
- Footer (`components/layout/footer.tsx`)
- ScrollToTop (`components/layout/scroll_to_top.tsx`)
- NotificationDropdown (`components/layout/notification_dropdown.tsx`)

### Booking Components

- BookingForm (`components/booking/booking_form.tsx`)

### Profile Components

- ProfessionalProfileModal (`components/profile/professional-profile-modal.tsx`)

### Feedback Components

- Feedback (`components/feedback/feedback.tsx`)
- ReviewForm (`components/feedback/review_form.tsx`)

### Shared Components

- NotFound (`components/shared/not_found.tsx`)
- Loader (`components/shared/loader.tsx`)
- AdvancedSearchFilters (`components/shared/advanced-search-filters.tsx`)

## Index Files

Each component directory now includes an `index.ts` file that exports the components in that directory for cleaner imports.

## Benefits

1. **Better Organization**: Components are grouped by functionality, making it easier to locate and manage them.
2. **Cleaner Imports**: Index files allow for more concise import statements.
3. **Scalability**: The structure can easily accommodate new components as the application grows.
4. **Maintainability**: Related components are grouped together, making it easier to make changes that affect multiple related components.
