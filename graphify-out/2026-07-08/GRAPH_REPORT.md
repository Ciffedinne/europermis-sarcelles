# Graph Report - .  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 602 nodes · 805 edges · 44 communities (38 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06fd3d1f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_instructor.tsx|instructor.tsx]]
- [[_COMMUNITY_External Dependencies|External Dependencies]]
- [[_COMMUNITY_Input and Sheet Components|Input and Sheet Components]]
- [[_COMMUNITY_local-auth.ts|local-auth.ts]]
- [[_COMMUNITY_admin.tsx|admin.tsx]]
- [[_COMMUNITY_types.ts|types.ts]]
- [[_COMMUNITY_Project Tooling and Linting|Project Tooling and Linting]]
- [[_COMMUNITY_Routing and Notifications|Routing and Notifications]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Project Structure and Aliases|Project Structure and Aliases]]
- [[_COMMUNITY_command.tsx|command.tsx]]
- [[_COMMUNITY_menubar.tsx|menubar.tsx]]
- [[_COMMUNITY_form.tsx|form.tsx]]
- [[_COMMUNITY_carousel.tsx|carousel.tsx]]
- [[_COMMUNITY_chart.tsx|chart.tsx]]
- [[_COMMUNITY_context-menu.tsx|context-menu.tsx]]
- [[_COMMUNITY_dropdown-menu.tsx|dropdown-menu.tsx]]
- [[_COMMUNITY_alert-dialog.tsx|alert-dialog.tsx]]
- [[_COMMUNITY_table.tsx|table.tsx]]
- [[_COMMUNITY_breadcrumb.tsx|breadcrumb.tsx]]
- [[_COMMUNITY_drawer.tsx|drawer.tsx]]
- [[_COMMUNITY_navigation-menu.tsx|navigation-menu.tsx]]
- [[_COMMUNITY_select.tsx|select.tsx]]
- [[_COMMUNITY_card.tsx|card.tsx]]
- [[_COMMUNITY_toggle-group.tsx|toggle-group.tsx]]
- [[_COMMUNITY_input-otp.tsx|input-otp.tsx]]
- [[_COMMUNITY_alert.tsx|alert.tsx]]
- [[_COMMUNITY_rapido.ts|rapido.ts]]
- [[_COMMUNITY_accordion.tsx|accordion.tsx]]
- [[_COMMUNITY_avatar.tsx|avatar.tsx]]
- [[_COMMUNITY_badge.tsx|badge.tsx]]
- [[_COMMUNITY_example.functions.ts|example.functions.ts]]
- [[_COMMUNITY_radio-group.tsx|radio-group.tsx]]
- [[_COMMUNITY_files$.tsx|files/$.tsx]]
- [[_COMMUNITY_posts{-$category}.tsx|posts/{-$category}.tsx]]
- [[_COMMUNITY_users$id.tsx|users/$id.tsx]]
- [[_COMMUNITY_usersindex.tsx|users/index.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 69 edges
2. `compilerOptions` - 17 edges
3. `readJson()` - 7 edges
4. `scripts` - 7 edges
5. `aliases` - 6 edges
6. `buttonVariants` - 6 edges
7. `FileRoutesByPath` - 6 edges
8. `tailwind` - 5 edges
9. `getAppreciations()` - 5 edges
10. `renderErrorPage()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- 1-file cycle: `src/components/ui/input-otp.tsx -> src/components/ui/input-otp.tsx`
- 1-file cycle: `src/components/ui/sonner.tsx -> src/components/ui/sonner.tsx`

## Hyperedges (group relationships)
- **TanStack Start Routing System** — src_routes_root, src_routes_index, src_routes_about, src_routes_users_index, src_routes_users_id, src_routes_posts_category, src_routes_files_splat, src_routes_layout, src_routes_routetree_gen [EXTRACTED 1.00]

## Communities (44 total, 6 thin omitted)

### Community 0 - "instructor.tsx"
Cohesion: 0.06
Nodes (32): AppShell(), Props, BottomNav(), Props, TabItem, PopoverContent, addAppreciation(), Appreciation (+24 more)

### Community 1 - "External Dependencies"
Cohesion: 0.04
Nodes (52): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers, lucide-react (+44 more)

### Community 2 - "Input and Sheet Components"
Cohesion: 0.05
Nodes (39): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+31 more)

### Community 3 - "local-auth.ts"
Cohesion: 0.10
Nodes (29): DEMO_ACCOUNTS, seedDemoAccounts, ActiveSession, authenticateLocalUser(), canUseStorage(), clearActiveStudentSession(), DEMO_AUTH_USERS, getActiveSession() (+21 more)

### Community 4 - "admin.tsx"
Cohesion: 0.07
Nodes (23): provisionAccounts, ProvisionInput, ProvisionResult, ProvisionRole, resetStudentAccounts, ResetStudentsResult, AdminPlanning(), formatFR() (+15 more)

### Community 5 - "types.ts"
Cohesion: 0.08
Nodes (22): attachSupabaseAuth, requireSupabaseAuth, supabaseAdmin, supabase, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+14 more)

### Community 6 - "Project Tooling and Linting"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+21 more)

### Community 7 - "Routing and Notifications"
Cohesion: 0.09
Nodes (21): sonner, Toaster(), ToasterProps, Route, Route, Route, Routes README, Route (+13 more)

### Community 8 - "cn"
Cohesion: 0.19
Nodes (16): Button, ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis() (+8 more)

### Community 9 - "utils.ts"
Cohesion: 0.10
Nodes (11): Checkbox, HoverCardContent, Progress, ScrollArea, ScrollBar, Slider, Switch, TabsContent (+3 more)

### Community 10 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 11 - "Project Structure and Aliases"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 12 - "command.tsx"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 13 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 14 - "form.tsx"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 15 - "carousel.tsx"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 16 - "chart.tsx"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 17 - "context-menu.tsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 18 - "dropdown-menu.tsx"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 19 - "alert-dialog.tsx"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 20 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 21 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 22 - "drawer.tsx"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 23 - "navigation-menu.tsx"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 24 - "select.tsx"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 25 - "card.tsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 26 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 27 - "input-otp.tsx"
Cohesion: 0.40
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 28 - "alert.tsx"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 29 - "rapido.ts"
Cohesion: 0.40
Nodes (3): MOCK_POOL, RapidoConfig, RapidoStudent

### Community 30 - "accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 31 - "avatar.tsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 32 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

## Knowledge Gaps
- **343 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+338 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `instructor.tsx`, `Input and Sheet Components`, `utils.ts`, `command.tsx`, `menubar.tsx`, `form.tsx`, `carousel.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `alert-dialog.tsx`, `table.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `navigation-menu.tsx`, `select.tsx`, `card.tsx`, `toggle-group.tsx`, `input-otp.tsx`, `alert.tsx`, `accordion.tsx`, `avatar.tsx`, `badge.tsx`, `radio-group.tsx`?**
  _High betweenness centrality (0.334) - this node is a cross-community bridge._
- **Why does `dependencies` connect `External Dependencies` to `input-otp.tsx`, `Project Tooling and Linting`, `Routing and Notifications`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `input-otp` connect `input-otp.tsx` to `External Dependencies`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _343 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `instructor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05656565656565657 - nodes in this community are weakly interconnected._
- **Should `External Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Should `Input and Sheet Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05087881591119334 - nodes in this community are weakly interconnected._