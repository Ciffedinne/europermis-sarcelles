# Graph Report - .  (2026-07-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 600 nodes · 825 edges · 42 communities (37 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3da6f9b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_App Layout and Shell|App Layout and Shell]]
- [[_COMMUNITY_External Dependencies|External Dependencies]]
- [[_COMMUNITY_Input and Sheet Components|Input and Sheet Components]]
- [[_COMMUNITY_Command and Dialog Components|Command and Dialog Components]]
- [[_COMMUNITY_Supabase Auth and Client|Supabase Auth and Client]]
- [[_COMMUNITY_Local Auth and Session|Local Auth and Session]]
- [[_COMMUNITY_Project Tooling and Linting|Project Tooling and Linting]]
- [[_COMMUNITY_Routing and Notifications|Routing and Notifications]]
- [[_COMMUNITY_Feedback and Selection UI|Feedback and Selection UI]]
- [[_COMMUNITY_Buttons and Navigation|Buttons and Navigation]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Project Structure and Aliases|Project Structure and Aliases]]
- [[_COMMUNITY_Menubar Components|Menubar Components]]
- [[_COMMUNITY_Form Components|Form Components]]
- [[_COMMUNITY_Carousel Components|Carousel Components]]
- [[_COMMUNITY_Chart Components|Chart Components]]
- [[_COMMUNITY_Context Menu Components|Context Menu Components]]
- [[_COMMUNITY_Dropdown Menu Components|Dropdown Menu Components]]
- [[_COMMUNITY_Alert Dialog Components|Alert Dialog Components]]
- [[_COMMUNITY_Table Components|Table Components]]
- [[_COMMUNITY_Breadcrumb Components|Breadcrumb Components]]
- [[_COMMUNITY_Drawer Components|Drawer Components]]
- [[_COMMUNITY_Navigation Menu Components|Navigation Menu Components]]
- [[_COMMUNITY_Select Components|Select Components]]
- [[_COMMUNITY_Card Components|Card Components]]
- [[_COMMUNITY_Toggle Components|Toggle Components]]
- [[_COMMUNITY_OTP Input Components|OTP Input Components]]
- [[_COMMUNITY_Student Data Mocking|Student Data Mocking]]
- [[_COMMUNITY_Accordion Components|Accordion Components]]
- [[_COMMUNITY_Avatar Components|Avatar Components]]
- [[_COMMUNITY_Badge Components|Badge Components]]
- [[_COMMUNITY_Tabs Components|Tabs Components]]
- [[_COMMUNITY_Server Config and Helpers|Server Config and Helpers]]
- [[_COMMUNITY_File Catch-all Route|File Catch-all Route]]
- [[_COMMUNITY_Category Posts Route|Category Posts Route]]
- [[_COMMUNITY_User Detail Route|User Detail Route]]
- [[_COMMUNITY_User Index Route|User Index Route]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 69 edges
2. `compilerOptions` - 17 edges
3. `scripts` - 7 edges
4. `readJson()` - 7 edges
5. `aliases` - 6 edges
6. `buttonVariants` - 6 edges
7. `getStoredStudents()` - 6 edges
8. `FileRoutesByPath` - 6 edges
9. `tailwind` - 5 edges
10. `Database` - 5 edges

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

## Communities (42 total, 5 thin omitted)

### Community 0 - "App Layout and Shell"
Cohesion: 0.06
Nodes (31): AppShell(), Props, BottomNav(), Props, TabItem, PopoverContent, addAppreciation(), Appreciation (+23 more)

### Community 1 - "External Dependencies"
Cohesion: 0.04
Nodes (52): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers, lucide-react (+44 more)

### Community 2 - "Input and Sheet Components"
Cohesion: 0.05
Nodes (39): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+31 more)

### Community 3 - "Command and Dialog Components"
Cohesion: 0.05
Nodes (31): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+23 more)

### Community 4 - "Supabase Auth and Client"
Cohesion: 0.07
Nodes (27): attachSupabaseAuth, requireSupabaseAuth, supabaseAdmin, supabase, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+19 more)

### Community 5 - "Local Auth and Session"
Cohesion: 0.10
Nodes (30): DEMO_ACCOUNTS, seedDemoAccounts, ActiveSession, authenticateLocalUser(), canUseStorage(), clearActiveStudentSession(), DEMO_AUTH_USERS, getActiveSession() (+22 more)

### Community 6 - "Project Tooling and Linting"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+21 more)

### Community 7 - "Routing and Notifications"
Cohesion: 0.09
Nodes (21): sonner, Toaster(), ToasterProps, Route, Route, Route, Routes README, Route (+13 more)

### Community 8 - "Feedback and Selection UI"
Cohesion: 0.08
Nodes (14): Alert, AlertDescription, AlertTitle, alertVariants, Checkbox, HoverCardContent, Progress, RadioGroup (+6 more)

### Community 9 - "Buttons and Navigation"
Cohesion: 0.19
Nodes (16): Button, ButtonProps, buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent, PaginationEllipsis() (+8 more)

### Community 10 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 11 - "Project Structure and Aliases"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 12 - "Menubar Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 13 - "Form Components"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 14 - "Carousel Components"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 15 - "Chart Components"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 16 - "Context Menu Components"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 17 - "Dropdown Menu Components"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 18 - "Alert Dialog Components"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 19 - "Table Components"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 20 - "Breadcrumb Components"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 21 - "Drawer Components"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 22 - "Navigation Menu Components"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 23 - "Select Components"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 24 - "Card Components"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 25 - "Toggle Components"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 26 - "OTP Input Components"
Cohesion: 0.40
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 27 - "Student Data Mocking"
Cohesion: 0.40
Nodes (3): MOCK_POOL, RapidoConfig, RapidoStudent

### Community 28 - "Accordion Components"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 29 - "Avatar Components"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 30 - "Badge Components"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 31 - "Tabs Components"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

## Knowledge Gaps
- **338 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+333 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Buttons and Navigation` to `App Layout and Shell`, `Input and Sheet Components`, `Command and Dialog Components`, `Feedback and Selection UI`, `Menubar Components`, `Form Components`, `Carousel Components`, `Chart Components`, `Context Menu Components`, `Dropdown Menu Components`, `Alert Dialog Components`, `Table Components`, `Breadcrumb Components`, `Drawer Components`, `Navigation Menu Components`, `Select Components`, `Card Components`, `Toggle Components`, `OTP Input Components`, `Accordion Components`, `Avatar Components`, `Badge Components`, `Tabs Components`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Why does `dependencies` connect `External Dependencies` to `OTP Input Components`, `Project Tooling and Linting`, `Routing and Notifications`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `input-otp` connect `OTP Input Components` to `External Dependencies`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _338 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Layout and Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.058001397624039136 - nodes in this community are weakly interconnected._
- **Should `External Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Should `Input and Sheet Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05087881591119334 - nodes in this community are weakly interconnected._