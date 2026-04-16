# Implementation Plan: VyapaarOS Frontend

## Overview

This implementation plan converts the VyapaarOS frontend design into discrete coding tasks that build incrementally toward a complete, responsive business management interface. The approach prioritizes core functionality first, then adds testing and polish features.

## Tasks

- [x] 1. Project Setup and Foundation
  - Initialize React TypeScript project with Vite
  - Configure Tailwind CSS with custom design system colors
  - Set up project structure with components, hooks, and utils directories
  - Install and configure required dependencies (React Router, date-fns, lucide-react)
  - Create CSS custom properties for the complete color palette from design system
  - _Requirements: 5.1, 5.5_

- [x] 2. Design System Components
  - [x] 2.1 Create base Button component with all variants
    - Implement primary, secondary, danger, and success button styles
    - Add size variants (sm, md, lg) and loading states
    - Include hover and active states using design system colors
    - _Requirements: 5.1, 5.3_

  - [ ]* 2.2 Write property test for Button component
    - **Property 3: Design System Compliance**
    - **Validates: Requirements 5.1, 5.3**

  - [x] 2.3 Create InputField component with validation states
    - Implement text, email, tel, number, and date input types
    - Add focus states with Trust Blue border (2px solid #0061FF)
    - Include error and success styling with appropriate colors
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 2.4 Write property test for InputField component
    - **Property 8: Form Validation and Feedback**
    - **Validates: Requirements 6.1, 6.2, 6.3**

  - [x] 2.5 Create StatusBadge component for trust segments and invoice status
    - Implement trust segment badges with colors and emojis
    - Create invoice status badges (Paid, Pending, Overdue)
    - Ensure semantic color usage across all status types
    - _Requirements: 1.2, 3.1, 5.2_

  - [ ]* 2.6 Write property test for StatusBadge component
    - **Property 1: Trust Segment Visual Consistency**
    - **Property 2: Status Color Semantic Consistency**
    - **Validates: Requirements 1.2, 3.1, 5.2**

- [x] 3. Layout and Navigation System
  - [x] 3.1 Create responsive Layout component with navigation
    - Implement desktop sidebar navigation (≥1024px)
    - Create mobile bottom navigation (<768px) with hamburger menu
    - Add tablet collapsible sidebar (768px-1023px)
    - Include active state highlighting with Trust Blue
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 3.2 Write property test for responsive navigation
    - **Property 9: Responsive Navigation Behavior**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [x] 3.3 Implement navigation routing with React Router
    - Set up routes for Dashboard, Clients, Invoices, Settings
    - Add route guards and navigation state management
    - Ensure touch-friendly button sizing on mobile (≥44px)
    - _Requirements: 4.1, 4.4_

- [x] 4. Dashboard Implementation
  - [x] 4.1 Create MetricCard component for dashboard statistics
    - Display total revenue, pending invoices, client count
    - Include trend indicators and change percentages
    - Use appropriate colors for different metric types
    - _Requirements: 1.1_

  - [x] 4.2 Implement TrustSegmentDistribution component
    - Create horizontal bar chart showing client distribution
    - Use trust segment colors and emojis (🦋⭐💤⚠️)
    - Display counts and percentages for each segment
    - _Requirements: 1.1, 1.2_

  - [x] 4.3 Create RecentActivity feed component
    - Display latest 5 invoices with status and client information
    - Include timestamps and action indicators
    - Use status colors for different activity types
    - _Requirements: 1.3_

  - [ ]* 4.4 Write property test for dashboard data display
    - **Property 4: Dashboard Data Completeness**
    - **Validates: Requirements 1.1, 1.3**

  - [x] 4.5 Implement real-time dashboard updates
    - Add state management for dashboard data
    - Ensure updates refresh display without page reload
    - Maintain data consistency across components
    - _Requirements: 1.5_

  - [ ]* 4.6 Write property test for real-time updates
    - **Property 5: Real-time UI Updates**
    - **Validates: Requirements 1.5**

- [x] 5. Checkpoint - Dashboard Complete
  - Ensure all tests pass, ask the user if questions arise.

- [-] 6. Client Management System
  - [x] 6.1 Create ClientList table component
    - Display clients with trust scores, segments, payment history
    - Implement sorting by name, trust score, last payment, total owed
    - Add alternating row colors and hover effects
    - Include responsive mobile card layout
    - _Requirements: 2.1, 7.1, 7.2, 7.4_

  - [ ]* 6.2 Write property test for client data display
    - **Property 6: Client Data Display Completeness**
    - **Validates: Requirements 2.1**

  - [ ]* 6.3 Write property test for table display
    - **Property 10: Table Display and Interaction**
    - **Validates: Requirements 7.1, 7.2, 7.4**

  - [x] 6.4 Implement client search and filtering
    - Add real-time search functionality
    - Filter by trust segment, payment status, amount owed
    - Update results as user types with debounced input
    - _Requirements: 2.4_

  - [ ]* 6.5 Write property test for search functionality
    - **Property 7: Search and Filter Functionality**
    - **Validates: Requirements 2.4**

  - [x] 6.6 Create ClientDetail modal component
    - Show detailed client information and payment history
    - Display outstanding invoices and trust score calculation
    - Include edit and action buttons
    - _Requirements: 2.3_

  - [x] 6.7 Implement AddClient form with validation
    - Create form with required field validation
    - Add real-time validation and error messaging
    - Include success confirmation on submission
    - _Requirements: 2.5_

  - [ ]* 6.8 Write unit tests for client form validation
    - Test required field validation and error messages
    - Test successful form submission flow
    - _Requirements: 2.5_

- [x] 7. Invoice Management System
  - [x] 7.1 Create InvoiceList table component
    - Display invoices with status badges using semantic colors
    - Implement filtering by status, date, amount, client
    - Add sorting functionality for all columns
    - Include mobile-responsive design
    - _Requirements: 3.1, 3.5, 7.3_

  - [x] 7.2 Implement overdue invoice highlighting
    - Add prominent visual highlighting for overdue invoices
    - Suggest follow-up actions (send reminder, call client)
    - Use danger colors (red #EF4444) for urgent attention
    - _Requirements: 3.3_

  - [ ]* 7.3 Write property test for invoice status highlighting
    - **Property 13: Invoice Status Highlighting**
    - **Validates: Requirements 3.3**

  - [x] 7.4 Create InvoiceForm component for creating invoices
    - Implement client selection with searchable dropdown
    - Add amount input with currency formatting
    - Include due date picker with smart defaults
    - Add dynamic items list with add/remove functionality
    - _Requirements: 3.2_

  - [ ]* 7.5 Write unit tests for invoice form
    - Test form structure and required fields
    - Test client selection and amount validation
    - _Requirements: 3.2_

  - [x] 7.6 Implement invoice status updates
    - Add "Mark as Paid" functionality
    - Update client trust score immediately when paid
    - Show success confirmation with green styling
    - _Requirements: 3.4_

  - [ ]* 7.7 Write property test for status updates
    - **Property 5: Real-time UI Updates** (invoice portion)
    - **Validates: Requirements 3.4**

- [x] 8. Mobile Optimization and Responsive Features
  - [x] 8.1 Implement mobile-specific input optimizations
    - Use appropriate HTML input types (email, tel, number, date)
    - Ensure proper mobile keyboard triggers
    - Add touch-friendly form interactions
    - _Requirements: 6.5_

  - [ ]* 8.2 Write property test for mobile input optimization
    - **Property 12: Mobile Input Optimization**
    - **Validates: Requirements 6.5**

  - [x] 8.3 Add responsive table handling
    - Implement column stacking on mobile devices
    - Create card-based layouts for narrow screens
    - Ensure data remains accessible and scannable
    - _Requirements: 7.4_

  - [x] 8.4 Create empty state components
    - Design helpful empty states for tables and lists
    - Include clear next action buttons and guidance
    - Use consistent styling with design system
    - _Requirements: 7.5_

  - [ ]* 8.5 Write property test for empty states
    - **Property 10: Table Display and Interaction** (empty state portion)
    - **Validates: Requirements 7.5**

- [x] 9. Loading States and Performance
  - [x] 9.1 Implement loading indicators and progress states
    - Create loading spinners matching design system
    - Add progress feedback for operations >1 second
    - Include skeleton loading for data tables
    - _Requirements: 8.1, 8.2_

  - [ ]* 9.2 Write property test for loading states
    - **Property 11: Loading and Progress States**
    - **Validates: Requirements 8.1, 8.2**

  - [x] 9.3 Add image and icon placeholder states
    - Prevent layout shifts during asset loading
    - Use consistent placeholder styling
    - Implement progressive loading for better UX
    - _Requirements: 8.4_

  - [x] 9.4 Optimize performance and caching
    - Implement data caching for frequently accessed information
    - Add memoization for expensive calculations
    - Optimize bundle size and loading performance
    - _Requirements: 8.3_

- [x] 10. Error Handling and Validation
  - [x] 10.1 Implement comprehensive form validation
    - Add real-time validation with debounced checking
    - Create reusable validation hooks and utilities
    - Ensure validation prevents invalid submissions
    - _Requirements: 6.4_

  - [x] 10.2 Add error boundaries and fallback UI
    - Create React Error Boundaries for component crashes
    - Design graceful degradation with user-friendly messages
    - Implement retry mechanisms for failed operations
    - _Requirements: Error Handling Strategy_

  - [ ]* 10.3 Write unit tests for error handling
    - Test error boundary behavior
    - Test form validation edge cases
    - Test network error recovery
    - _Requirements: 6.4_

- [x] 11. Integration and Final Polish
  - [x] 11.1 Wire all components together
    - Connect all forms to state management
    - Ensure data flows correctly between components
    - Add proper error handling throughout the application
    - _Requirements: All requirements integration_

  - [x] 11.2 Add accessibility improvements
    - Implement keyboard navigation for all interactive elements
    - Add ARIA labels and screen reader support
    - Ensure color contrast meets WCAG AA standards
    - _Requirements: 5.4_

  - [ ]* 11.3 Write integration tests
    - Test complete user workflows (create client, add invoice, mark paid)
    - Test navigation between different sections
    - Test responsive behavior across breakpoints
    - _Requirements: Complete workflow validation_

- [x] 12. Final Checkpoint - Complete System Test
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and user feedback opportunities
- Mobile-first approach ensures responsive design from the start