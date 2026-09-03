# Graph Report - built by Miguel  (2026-08-31)

## Corpus Check
- 138 files · ~210,995 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1255 nodes · 1908 edges · 99 communities (62 shown, 33 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Slide & Presentation Engine
- Module 1 ($type)
- Design System & Tokens
- Module 3 (clsx)
- Module 4 ($type)
- Slide & Presentation Engine
- App Routing & Navigation
- Module 7 ($type)
- UI/UX Reasoning & Search
- Build & Configuration
- Design System & Tokens
- Design System & Tokens
- App Routing & Navigation
- App Routing & Navigation
- UI/UX Reasoning & Search
- Design System & Tokens
- Build & Configuration
- Build & Configuration
- Slide & Presentation Engine
- Design System & Tokens
- Build & Configuration
- Build & Configuration
- Quality Assurance Tests
- Brand & Color Extraction
- Module 24 ($type)
- App Routing & Navigation
- Quality Assurance Tests
- App Routing & Navigation
- Design System & Tokens
- UI/UX Reasoning & Search
- Brand & Color Extraction
- Module 31 (validate-asset.cjs)
- Brand & Color Extraction
- Design System & Tokens
- Quality Assurance Tests
- Module 35 (Add all available shadcn/ui components. Args: overwrite: If True, overwrite…)
- Build & Configuration
- App Routing & Navigation
- App Routing & Navigation
- Brand & Color Extraction
- App Routing & Navigation
- Module 41 (fast)
- Quality Assurance Tests
- Build & Configuration
- Module 44 (generate.py)
- Build & Configuration
- Build & Configuration
- App Routing & Navigation
- Quality Assurance Tests
- Build & Configuration
- Brand & Color Extraction
- Design System & Tokens
- App Routing & Navigation
- Design System & Tokens
- Quality Assurance Tests
- Module 55 ($type)
- App Routing & Navigation
- Design System & Tokens
- Quality Assurance Tests
- Module 59 (sm)
- Quality Assurance Tests
- Module 61 (lg)
- App Routing & Navigation
- Module 63 (xl)
- Module 64 ($type)
- Module 65 ($type)
- Brand & Color Extraction
- Slide & Presentation Engine
- App Routing & Navigation
- Module 69 (Create temporary project structure.)
- UI/UX Reasoning & Search
- Build & Configuration
- Build & Configuration
- App Routing & Navigation
- Quality Assurance Tests
- Build & Configuration
- Quality Assurance Tests
- Quality Assurance Tests
- Quality Assurance Tests
- Quality Assurance Tests
- Quality Assurance Tests
- Quality Assurance Tests
- Quality Assurance Tests
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Build & Configuration
- Quality Assurance Tests
- Build & Configuration
- Quality Assurance Tests
- Quality Assurance Tests

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 58 edges
2. `search()` - 43 edges
3. `TestTailwindConfigGenerator` - 35 edges
4. `search_stack()` - 35 edges
5. `DesignSystemGenerator` - 35 edges
6. `ShadcnInstaller` - 34 edges
7. `TestShadcnInstaller` - 26 edges
8. `compilerOptions` - 19 edges
9. `detect_domain()` - 18 edges
10. `BM25` - 16 edges

## Surprising Connections (you probably didn't know these)
- `TestShadcnInstaller` --uses--> `ShadcnInstaller`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_shadcn_add.py → .agents/skills/ui-styling/scripts/shadcn_add.py
- `TestGeneratedConfigIsValidJs` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .agents/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestTailwindConfigGenerator` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .agents/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestEndToEndCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestBm25CoreBehavior` --uses--> `BM25`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_core.py → .agents/skills/design/scripts/cip/core.py

## Import Cycles
- None detected.

## Communities (99 total, 33 thin omitted)

### Community 0 - "Slide & Presentation Engine"
Cohesion: 0.08
Nodes (46): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, _catalog_date(), _check_app_interface_contract(), _check_catalog_contract() (+38 more)

### Community 1 - "Module 1 ($type)"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 2 - "Design System & Tokens"
Cohesion: 0.04
Nodes (48): $type, $value, background, destructive, destructive-foreground, foreground, muted, muted-foreground (+40 more)

### Community 3 - "Module 3 (clsx)"
Cohesion: 0.04
Nodes (46): clsx, lucide-react, dependencies, clsx, lucide-react, react, react-dom, tailwind-merge (+38 more)

### Community 4 - "Module 4 ($type)"
Cohesion: 0.06
Nodes (45): $type, $value, $type, $value, bg, fg, font-size, hover-bg (+37 more)

### Community 5 - "Slide & Presentation Engine"
Cohesion: 0.08
Nodes (36): format_context(), format_result(), main(), Format a single search result for display, Format contextual recommendations for display., BM25, calculate_pattern_break(), detect_domain() (+28 more)

### Community 6 - "App Routing & Navigation"
Cohesion: 0.08
Nodes (37): detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+29 more)

### Community 7 - "Module 7 ($type)"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 8 - "UI/UX Reasoning & Search"
Cohesion: 0.10
Nodes (8): _exact_stack_identifier(), Resolve a standalone API identifier even when its BM25 IDF is low., Search stack-specific guidelines, search_stack(), _rows(), TestNativeDesktopStackFreshness, _rows(), TestWebStackFreshness

### Community 9 - "Build & Configuration"
Cohesion: 0.06
Nodes (16): Test adding colors multiple times., Test adding full color palette., Test adding custom spacing., Test adding custom breakpoints., Test TailwindConfigGenerator class., Test generating TypeScript configuration., Test validating config with empty theme extensions., Test writing configuration to file. (+8 more)

### Community 10 - "Design System & Tokens"
Cohesion: 0.09
Nodes (13): BM25, BM25 ranking algorithm for text search, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, BM25, BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords (+5 more)

### Community 11 - "Design System & Tokens"
Cohesion: 0.13
Nodes (24): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+16 more)

### Community 12 - "App Routing & Navigation"
Cohesion: 0.10
Nodes (21): queryClient, Register, router, @tanstack/react-router, Route, FeatureDemoItem, fetchProjectStats(), HomePage() (+13 more)

### Community 13 - "App Routing & Navigation"
Cohesion: 0.12
Nodes (7): Resolve a deprecated in-domain alias, or expose a cross-domain redirect., Main search function with auto-domain detection, search(), _style_search_destination(), TestSearchDomains, read_rows(), TestStyleTaxonomy

### Community 14 - "UI/UX Reasoning & Search"
Cohesion: 0.13
Nodes (25): _contains_phrase(), _domain_keywords(), _file_signature(), _get_bm25(), _load_csv(), _load_csv_snapshot(), _load_product_keywords(), _load_rows_or_empty() (+17 more)

### Community 15 - "Design System & Tokens"
Cohesion: 0.11
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 16 - "Build & Configuration"
Cohesion: 0.08
Nodes (24): DOM, DOM.Iterable, src, compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx (+16 more)

### Community 17 - "Build & Configuration"
Cohesion: 0.10
Nodes (12): main(), Add custom font families. Args: fonts: Dict of font_type: [font_names] e.g.,…, Add custom spacing values. Args: spacing: Dict of name: value e.g., {'18':…, Add custom breakpoints. Args: breakpoints: Dict of name: width e.g., {'3xl':…, Add plugin requirements. Args: plugins: List of plugin names e.g.,…, Get plugin recommendations based on configuration. Returns: List of recommended…, Generate Tailwind CSS configuration files., Validate configuration. Returns: Tuple of (valid, message) (+4 more)

### Community 18 - "Slide & Presentation Engine"
Cohesion: 0.15
Nodes (19): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+11 more)

### Community 19 - "Design System & Tokens"
Cohesion: 0.17
Nodes (5): DesignSystemGenerator, Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., TestReasoningMatch, TestReasoningContract

### Community 20 - "Build & Configuration"
Cohesion: 0.11
Nodes (18): vite.config.ts, compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 21 - "Build & Configuration"
Cohesion: 0.17
Nodes (17): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+9 more)

### Community 22 - "Quality Assurance Tests"
Cohesion: 0.13
Nodes (3): TestFixtureValidation, TestMetricMath, TestThresholdGate

### Community 23 - "Brand & Color Extraction"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 24 - "Module 24 ($type)"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 25 - "App Routing & Navigation"
Cohesion: 0.12
Nodes (9): Test adding components in dry run mode., Test ShadcnInstaller class., Test adding all components without config., Test adding all components in dry run mode., Test listing installed components without config., Test listing installed components when none exist., Test initialization with custom project root., Test checking for non-existent shadcn config. (+1 more)

### Community 27 - "App Routing & Navigation"
Cohesion: 0.23
Nodes (3): detect_domain(), Auto-detect the most relevant domain from query. Matches are weighted by…, TestDomainDetection

### Community 28 - "Design System & Tokens"
Cohesion: 0.18
Nodes (14): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_page_override_md(), _generate_intelligent_overrides(), hex_to_ansi(), Format a page-specific override file with intelligent AI-generated content., Generate intelligent overrides based on page type using layered search. Uses… (+6 more)

### Community 29 - "UI/UX Reasoning & Search"
Cohesion: 0.14
Nodes (8): Execute searches across multiple domains., Find matching reasoning rule for a category., Apply reasoning rules to search results., Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation. variance/motion/density are…, Bucket a 1-10 dial value into its tier config. Returns None if value is None., _resolve_dial()

### Community 30 - "Brand & Color Extraction"
Cohesion: 0.22
Nodes (11): calculateCompliance(), colorDistance(), displayPalette(), extractHexColors(), findNearestBrandColor(), fs, generateImageMagickCommand(), hexToRgb() (+3 more)

### Community 31 - "Module 31 (validate-asset.cjs)"
Cohesion: 0.25
Nodes (13): checkManifest(), formatBytes(), formatOutput(), fs, main(), parseFilename(), path, RULES (+5 more)

### Community 32 - "Brand & Color Extraction"
Cohesion: 0.22
Nodes (7): _contrast_ratio(), _derive_dark_palette(), WCAG contrast ratio for two hex colors, or None if either is invalid., Keep product brand tokens while deriving accessible dark surfaces., Pick the highest-ranked palette matching the resolved mode. Only the dark case…, _select_palette_for_mode(), TestPaletteSelection

### Community 33 - "Design System & Tokens"
Cohesion: 0.24
Nodes (11): extensions, formatReport(), fs, getFiles(), main(), parseArgs(), path, patterns (+3 more)

### Community 34 - "Quality Assurance Tests"
Cohesion: 0.20
Nodes (7): main(), Handle shadcn/ui component installation., ShadcnInstaller, Tests for shadcn_add.py, Test adding components that are already installed., Test listing installed components when they exist., Test getting installed components without config.

### Community 35 - "Module 35 (Add all available shadcn/ui components. Args: overwrite: If True, overwrite…)"
Cohesion: 0.21
Nodes (6): Add all available shadcn/ui components. Args: overwrite: If True, overwrite…, List installed components. Returns: Tuple of (success, message with component…, Check if shadcn is initialized in project. Returns: True if components.json…, Get list of already installed components. Returns: List of installed component…, Read shadcn version from project package.json; fall back to a pinned default., Add shadcn/ui components. Args: components: List of component names to add…

### Community 36 - "Build & Configuration"
Cohesion: 0.20
Nodes (6): Generate configuration file content. Returns: Configuration file as string, Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config. Validates each plugin name against a strict…, Add indentation to JSON string., Write configuration to file. Returns: Tuple of (success, message)

### Community 37 - "App Routing & Navigation"
Cohesion: 0.20
Nodes (7): format_markdown(), generate_design_system(), Format design system as markdown., Main entry point for design system generation. Args: query: Search query (e.g.,…, format_output(), Format results for Claude consumption (token-optimized), TestPersistence

### Community 38 - "App Routing & Navigation"
Cohesion: 0.21
Nodes (7): _query_wants_dark(), True when a styles.csv row describes itself as dark-first., True when the query explicitly asks for a dark theme., Resolve the mode the rest of the output has to agree with., _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

### Community 39 - "Brand & Color Extraction"
Cohesion: 0.31
Nodes (10): extractColorsFromTable(), extractCoreAttributes(), extractHexColors(), extractImageStyle(), extractTypography(), extractVoice(), fs, generatePromptAddition() (+2 more)

### Community 40 - "App Routing & Navigation"
Cohesion: 0.18
Nodes (8): args, fs, minimal, MINIMAL_TOKENS, path, projectRoot, tokensPath, wrapStyle

### Community 41 - "Module 41 (fast)"
Cohesion: 0.18
Nodes (11): fast, normal, slow, $type, $value, $type, $value, primitive (+3 more)

### Community 42 - "Quality Assurance Tests"
Cohesion: 0.18
Nodes (6): Test adding components with overwrite flag., Test successful component addition., Test component addition with subprocess error., Test component addition when npx is not found., Test successful addition of all components., patch

### Community 43 - "Build & Configuration"
Cohesion: 0.22
Nodes (8): Tests for tailwind_config_gen.py, Reduce a generated TS/JS config to a bare assignable object so it can be handed…, Regression guard for the missing-comma bug between the ``theme`` block and…, The property preceding ``plugins`` must end with a comma (pure-Python check, so…, The emitted config parses as valid JS via ``node --check``., _strip_to_object(), TestGeneratedConfigIsValidJs, parametrize

### Community 44 - "Module 44 (generate.py)"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation Args: aspect_ratio:…, Generate multiple logo variants with different styles (+1 more)

### Community 45 - "Build & Configuration"
Cohesion: 0.36
Nodes (9): flattenTokens(), fs, generateCSS(), generateTailwind(), main(), parseArgs(), path, resolveReference() (+1 more)

### Community 46 - "Build & Configuration"
Cohesion: 0.22
Nodes (6): Path, Initialize generator. Args: typescript: If True, generate .ts config, else .js…, Determine default output path., Create base configuration structure., Get default content paths for framework., Any

### Community 47 - "App Routing & Navigation"
Cohesion: 0.27
Nodes (5): _palette_is_dark(), WCAG relative luminance of a #RRGGBB string, or None if unparseable., True when a colors.csv row's Background is a dark surface., _relative_luminance(), TestLuminance

### Community 49 - "Build & Configuration"
Cohesion: 0.22
Nodes (3): read_rows(), TestTextLayoutDataContracts, TestTextLayoutRetrieval

### Community 50 - "Brand & Color Extraction"
Cohesion: 0.33
Nodes (8): adjustBrightness(), { execFileSync }, extractColorsFromMarkdown(), fs, generateColorScale(), main(), path, updateDesignTokens()

### Community 51 - "Design System & Tokens"
Cohesion: 0.28
Nodes (8): Path, Regression tests for validate-tokens.cjs. The validator used to skip any line…, A hardcoded hex on the same line as a var() token is still a violation., A line that references only tokens produces no false positives., _run(), test_flags_hardcoded_hex_sharing_line_with_token(), test_token_only_line_reports_no_violation(), CompletedProcess

### Community 52 - "App Routing & Navigation"
Cohesion: 0.25
Nodes (9): _exact_match_diagnostic(), _legacy_successor_guidance(), _normalize(), Apply longest-first synonym substitution at token boundaries., Whether a stack query explicitly targets an older framework generation., Choose one coherent applicability generation for stack retrieval., Prefer the explicit successor row for a brand-new app on legacy-only stacks., _stack_query_requests_legacy() (+1 more)

### Community 53 - "Design System & Tokens"
Cohesion: 0.25
Nodes (9): format_master_md(), persist_design_system(), Path, Format design system as MASTER.md with hierarchical override logic., Slugify a name into a single safe path segment. Only [a-z0-9_-] survives; every…, Write fully to a temp file, then publish atomically., Persist design system to design-system/<project>/ folder using Master +…, safe_slug() (+1 more)

### Community 54 - "Quality Assurance Tests"
Cohesion: 0.31
Nodes (6): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), Return deterministic mutations and an audit trail; never execute data., Parse the canonical condition -> action-array representation., _validate_action()

### Community 55 - "Module 55 ($type)"
Cohesion: 0.29
Nodes (8): $type, $value, $type, $value, radius, default, full, default

### Community 56 - "App Routing & Navigation"
Cohesion: 0.25
Nodes (8): _exact_row_identity(), Suggest complete public identities so a retry can bypass score thresholds., Return non-empty public identities from ordinary and alias fields., Resolve an explicit style identity without opening generic variant ranking., Return one row whose stable public identity exactly matches the query., _row_identities(), _style_identity(), _suggest_identities()

### Community 57 - "Design System & Tokens"
Cohesion: 0.39
Nodes (3): _filter_anti_patterns_for_mode(), Drop "avoid dark mode" advice once dark mode is the resolved answer., TestAntiPatternGating

### Community 58 - "Quality Assurance Tests"
Cohesion: 0.48
Nodes (3): split_values(), style_identities(), TestStyleIdentityContract

### Community 59 - "Module 59 (sm)"
Cohesion: 0.47
Nodes (6): sm, shadow, sm, sm, $type, $value

### Community 61 - "Module 61 (lg)"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 63 - "Module 63 (xl)"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 64 - "Module 64 ($type)"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 65 - "Module 65 ($type)"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

## Knowledge Gaps
- **196 isolated node(s):** `fs`, `path`, `fs`, `path`, `fs` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `search()` connect `App Routing & Navigation` to `Slide & Presentation Engine`, `App Routing & Navigation`, `UI/UX Reasoning & Search`, `UI/UX Reasoning & Search`, `Build & Configuration`, `App Routing & Navigation`, `App Routing & Navigation`, `App Routing & Navigation`, `Design System & Tokens`, `UI/UX Reasoning & Search`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `BM25` connect `Design System & Tokens` to `App Routing & Navigation`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `primitive` connect `Module 41 (fast)` to `Module 1 ($type)`, `Design System & Tokens`, `Module 7 ($type)`, `Module 55 ($type)`, `Module 24 ($type)`, `Module 59 (sm)`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `TestTailwindConfigGenerator`) actually correct?**
  _`TailwindConfigGenerator` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `fs` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Slide & Presentation Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.07656341320864991 - nodes in this community are weakly interconnected._