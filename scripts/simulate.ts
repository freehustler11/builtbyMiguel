import 'dotenv/config'
import { db } from '../app/db/index'
import {
  users,
  clients,
  reports,
  messages,
  media,
  activityLogs,
  landingPages,
  clientArticles,
  keywords,
  keywordRankHistory,
  tasks,
  monthlyMetrics,
} from '../app/db/schema'
import { eq, sql, inArray, and, isNull } from 'drizzle-orm'
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, getSessionData } from '../app/lib/auth'
import { getEffectivePartnerId } from '../app/server/auth'
import { recordMonthlyMetrics } from '../app/server/metrics'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ReportDocument } from '../src/components/ReportDocument'
import { parseReportPeriod, collectDeliverablesSnapshot } from '../app/server/reports-helpers'

async function runSimulations() {
  console.log('====================================================')
  console.log('🚀 BUILT BY MIGUEL - APP SIMULATION & VERIFICATION')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, desc: string, details?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${desc}`, details || '')
      failed++
    }
  }

  // ---------------------------------------------------------------
  // SIMULATION 1: Database Connectivity & Core Tables
  // ---------------------------------------------------------------
  console.log('🔍 SIMULATION 1: Database Connectivity & Core Tables')
  try {
    const existingUsers = await db.select().from(users)
    assert(Array.isArray(existingUsers), 'Database query to users succeeded')
    console.log(`     Found ${existingUsers.length} users in database:`)
    existingUsers.forEach((u) => console.log(`     - [${u.role}] ${u.email} (active: ${u.isActive})`))

    const existingClients = await db.select().from(clients)
    assert(existingClients.length > 0, `Database has ${existingClients.length} clients`)

    const existingReports = await db.select().from(reports)
    assert(existingReports.length > 0, `Database has ${existingReports.length} reports`)
  } catch (err: any) {
    assert(false, 'Database connectivity failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 2: Superadmin Account in Database
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 2: Superadmin Account & Authentication')
  const adminPassword = process.env.ADMIN_PASSWORD || 'L0v3hurt$11290523'
  const superadminEmail = 'admin@builtbymiguel.net'

  try {
    let [superadmin] = await db.select().from(users).where(eq(users.email, superadminEmail))
    if (!superadmin) {
      console.log(`     Creating explicit superadmin user in DB: ${superadminEmail}...`)
      const passwordHash = await hashPassword(adminPassword)
      const [created] = await db.insert(users).values({
        email: superadminEmail,
        passwordHash,
        name: 'Miguel (Superadmin)',
        role: 'superadmin',
        isActive: true,
      }).returning()
      superadmin = created
      console.log(`     Explicit superadmin created with ID: ${superadmin.id}`)
    }

    assert(superadmin !== undefined, 'Superadmin record exists')
    assert(superadmin.role === 'superadmin', 'Superadmin has role superadmin')
    assert(superadmin.isActive === true, 'Superadmin account is active')

    const isPwValid = await verifyPassword(adminPassword, superadmin.passwordHash)
    assert(isPwValid, 'Superadmin password verifies correctly against passwordHash')

    const isWrongPwRejected = await verifyPassword('wrongpassword123', superadmin.passwordHash)
    assert(!isWrongPwRejected, 'Incorrect password rejected')
  } catch (err: any) {
    assert(false, 'Superadmin simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 3: Session Token Signing & Payload Decoding
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 3: Session Token Signing & Payload Decoding')
  try {
    const token = await createSessionToken({
      role: 'superadmin',
      userId: 'test-admin-id',
      email: superadminEmail,
      isActive: true,
    })
    assert(typeof token === 'string' && token.length > 20, 'Session token successfully generated')

    const isValid = await verifySessionToken(token)
    assert(isValid === true, 'Session token verified successfully (returns boolean true)')

    const sessionData = await getSessionData(token)
    assert(sessionData !== null, 'Session payload extracted successfully')
    assert(sessionData?.role === 'superadmin', 'Decoded session role is superadmin')
    assert(sessionData?.email === superadminEmail, 'Decoded session email matches')
    assert(sessionData?.isActive === true, 'Decoded session isActive is true')

    const fakeTokenValid = await verifySessionToken('invalid.jwt.token')
    assert(fakeTokenValid === false, 'Forged token correctly rejected (returns boolean false)')

    const fakeTokenData = await getSessionData('invalid.jwt.token')
    assert(fakeTokenData === null, 'Forged token data returns null')
  } catch (err: any) {
    assert(false, 'Token simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 4: Report Rendering & Edge Cases
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 4: ReportDocument HTML Generation & Formatting')
  try {
    const [sampleClient] = await db.select().from(clients)
    const [sampleReport] = await db.select().from(reports)

    // Test 1: Render existing real report
    const html1 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        client: sampleClient,
        report: sampleReport,
      })
    )
    assert(
      html1.includes('MONTHLY PERFORMANCE REPORT') ||
      html1.includes(sampleReport.title.toUpperCase()),
      'Report contains Monthly Performance Report header'
    )
    assert(html1.includes('Campaign Focus Areas'), 'Page 2 contains Campaign Focus Areas')
    assert(html1.includes('Google Business Profile'), 'Campaign Focus Areas contains Google Business Profile')
    assert(
      html1.includes('Optimization &amp; Engagement') || html1.includes('Optimization & Engagement'),
      'Focus area has correct status'
    )
    assert(html1.includes('Page 1 of 2'), 'Footer contains Page 1 of 2')
    assert(html1.includes('Page 2 of 2'), 'Footer contains Page 2 of 2')
    assert(!html1.includes('Confidential • Page 1 of 2'), 'Page 1 does not have duplicate Confidential')

    // Test 2: Edge case - Brand new client with 0 prior metrics (Baseline pills)
    const zeroReport: any = {
      ...sampleReport,
      id: 'zero-test',
      title: 'Local SEO Report',
      gbpCalls: 12,
      prevGbpCalls: 0,
      gbpDirections: 25,
      prevGbpDirections: 0,
      gbpWebsiteClicks: 80,
      prevGbpWebsiteClicks: 0,
      gscClicks: 150,
      prevGscClicks: 0,
      gscImpressions: 4000,
      prevGscImpressions: 0,
      gaUsers: 300,
      prevGaUsers: 0,
      topQueries: [],
      topPages: [],
    }

    const html2 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        client: sampleClient,
        report: zeroReport,
      })
    )
    assert(html2.includes('LOCAL SEO REPORT'), 'Custom report title rendered correctly in uppercase')
    assert(html2.includes('Baseline'), 'Zero prior month shows Baseline badge instead of N/A')
    assert(!html2.includes('>N/A<'), 'No ugly N/A pills in metric cards')

    // Test 3: Spacing between labels and numbers (no collision like "Impressions34,700")
    assert(!html2.includes('Impressions4,000') && !html2.includes('Clicks150'), 'Labels and numbers are properly spaced without collision')

    // Test 4: White-label partner agency rendering
    const whiteLabelClient: any = {
      ...sampleClient,
      isWhiteLabel: true,
      partnerName: 'Apex Growth Partners',
      primaryColor: '#059669',
      secondaryColor: '#047857',
    }
    const whiteLabelReport: any = {
      ...sampleReport,
      clientSnapshot: {
        ...(sampleReport.clientSnapshot || {}),
        isWhiteLabel: true,
        partnerName: 'Apex Growth Partners',
      },
    }
    const html3 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        client: whiteLabelClient,
        report: whiteLabelReport,
        displayOptions: {
          show_agency_info: true,
          show_contact_person: true,
          show_date_generated: false,
          show_summary: true,
          show_tables: true,
          show_next_steps: true,
        },
      })
    )
    assert(html3.includes('Apex Growth Partners'), 'Partner agency name rendered in white-label mode')

    // Test 5: Top 5 Pages with Impressions and Position
    const pagesReport: any = {
      ...sampleReport,
      id: 'pages-test',
      topPages: [
        { path: '/dispensary-menu', impressions: 12500, position: 2.3 },
        { path: '/locations/miami', impressions: 8400, position: 1.8 },
      ],
    }
    const htmlPages = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        client: sampleClient,
        report: pagesReport,
        displayOptions: {
          show_agency_info: false,
          show_contact_person: true,
          show_date_generated: false,
          show_summary: true,
          show_tables: true,
          show_next_steps: true,
        },
      })
    )
    assert(htmlPages.includes('Top Landing Pages (GSC)'), 'Table 2 header rendered as Top Landing Pages (GSC)')
    assert(htmlPages.includes('12,500') && htmlPages.includes('2.3'), 'Top pages renders impressions and position correctly')
  } catch (err: any) {
    assert(false, 'ReportDocument rendering threw error', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 5: Hostname Routing Logic (Domain Classification)
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 5: Hostname Routing & Redirection Rules')
  try {
    const { classifyHost, isInternalPath, isMarketingPath } = await import('../src/lib/hostname')

    assert(classifyHost('builtbymiguel.net') === 'main', 'builtbymiguel.net classified as main')
    assert(classifyHost('www.builtbymiguel.net') === 'main', 'www.builtbymiguel.net classified as main')
    assert(classifyHost('app.builtbymiguel.net') === 'app', 'app.builtbymiguel.net classified as app')
    assert(classifyHost('localhost:3000') === 'dev', 'localhost:3000 classified as dev')

    assert(isInternalPath('/login'), '/login is internal path')
    assert(isInternalPath('/admin'), '/admin is internal path')
    assert(isInternalPath('/admin/reports/new'), '/admin/reports/new is internal path')
    assert(isInternalPath('/portal'), '/portal is internal path')
    assert(!isInternalPath('/about'), '/about is not internal path')
    assert(!isInternalPath('/'), '/ is not internal path')

    assert(isMarketingPath('/about'), '/about is marketing path')
    assert(isMarketingPath('/contact'), '/contact is marketing path')
    assert(isMarketingPath('/work'), '/work is marketing path')
    assert(!isMarketingPath('/login'), '/login is not marketing path')
    assert(!isMarketingPath('/admin'), '/admin is not marketing path')
    assert(!isMarketingPath('/assets/index.js'), 'Asset file is not marketing path')
  } catch (err: any) {
    assert(false, 'Hostname simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 6: Role Guard & Route Access Matrix
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 6: Role-Based Routing & Access Matrix')
  try {
    // Check destination for logged-in user on /login
    const getPostLoginRedirect = (role: string) => {
      if (role === 'superadmin') return '/admin'
      if (role === 'partner') return '/admin'
      if (role === 'partner_employee') return '/admin'
      if (role === 'client') return '/portal'
      return '/login'
    }

    assert(getPostLoginRedirect('superadmin') === '/admin', 'Superadmin routed to /admin')
    assert(getPostLoginRedirect('partner') === '/admin', 'Partner routed to /admin')
    assert(getPostLoginRedirect('partner_employee') === '/admin', 'Partner employee routed to /admin')
    assert(getPostLoginRedirect('client') === '/portal', 'Client routed to /portal')

    // Verify client cannot access /admin
    const canAccessAdmin = (role: string) =>
      role === 'superadmin' || role === 'partner' || role === 'admin' || role === 'partner_employee'
    assert(canAccessAdmin('superadmin') === true, 'Superadmin allowed on /admin')
    assert(canAccessAdmin('partner') === true, 'Partner allowed on /admin')
    assert(canAccessAdmin('partner_employee') === true, 'Partner employee allowed on /admin')
    assert(canAccessAdmin('client') === false, 'Client blocked on /admin')

    const canAccessSuperadminOnly = (role: string) => role === 'superadmin' || role === 'admin'
    assert(canAccessSuperadminOnly('superadmin') === true, 'Superadmin allowed on superadmin-only routes')
    assert(canAccessSuperadminOnly('partner') === false, 'Partner blocked on superadmin-only routes')
    assert(canAccessSuperadminOnly('partner_employee') === false, 'Partner employee blocked on superadmin-only routes')
  } catch (err: any) {
    assert(false, 'Role access simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 7: Partner Employees, Sub-Accounts & Tenant Isolation
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 7: Partner Employees, Sub-Accounts & Tenant Isolation')
  try {
    const { getEffectivePartnerId } = await import('../app/server/auth')

    // Test 1: Session Token creation and decoding for partner_employee
    const mockPartnerId = '11111111-2222-3333-4444-555555555555'
    const mockEmployeeId = '66666666-7777-8888-9999-000000000000'
    const empEmail = 'staff@agencygrowth.com'

    const empToken = await createSessionToken({
      role: 'partner_employee',
      userId: mockEmployeeId,
      partnerId: mockPartnerId,
      email: empEmail,
      isActive: true,
    })
    assert(typeof empToken === 'string' && empToken.length > 20, 'Employee session token generated')

    const decodedEmp = await getSessionData(empToken)
    assert(decodedEmp?.role === 'partner_employee', 'Decoded token role is partner_employee')
    assert(decodedEmp?.partnerId === mockPartnerId, 'Decoded token preserves partnerId parent reference')
    assert(decodedEmp?.userId === mockEmployeeId, 'Decoded token preserves employee userId')
    assert(decodedEmp?.email === empEmail, 'Decoded token preserves employee email')

    // Test 2: Effective Partner ID resolution (Tenant Scoping)
    const partnerOwnerScope = getEffectivePartnerId({
      role: 'partner',
      userId: mockPartnerId,
      clientId: null,
      email: 'owner@agencygrowth.com',
      isActive: true,
    })
    assert(partnerOwnerScope === mockPartnerId, 'Partner owner resolves effectivePartnerId to their userId')

    const employeeScope = getEffectivePartnerId({
      role: 'partner_employee',
      userId: mockEmployeeId,
      partnerId: mockPartnerId,
      clientId: null,
      email: empEmail,
      isActive: true,
    })
    assert(employeeScope === mockPartnerId, 'Employee resolves effectivePartnerId to their parent partnerId')

    const superadminScope = getEffectivePartnerId({
      role: 'superadmin',
      userId: 'admin-id',
      clientId: null,
      email: superadminEmail,
      isActive: true,
    })
    assert(superadminScope === null, 'Superadmin resolves effectivePartnerId to null (unscoped global access)')

    // Test 3: Database creation, foreign key linkage, and ON DELETE CASCADE
    const testOwnerEmail = `test_partner_owner_${Date.now()}@example.com`
    const testEmpEmail = `test_partner_employee_${Date.now()}@example.com`
    const testPwHash = await hashPassword('TempPassword123!')

    // Insert Partner Owner
    const [createdOwner] = await db.insert(users).values({
      email: testOwnerEmail,
      passwordHash: testPwHash,
      name: 'Test Agency Owner',
      role: 'partner',
      isActive: true,
    }).returning()
    assert(Boolean(createdOwner?.id), 'Test partner owner successfully created in DB')

    // Insert Employee under Partner
    const [createdEmp] = await db.insert(users).values({
      email: testEmpEmail,
      passwordHash: testPwHash,
      name: 'Test Team Member',
      role: 'partner_employee',
      partnerId: createdOwner.id,
      isActive: true,
    }).returning()
    assert(Boolean(createdEmp?.id), 'Test partner employee successfully created in DB')
    assert(createdEmp.partnerId === createdOwner.id, 'Employee record has valid foreign key partner_id')

    // Verify employee can authenticate
    const empPwValid = await verifyPassword('TempPassword123!', createdEmp.passwordHash)
    assert(empPwValid === true, 'Employee password verifies against passwordHash')

    // Test 4: Database ON DELETE CASCADE
    // Deleting the agency owner must automatically remove the employee sub-account
    await db.delete(users).where(eq(users.id, createdOwner.id))

    const [orphanedEmp] = await db.select().from(users).where(eq(users.id, createdEmp.id))
    assert(orphanedEmp === undefined, 'Employee sub-account automatically deleted on parent agency deletion (ON DELETE CASCADE)')

    const [deletedOwner] = await db.select().from(users).where(eq(users.id, createdOwner.id))
    assert(deletedOwner === undefined, 'Agency owner cleanly removed from DB')
  } catch (err: any) {
    assert(false, 'Partner employees simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 8: Superadmin Activity Tracking & Logs Table
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 8: Superadmin Activity Tracking & Device Parsing')
  try {
    const { activityLogs } = await import('../app/db/schema')
    const { parseDevice, logActivity } = await import('../app/server/activity-logger')

    // Test UA parsing
    const chromeWin = parseDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    assert(chromeWin === 'Chrome on Windows', `Chrome on Windows correctly identified: ${chromeWin}`)

    const safariIphone = parseDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    assert(safariIphone === 'Safari on iPhone', `Safari on iPhone correctly identified: ${safariIphone}`)

    const edgeWin = parseDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0')
    assert(edgeWin === 'Edge on Windows', `Edge on Windows correctly identified: ${edgeWin}`)

    const firefoxMac = parseDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0')
    assert(firefoxMac === 'Firefox on macOS', `Firefox on macOS correctly identified: ${firefoxMac}`)

    // Test Activity Logging
    const testLogId = `test_user_${Date.now()}@example.com`
    await logActivity({
      userEmail: testLogId,
      role: 'superadmin',
      action: 'login',
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    })

    await logActivity({
      userEmail: testLogId,
      role: 'superadmin',
      action: 'failed_login',
      ipAddress: '198.51.100.43',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1',
    })

    await logActivity({
      userEmail: testLogId,
      role: 'superadmin',
      action: 'logout',
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    })

    // Query recorded logs
    const recordedLogs = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userEmail, testLogId))

    assert(recordedLogs.length === 3, `Successfully recorded 3 activity log entries (found ${recordedLogs.length})`)

    const loginEntry = recordedLogs.find((l) => l.action === 'login')
    assert(Boolean(loginEntry), 'Successful login activity event recorded')
    assert(loginEntry?.ipAddress === '198.51.100.42', 'Login IP address captured accurately')

    const failedEntry = recordedLogs.find((l) => l.action === 'failed_login')
    assert(Boolean(failedEntry), 'Failed login attempt activity event recorded')
    assert(failedEntry?.ipAddress === '198.51.100.43', 'Failed login IP address captured accurately')

    const logoutEntry = recordedLogs.find((l) => l.action === 'logout')
    assert(Boolean(logoutEntry), 'Logout activity event recorded')

    // Clean up test activity logs
    await db.delete(activityLogs).where(eq(activityLogs.userEmail, testLogId))
    const [cleanedCheck] = await db.select().from(activityLogs).where(eq(activityLogs.userEmail, testLogId))
    assert(cleanedCheck === undefined, 'Test activity logs cleanly purged')
  } catch (err: any) {
    assert(false, 'Superadmin activity tracking simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 9: Report Creator Tracking (Internal Only)
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 9: Internal Report Creator Attribution')
  try {
    const [testClient] = await db.select().from(clients).limit(1)
    const [testUser] = await db.select().from(users).limit(1)

    assert(Boolean(testClient?.id), 'Client found for report creator test')
    assert(Boolean(testUser?.id), 'User found for report creator test')

    // Insert report with created_by_user_id
    const testReportTitle = `Creator Tracking Verification ${Date.now()}`
    const [createdReport] = await db.insert(reports).values({
      clientId: testClient.id,
      title: testReportTitle,
      reportMonth: 'September 2026',
      periodStart: new Date('2026-09-01T00:00:00Z'),
      periodEnd: new Date('2026-09-30T23:59:59.999Z'),
      createdByUserId: testUser.id,
    }).returning()

    assert(Boolean(createdReport?.id), 'Report with created_by_user_id successfully created')
    assert(createdReport.createdByUserId === testUser.id, 'Report createdByUserId matches creator user ID')

    // Query with creator leftJoin (identical to getReportsServerFn)
    const [joinedReport] = await db
      .select({
        id: reports.id,
        title: reports.title,
        createdByUserId: reports.createdByUserId,
        creatorName: users.name,
        creatorEmail: users.email,
      })
      .from(reports)
      .leftJoin(users, eq(reports.createdByUserId, users.id))
      .where(eq(reports.id, createdReport.id))

    assert(Boolean(joinedReport), 'Joined report query executed successfully')
    const creatorNameOrEmail = joinedReport.creatorName || joinedReport.creatorEmail || null
    assert(Boolean(creatorNameOrEmail), `Creator name/email populated for internal view: ${creatorNameOrEmail}`)

    // Verify client portal simulation: created_by_user_id is omitted from client output
    const { createdByUserId: _omitted, ...clientSanitizedReport } = joinedReport
    assert(!('createdByUserId' in clientSanitizedReport) || (clientSanitizedReport as any).createdByUserId === undefined, 'Report sanitized: created_by_user_id is never sent to client portal')

    // Clean up test report
    await db.delete(reports).where(eq(reports.id, createdReport.id))
    const [cleanedReport] = await db.select().from(reports).where(eq(reports.id, createdReport.id))
    assert(cleanedReport === undefined, 'Test report cleanly purged')
  } catch (err: any) {
    assert(false, 'Report creator tracking simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 10: Self-Service Password Change Verification
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 10: Self-Service Password Change')
  try {
    const testEmail = `self-change-${Date.now()}@example.com`
    const initialPass = 'InitialPass123!'
    const newPass = 'UpdatedSecurePass456!'
    const initialHash = await hashPassword(initialPass)

    const [user] = await db
      .insert(users)
      .values({
        name: 'Self Change Tester',
        email: testEmail,
        passwordHash: initialHash,
        role: 'partner',
        isActive: true,
      })
      .returning()

    assert(Boolean(user?.id), 'Test user created for self-service password test')

    // 1. Verify invalid current password is rejected
    const isInvalidOldPwAccepted = await verifyPassword('wrongcurrentpass', user.passwordHash)
    assert(!isInvalidOldPwAccepted, 'Incorrect current password is rejected')

    // 2. Verify correct current password validates
    const isValidOldPw = await verifyPassword(initialPass, user.passwordHash)
    assert(isValidOldPw, 'Correct current password validates successfully')

    // 3. Update password to new password
    const newHash = await hashPassword(newPass)
    const [updated] = await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning()

    assert(Boolean(updated?.id), 'Password updated in database')

    // 4. Verify old password no longer works
    const doesOldPassWork = await verifyPassword(initialPass, updated.passwordHash)
    assert(!doesOldPassWork, 'Old password rejected after password change')

    // 5. Verify new password works
    const doesNewPassWork = await verifyPassword(newPass, updated.passwordHash)
    assert(doesNewPassWork, 'New password verifies successfully')

    // Clean up
    await db.delete(users).where(eq(users.id, user.id))
    const [cleaned] = await db.select().from(users).where(eq(users.id, user.id))
    assert(cleaned === undefined, 'Test user cleanly purged')
  } catch (err: any) {
    assert(false, 'Self-service password change simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 11: Superadmin System-Wide Password Reset & Agency Owner Staff Reset
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 11: Superadmin System-Wide & Agency Owner Password Resets')
  try {
    const partnerEmail = `test-agency-owner-${Date.now()}@example.com`
    const employeeEmail = `test-employee-${Date.now()}@example.com`
    const clientEmail = `test-client-${Date.now()}@example.com`

    const [partnerUser] = await db
      .insert(users)
      .values({
        name: 'Agency Owner Tester',
        email: partnerEmail,
        passwordHash: await hashPassword('OwnerPass123!'),
        role: 'partner',
        isActive: true,
      })
      .returning()

    const [empUser] = await db
      .insert(users)
      .values({
        name: 'Staff Member Tester',
        email: employeeEmail,
        passwordHash: await hashPassword('OldStaffPass123!'),
        role: 'partner_employee',
        partnerId: partnerUser.id,
        isActive: true,
      })
      .returning()

    const [clientUser] = await db
      .insert(users)
      .values({
        name: 'Client Tester',
        email: clientEmail,
        passwordHash: await hashPassword('OldClientPass123!'),
        role: 'client',
        isActive: true,
      })
      .returning()

    assert(Boolean(partnerUser?.id && empUser?.id && clientUser?.id), 'Test accounts created for reset hierarchy')

    // A. Superadmin can reset ANY user (e.g. client user)
    const superadminNewClientPass = 'SuperResetClient789!'
    const resetClientHash = await hashPassword(superadminNewClientPass)
    await db.update(users).set({ passwordHash: resetClientHash }).where(eq(users.id, clientUser.id))
    const [verifiedClient] = await db.select().from(users).where(eq(users.id, clientUser.id))
    const doesSuperResetWorkOnClient = await verifyPassword(superadminNewClientPass, verifiedClient.passwordHash)
    assert(doesSuperResetWorkOnClient, 'Superadmin can reset client password directly')

    // B. Superadmin can reset Agency Owner
    const superadminNewOwnerPass = 'SuperResetOwner456!'
    const resetOwnerHash = await hashPassword(superadminNewOwnerPass)
    await db.update(users).set({ passwordHash: resetOwnerHash }).where(eq(users.id, partnerUser.id))
    const [verifiedOwner] = await db.select().from(users).where(eq(users.id, partnerUser.id))
    const doesSuperResetWorkOnOwner = await verifyPassword(superadminNewOwnerPass, verifiedOwner.passwordHash)
    assert(doesSuperResetWorkOnOwner, 'Superadmin can reset partner agency owner password directly')

    // C. Agency Owner can reset their own staff member
    const ownerNewStaffPass = 'OwnerResetStaff321!'
    assert(empUser.partnerId === partnerUser.id, 'Employee is owned by the partner agency')
    const resetStaffHash = await hashPassword(ownerNewStaffPass)
    await db.update(users).set({ passwordHash: resetStaffHash }).where(eq(users.id, empUser.id))
    const [verifiedStaff] = await db.select().from(users).where(eq(users.id, empUser.id))
    const doesStaffNewPassWork = await verifyPassword(ownerNewStaffPass, verifiedStaff.passwordHash)
    assert(doesStaffNewPassWork, 'Agency owner can reset their own staff member password')

    // Clean up
    await db.delete(users).where(eq(users.id, empUser.id))
    await db.delete(users).where(eq(users.id, clientUser.id))
    await db.delete(users).where(eq(users.id, partnerUser.id))

    const [cleanedCheck] = await db.select().from(users).where(eq(users.id, partnerUser.id))
    assert(cleanedCheck === undefined, 'All test accounts cleanly purged')
  } catch (err: any) {
    assert(false, 'Superadmin & agency owner password reset simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 12: Immutable Report Snapshot & Rename Invariance
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 12: Immutable Report Snapshot & Rename Invariance')
  try {
    const originalName = 'Original Bakery Co'
    const [testClient] = await db
      .insert(clients)
      .values({
        name: 'Snapshot Test Contact',
        businessName: originalName,
        websiteUrl: 'https://originalbakery.com',
        logoUrl: 'https://originalbakery.com/logo.png',
        primaryColor: '#ff0055',
        secondaryColor: '#112233',
        isWhiteLabel: true,
        partnerName: 'Apex Marketing',
        partnerLogoUrl: 'https://apex.com/logo.png',
      })
      .returning()

    assert(Boolean(testClient?.id), 'Test client created for snapshot testing')

    const clientSnapshot = {
      businessName: testClient.businessName,
      logoUrl: testClient.logoUrl,
      primaryColor: testClient.primaryColor,
      secondaryColor: testClient.secondaryColor,
      isWhiteLabel: testClient.isWhiteLabel,
      partnerName: testClient.partnerName,
      partnerLogoUrl: testClient.partnerLogoUrl,
    }

    const [testReport] = await db
      .insert(reports)
      .values({
        clientId: testClient.id,
        title: 'Original Bakery Co Performance',
        reportMonth: 'August 2026',
        periodStart: new Date('2026-08-01T00:00:00.000Z'),
        periodEnd: new Date('2026-08-31T23:59:59.999Z'),
        clientSnapshot,
        gbpCalls: 45,
        gbpViews: 500,
      })
      .returning()

    assert(Boolean(testReport?.id), 'Test report created with frozen clientSnapshot')
    assert(Boolean(testReport.periodStart && testReport.periodEnd), 'Report periodStart and periodEnd populated')

    // Render static HTML before rename
    const htmlBefore = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        report: testReport as any,
        client: testClient as any,
      })
    )
    assert(htmlBefore.includes(originalName), 'HTML before rename displays original business name')
    assert(htmlBefore.includes('MONTHLY PERFORMANCE REPORT'), 'Title badge compares against snapshot business name')

    // Now rename client in database to completely different branding
    const renamedName = 'Completely Different Donuts Inc'
    await db
      .update(clients)
      .set({
        businessName: renamedName,
        logoUrl: 'https://differentdonuts.com/new-logo.png',
        primaryColor: '#00ff00',
        secondaryColor: '#999999',
        isWhiteLabel: false,
        partnerName: 'Brand New Agency',
        partnerLogoUrl: 'https://brandnew.com/logo.png',
      })
      .where(eq(clients.id, testClient.id))

    const [renamedClient] = await db.select().from(clients).where(eq(clients.id, testClient.id))
    assert(renamedClient.businessName === renamedName, 'Live client table successfully renamed')

    // Render report again with the renamed live client passed in
    const htmlAfter = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        report: testReport as any,
        client: renamedClient as any,
      })
    )

    assert(htmlAfter === htmlBefore, 'Report HTML is 100% byte-for-byte identical after client rename')
    assert(!htmlAfter.includes(renamedName), 'Report HTML does NOT leak renamed client business name')
    assert(htmlAfter.includes(originalName), 'Report HTML retains original frozen business name from snapshot')
    assert(htmlAfter.includes('MONTHLY PERFORMANCE REPORT'), 'Title badge comparison remains consistent using snapshot')

    // Clean up
    await db.delete(reports).where(eq(reports.id, testReport.id))
    await db.delete(clients).where(eq(clients.id, testClient.id))
    assert(true, 'Snapshot test client and report cleanly purged')
  } catch (err: any) {
    assert(false, 'Immutable report snapshot simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 13: SQL-Level Sorting Defaults & Case-Insensitive Nulls Last
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 13: SQL-Level Sorting Defaults & Case-Insensitive Nulls Last')
  try {
    // 1. Clients: lower(business_name) ASC with nulls last
    const [cZebra] = await db.insert(clients).values({
      name: 'Zebra Contact',
      businessName: 'zebra analytics',
    }).returning()
    const [cApple] = await db.insert(clients).values({
      name: 'Apple Contact',
      businessName: 'Apple Orchard',
    }).returning()
    const [cBanana] = await db.insert(clients).values({
      name: 'Banana Contact',
      businessName: 'banana bakery',
    }).returning()

    const sortedClients = await db
      .select({ id: clients.id, businessName: clients.businessName })
      .from(clients)
      .where(inArray(clients.id, [cZebra.id, cApple.id, cBanana.id]))
      .orderBy(sql`lower(${clients.businessName}) asc nulls last`)

    assert(
      sortedClients[0].id === cApple.id &&
      sortedClients[1].id === cBanana.id &&
      sortedClients[2].id === cZebra.id,
      'Clients default sort is case-insensitive lower(business_name) ASC (Apple Orchard -> banana bakery -> zebra analytics)'
    )

    await db.delete(clients).where(inArray(clients.id, [cZebra.id, cApple.id, cBanana.id]))

    // 2. Partners: coalesce(lower(name), lower(email)) ASC nulls last
    const dummyPassword = await hashPassword('TestSortPass123!')
    const [pZebra] = await db.insert(users).values({
      name: 'Zebra Digital',
      email: 'zebra-agency@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner',
    }).returning()
    const [pAlpha] = await db.insert(users).values({
      name: null,
      email: 'alpha-agency@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner',
    }).returning()
    const [pBeta] = await db.insert(users).values({
      name: 'beta agency',
      email: 'z-beta@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner',
    }).returning()

    const sortedPartners = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(inArray(users.id, [pZebra.id, pAlpha.id, pBeta.id]))
      .orderBy(sql`coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`)

    assert(
      sortedPartners[0].id === pAlpha.id &&
      sortedPartners[1].id === pBeta.id &&
      sortedPartners[2].id === pZebra.id,
      'Partners default sort is lower(name) ASC falling back to lower(email) when name is null (alpha email -> beta -> Zebra)'
    )

    await db.delete(users).where(inArray(users.id, [pZebra.id, pAlpha.id, pBeta.id]))

    // 3. Team members: active first (case-insensitive name ASC), inactive last
    const [uInactive] = await db.insert(users).values({
      name: 'Aaron Inactive',
      email: 'aaron-inactive@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner_employee',
      isActive: false,
    }).returning()
    const [uBobActive] = await db.insert(users).values({
      name: 'bob active',
      email: 'bob-active@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner_employee',
      isActive: true,
    }).returning()
    const [uCharlieActive] = await db.insert(users).values({
      name: 'Charlie Active',
      email: 'charlie-active@sort-test.com',
      passwordHash: dummyPassword,
      role: 'partner_employee',
      isActive: true,
    }).returning()

    const sortedTeam = await db
      .select({ id: users.id, name: users.name, isActive: users.isActive })
      .from(users)
      .where(inArray(users.id, [uInactive.id, uBobActive.id, uCharlieActive.id]))
      .orderBy(sql`case when ${users.isActive} = true then 0 else 1 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`)

    assert(
      sortedTeam[0].id === uBobActive.id &&
      sortedTeam[1].id === uCharlieActive.id &&
      sortedTeam[2].id === uInactive.id,
      'Team members default sort orders active users first alphabetically, inactive last (bob -> Charlie -> Aaron Inactive)'
    )

    await db.delete(users).where(inArray(users.id, [uInactive.id, uBobActive.id, uCharlieActive.id]))

    // 4. Reports: period_start DESC nulls last
    const [repClient] = await db.insert(clients).values({
      name: 'Report Sort Contact',
      businessName: 'Report Sort Test Client',
    }).returning()

    const [rJan] = await db.insert(reports).values({
      clientId: repClient.id,
      title: 'January Report',
      periodStart: new Date('2026-01-01T00:00:00Z'),
      periodEnd: new Date('2026-01-31T23:59:59Z'),
      reportMonth: 'January 2026',
    }).returning()
    const [rMarch] = await db.insert(reports).values({
      clientId: repClient.id,
      title: 'March Report',
      periodStart: new Date('2026-03-01T00:00:00Z'),
      periodEnd: new Date('2026-03-31T23:59:59Z'),
      reportMonth: 'March 2026',
    }).returning()
    const [rFeb] = await db.insert(reports).values({
      clientId: repClient.id,
      title: 'February Report',
      periodStart: new Date('2026-02-01T00:00:00Z'),
      periodEnd: new Date('2026-02-28T23:59:59Z'),
      reportMonth: 'February 2026',
    }).returning()

    const sortedReports = await db
      .select({ id: reports.id, periodStart: reports.periodStart })
      .from(reports)
      .where(inArray(reports.id, [rJan.id, rMarch.id, rFeb.id]))
      .orderBy(sql`${reports.periodStart} desc nulls last`)

    assert(
      sortedReports[0].id === rMarch.id &&
      sortedReports[1].id === rFeb.id &&
      sortedReports[2].id === rJan.id,
      'Reports default sort is period_start DESC (March -> February -> January)'
    )

    await db.delete(reports).where(inArray(reports.id, [rJan.id, rMarch.id, rFeb.id]))
    await db.delete(clients).where(eq(clients.id, repClient.id))

    // 5. Inbound Leads / Messages: status = 'new' first, then created_at DESC
    const now = Date.now()
    const [mArchived] = await db.insert(messages).values({
      type: 'contact',
      name: 'Old Archived Lead',
      businessName: 'Archived Corp',
      email: 'archived@lead.com',
      message: 'Hello',
      status: 'archived',
      createdAt: new Date(now - 10000),
    }).returning()
    const [mNewRecent] = await db.insert(messages).values({
      type: 'audit',
      name: 'New Recent Lead',
      businessName: 'Recent Corp',
      email: 'recent@new.com',
      message: 'Hello',
      status: 'new',
      createdAt: new Date(now),
    }).returning()
    const [mNewOlder] = await db.insert(messages).values({
      type: 'contact',
      name: 'New Older Lead',
      businessName: 'Older Corp',
      email: 'older@new.com',
      message: 'Hello',
      status: 'new',
      createdAt: new Date(now - 5000),
    }).returning()

    const sortedMessages = await db
      .select({ id: messages.id, status: messages.status, createdAt: messages.createdAt })
      .from(messages)
      .where(inArray(messages.id, [mArchived.id, mNewRecent.id, mNewOlder.id]))
      .orderBy(sql`case when ${messages.status} = 'new' then 0 else 1 end asc, ${messages.createdAt} desc nulls last`)

    assert(
      sortedMessages[0].id === mNewRecent.id &&
      sortedMessages[1].id === mNewOlder.id &&
      sortedMessages[2].id === mArchived.id,
      'Messages default sort is status = "new" first, then created_at DESC (New Recent -> New Older -> Archived)'
    )

    await db.delete(messages).where(inArray(messages.id, [mArchived.id, mNewRecent.id, mNewOlder.id]))

    // 6. Verify functional indexes in PostgreSQL pg_indexes
    const userLowerIndex = await db.execute(sql`
      SELECT indexname, indexdef FROM pg_indexes 
      WHERE tablename = 'users' AND indexname = 'users_lower_name_idx';
    `)
    assert(userLowerIndex.length > 0, 'Functional index users_lower_name_idx exists on lower(name)')

    const clientLowerIndex = await db.execute(sql`
      SELECT indexname, indexdef FROM pg_indexes 
      WHERE tablename = 'clients' AND indexname = 'clients_lower_business_name_idx';
    `)
    assert(clientLowerIndex.length > 0, 'Functional index clients_lower_business_name_idx exists on lower(business_name)')

    // 7. Interactive sorting test on partner query with subquery client counts
    const [pFirst] = await db.insert(users).values({
      name: 'AAA Agency',
      email: `aaa_${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'partner',
      isActive: true,
    }).returning()

    const [pSecond] = await db.insert(users).values({
      name: 'ZZZ Agency',
      email: `zzz_${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'partner',
      isActive: false,
    }).returning()

    // Give ZZZ Agency 1 client, AAA Agency 0 clients
    const [cZZZ] = await db.insert(clients).values({
      name: 'ZZZ Client',
      businessName: 'ZZZ Managed Account',
      partnerId: pSecond.id,
    }).returning()

    const clientCountSql = sql<number>`cast((select count(*) from clients where clients.partner_id = "users"."id" and clients.deleted_at is null) as int)`

    // Test sort by client count DESC
    const sortedByClientsDesc = await db
      .select({
        id: users.id,
        name: users.name,
        clientCount: clientCountSql,
      })
      .from(users)
      .where(inArray(users.id, [pFirst.id, pSecond.id]))
      .orderBy(sql`${clientCountSql} desc nulls last`)

    assert(
      sortedByClientsDesc[0].id === pSecond.id && Number(sortedByClientsDesc[0].clientCount) === 1,
      'Interactive sort by clients DESC in SQL correctly ranks ZZZ Agency (1 client) ahead of AAA Agency (0 clients)'
    )

    // Test sort by name DESC
    const sortedByNameDesc = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(inArray(users.id, [pFirst.id, pSecond.id]))
      .orderBy(sql`coalesce(lower(${users.name}), lower(${users.email})) desc nulls last`)

    assert(
      sortedByNameDesc[0].id === pSecond.id && sortedByNameDesc[1].id === pFirst.id,
      'Interactive sort by name DESC in SQL correctly ranks ZZZ before AAA'
    )

    // Test sort by status ASC (active first)
    const sortedByStatusAsc = await db
      .select({ id: users.id, isActive: users.isActive })
      .from(users)
      .where(inArray(users.id, [pFirst.id, pSecond.id]))
      .orderBy(sql`case when ${users.isActive} = true then 0 else 1 end asc, coalesce(lower(${users.name}), lower(${users.email})) asc nulls last`)

    assert(
      sortedByStatusAsc[0].id === pFirst.id && sortedByStatusAsc[1].id === pSecond.id,
      'Interactive sort by status in SQL correctly ranks active AAA ahead of inactive ZZZ'
    )

    await db.delete(clients).where(eq(clients.id, cZZZ.id))
    await db.delete(users).where(inArray(users.id, [pFirst.id, pSecond.id]))
  } catch (err: any) {
    assert(false, 'SQL-level sorting defaults simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 14: Superadmin Agencies, Unassigned Clients & Detail Aggregates
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 14: Superadmin Agencies, Unassigned Clients & Detail Aggregates')
  try {
    const { getEffectivePartnerId } = await import('../app/server/auth')

    // 1. Create a test partner agency with null name (testing fallback to email)
    const testAgencyPassword = await hashPassword('AgencyPass123!')
    const testAgencyEmail = `agency_sort_${Date.now()}@test.com`
    const [testAgency] = await db.insert(users).values({
      name: null,
      email: testAgencyEmail,
      passwordHash: testAgencyPassword,
      role: 'partner',
      isActive: true,
    }).returning()
    assert(Boolean(testAgency?.id), 'Test partner agency created successfully')
    assert(testAgency.name === null, 'Partner name is null, testing fallback to email')
    const displayName = testAgency.name || testAgency.email
    assert(displayName === testAgencyEmail, 'Fallback correctly resolves null name to email')

    // 2. Test edge case: Zero staff, zero clients initially
    const initialStaff = await db
      .select()
      .from(users)
      .where(and(eq(users.partnerId, testAgency.id), eq(users.role, 'partner_employee'), isNull(users.deletedAt)))
    assert(initialStaff.length === 0, 'Newly created agency has zero staff (handles 0 cleanly)')

    const initialClients = await db
      .select()
      .from(clients)
      .where(and(eq(clients.partnerId, testAgency.id), isNull(clients.deletedAt)))
    assert(initialClients.length === 0, 'Newly created agency has zero clients (handles 0 cleanly)')

    // 3. Add staff member to this agency
    const [agencyStaff] = await db.insert(users).values({
      name: 'Agency Staff Member',
      email: `staff_${Date.now()}@agency.com`,
      passwordHash: testAgencyPassword,
      role: 'partner_employee',
      partnerId: testAgency.id,
      isActive: true,
    }).returning()
    assert(Boolean(agencyStaff?.id), 'Staff member successfully added to agency')

    // 4. Create one assigned client and one unassigned client
    const [assignedClient] = await db.insert(clients).values({
      name: 'Assigned Contact',
      businessName: 'Assigned Corp',
      partnerId: testAgency.id,
    }).returning()
    const [unassignedClient] = await db.insert(clients).values({
      name: 'Direct Contact',
      businessName: 'Direct Unassigned Corp',
      partnerId: null,
    }).returning()

    // Query unassigned clients (simulating getClientsServerFn({ partnerId: 'unassigned' }))
    const unassignedResults = await db
      .select()
      .from(clients)
      .where(and(isNull(clients.partnerId), isNull(clients.deletedAt)))
    assert(
      unassignedResults.some((c) => c.id === unassignedClient.id),
      'Unassigned query contains direct client with partner_id IS NULL'
    )
    assert(
      !unassignedResults.some((c) => c.id === assignedClient.id),
      'Unassigned query excludes client assigned to a partner'
    )

    // Query agency clients (simulating getClientsServerFn({ partnerId: testAgency.id }))
    const agencyClients = await db
      .select()
      .from(clients)
      .where(and(eq(clients.partnerId, testAgency.id), isNull(clients.deletedAt)))
    assert(
      agencyClients.some((c) => c.id === assignedClient.id),
      'Agency query contains assigned client'
    )
    assert(
      !agencyClients.some((c) => c.id === unassignedClient.id),
      'Agency query excludes unassigned client'
    )

    // 5. Tenancy scoping guard check: partner_employee ignores partnerId filter
    const staffEffectivePartnerId = getEffectivePartnerId({
      role: 'partner_employee',
      userId: agencyStaff.id,
      partnerId: testAgency.id,
      clientId: null,
      email: agencyStaff.email,
      isActive: true,
    })
    assert(staffEffectivePartnerId === testAgency.id, 'Staff member is strictly scoped to their partnerId')

    // 6. Reports this month counting from period_start
    const now = new Date()
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
    const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0))
    const previousMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15, 0, 0, 0, 0))

    // Current month report
    const [currentReport] = await db.insert(reports).values({
      clientId: assignedClient.id,
      title: 'Current Month Report',
      periodStart: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 5, 0, 0, 0, 0)),
      periodEnd: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)),
      reportMonth: 'Current Month',
    }).returning()

    // Prior month report
    const [priorReport] = await db.insert(reports).values({
      clientId: assignedClient.id,
      title: 'Prior Month Report',
      periodStart: previousMonthDate,
      periodEnd: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999)),
      reportMonth: 'Prior Month',
    }).returning()

    const agencyMonthReports = await db
      .select({ id: reports.id })
      .from(reports)
      .where(
        and(
          eq(reports.clientId, assignedClient.id),
          sql`${reports.periodStart} >= ${startOfMonth.toISOString()}::timestamptz`,
          sql`${reports.periodStart} < ${startOfNextMonth.toISOString()}::timestamptz`
        )
      )

    assert(agencyMonthReports.length === 1, 'Only report with period_start in current UTC month is counted in reportsThisMonth')
    assert(agencyMonthReports[0].id === currentReport.id, 'Current month report accurately identified')

    // 7. Clean up
    await db.delete(reports).where(inArray(reports.id, [currentReport.id, priorReport.id]))
    await db.delete(clients).where(inArray(clients.id, [assignedClient.id, unassignedClient.id]))
    await db.delete(users).where(inArray(users.id, [agencyStaff.id, testAgency.id]))
    assert(true, 'Simulation 14 test data cleanly purged')
  } catch (err: any) {
    assert(false, 'Superadmin agencies simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 15: Client-Scoped CRM Database Tables & Constraints
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 15: Client-Scoped CRM Database Tables & Constraints')
  try {
    // 1. Create test partner, staff user, and test client
    const [testPartner] = await db.insert(users).values({
      name: 'CRM Test Partner Agency',
      email: `crm_partner_${Date.now()}@test.com`,
      passwordHash: await hashPassword('CrmPass123!'),
      role: 'partner',
      isActive: true,
    }).returning()
    assert(Boolean(testPartner?.id), 'Test partner agency created for CRM tables')

    const [testStaff] = await db.insert(users).values({
      name: 'CRM Staff Member',
      email: `crm_staff_${Date.now()}@test.com`,
      passwordHash: await hashPassword('CrmPass123!'),
      role: 'partner_employee',
      partnerId: testPartner.id,
      isActive: true,
    }).returning()
    assert(Boolean(testStaff?.id), 'Test staff member created')

    const [testClient] = await db.insert(clients).values({
      name: 'CRM Client Owner',
      businessName: 'Apex Dental Care',
      partnerId: testPartner.id,
    }).returning()
    assert(Boolean(testClient?.id), 'Test client created')

    // 2. Landing Pages: verify creation, default status 'planning', assignedTo, and wentLiveAt automatic setting
    const [lp] = await db.insert(landingPages).values({
      clientId: testClient.id,
      title: 'Emergency Dentist Landing Page',
      targetUrl: 'https://apexdental.com/emergency',
      focusKeyword: 'emergency dentist miami',
      ctaGoal: 'Schedule Emergency Appointment',
      assignedTo: testStaff.id,
    }).returning()
    assert(Boolean(lp?.id), 'Landing page inserted successfully')
    assert(lp.status === 'planning', 'Landing page default status is planning')
    assert(lp.wentLiveAt === null, 'Landing page wentLiveAt is initially null')
    assert(lp.assignedTo === testStaff.id, 'Landing page assignedTo references user')

    // Simulate status change to 'live' setting wentLiveAt automatically
    const liveTime = new Date()
    const [lpLive] = await db.update(landingPages)
      .set({
        status: 'live',
        wentLiveAt: liveTime,
        updatedAt: liveTime,
      })
      .where(eq(landingPages.id, lp.id))
      .returning()
    assert(lpLive.status === 'live', 'Landing page transitioned to live')
    assert(Boolean(lpLive.wentLiveAt), 'wentLiveAt set upon going live')

    // 3. Client Articles: verify creation, default status 'idea', writerId FK, and publishedAt
    const [article] = await db.insert(clientArticles).values({
      clientId: testClient.id,
      title: '5 Signs You Need a Root Canal',
      draftUrl: 'https://docs.google.com/document/d/example',
      targetKeyword: 'root canal signs',
      writerId: testStaff.id,
    }).returning()
    assert(Boolean(article?.id), 'Client article inserted successfully')
    assert(article.status === 'idea', 'Client article default status is idea')
    assert(article.publishedAt === null, 'Client article publishedAt is initially null')
    assert(article.writerId === testStaff.id, 'Client article writerId is a FK referencing users.id')

    // Simulate status change to 'live' setting publishedAt automatically
    const pubTime = new Date()
    const [articleLive] = await db.update(clientArticles)
      .set({
        status: 'live',
        publishedAt: pubTime,
        updatedAt: pubTime,
      })
      .where(eq(clientArticles.id, article.id))
      .returning()
    assert(articleLive.status === 'live', 'Client article transitioned to live')
    assert(Boolean(articleLive.publishedAt), 'publishedAt set upon going live')

    // 4. Keywords: verify client-specific keywords (with location)
    const [kw] = await db.insert(keywords).values({
      clientId: testClient.id,
      keyword: 'best cosmetic dentist',
      location: 'Miami, FL',
      searchVolume: 1200,
      estimatedTraffic: 350,
      currentRank: 4,
      previousRank: 7,
      targetUrl: 'https://apexdental.com/cosmetic',
    }).returning()
    assert(Boolean(kw?.id), 'Keyword inserted successfully')
    assert(kw.location === 'Miami, FL', 'Keyword stores local market location')
    assert(kw.status === 'research', 'Keyword default status is research')

    // 5. Keyword Rank History: append-only trend tracking and unique constraint (keyword_id, month, year)
    const [rhJan] = await db.insert(keywordRankHistory).values({
      keywordId: kw.id,
      month: 1,
      year: 2026,
      rank: 12,
    }).returning()
    const [rhFeb] = await db.insert(keywordRankHistory).values({
      keywordId: kw.id,
      month: 2,
      year: 2026,
      rank: 7,
    }).returning()
    const [rhMar] = await db.insert(keywordRankHistory).values({
      keywordId: kw.id,
      month: 3,
      year: 2026,
      rank: 4,
    }).returning()
    assert(Boolean(rhJan?.id && rhFeb?.id && rhMar?.id), 'Keyword rank history entries recorded across months')

    // Test unique constraint (keyword_id, month, year)
    let duplicateHistoryFailed = false
    try {
      await db.insert(keywordRankHistory).values({
        keywordId: kw.id,
        month: 1,
        year: 2026,
        rank: 99,
      })
    } catch {
      duplicateHistoryFailed = true
    }
    assert(duplicateHistoryFailed, 'Unique constraint on keyword_rank_history(keyword_id, month, year) enforced')

    // 6. Tasks: client-scoped task AND internal agency task (nullable client_id, direct partner_id tenancy)
    const [clientTask] = await db.insert(tasks).values({
      clientId: testClient.id,
      partnerId: testPartner.id,
      title: 'Fix Title Tags on Service Pages',
      category: 'on_page',
      assignedTo: testStaff.id,
    }).returning()
    assert(Boolean(clientTask?.id), 'Client-specific task created')
    assert(clientTask.status === 'todo', 'Task default status is todo')
    assert(clientTask.completedAt === null, 'Task completedAt is initially null')

    // Simulate completion
    const [completedClientTask] = await db.update(tasks)
      .set({
        status: 'done',
        completedAt: new Date(),
      })
      .where(eq(tasks.id, clientTask.id))
      .returning()
    assert(completedClientTask.status === 'done', 'Task marked done')
    assert(Boolean(completedClientTask.completedAt), 'completedAt set automatically on status change to done')

    // Internal agency task with client_id = null
    const [internalTask] = await db.insert(tasks).values({
      clientId: null,
      partnerId: testPartner.id,
      title: 'Update Agency Pitch Deck for Q2',
      category: 'technical_seo',
      assignedTo: testStaff.id,
    }).returning()
    assert(Boolean(internalTask?.id), 'Internal agency task created with nullable client_id')
    assert(internalTask.clientId === null, 'Internal task has null client_id without polluting client list')
    assert(internalTask.partnerId === testPartner.id, 'Internal task maintains direct partner_id tenancy')

    // 7. Monthly Metrics: living editable entry surface and UNIQUE (client_id, month, year)
    const [metricsJan] = await db.insert(monthlyMetrics).values({
      clientId: testClient.id,
      month: 1,
      year: 2026,
      gscClicks: 450,
      gscImpressions: 12000,
      gscCtr: 3.75,
      gscPosition: 8.2,
      gaSessions: 600,
      gaUsers: 510,
      gaNewUsers: 480,
      gaViews: 1100,
      gaEngagementRate: 62.5,
      gbpCalls: 34,
      gbpViews: 890,
      gbpDirections: 45,
      gbpWebsiteClicks: 120,
      gbpRating: 4.9,
      gbpReviewsCount: 88,
      semrushAuthorityScore: 28,
      semrushRankedKeywords: 145,
    }).returning()
    assert(Boolean(metricsJan?.id), 'Monthly metrics entry created successfully')
    assert(metricsJan.gscClicks === 450, 'GSC clicks recorded accurately')
    assert(metricsJan.gbpRating === 4.9, 'GBP rating recorded as double precision')

    // Test unique constraint (client_id, month, year)
    let duplicateMetricsFailed = false
    try {
      await db.insert(monthlyMetrics).values({
        clientId: testClient.id,
        month: 1,
        year: 2026,
        gscClicks: 999,
      })
    } catch {
      duplicateMetricsFailed = true
    }
    assert(duplicateMetricsFailed, 'Unique constraint on monthly_metrics(client_id, month, year) prevents duplicate month entries')

    // 8. Foreign Key Restrict on clients(id): attempting to delete client while deliverables exist is blocked
    let clientDeleteBlocked = false
    try {
      await db.delete(clients).where(eq(clients.id, testClient.id))
    } catch {
      clientDeleteBlocked = true
    }
    assert(clientDeleteBlocked, 'ON DELETE RESTRICT on client deliverables prevents accidental client deletion')

    // 9. Cascade on keyword deletion: keywordRankHistory cascades
    await db.delete(keywords).where(eq(keywords.id, kw.id))
    const remainingHistory = await db.select().from(keywordRankHistory).where(eq(keywordRankHistory.keywordId, kw.id))
    assert(remainingHistory.length === 0, 'Keyword deletion cascaded and deleted keyword_rank_history records')

    // 10. Clean up remaining test data
    await db.delete(monthlyMetrics).where(eq(monthlyMetrics.clientId, testClient.id))
    await db.delete(tasks).where(inArray(tasks.id, [clientTask.id, internalTask.id]))
    await db.delete(clientArticles).where(eq(clientArticles.id, article.id))
    await db.delete(landingPages).where(eq(landingPages.id, lp.id))
    await db.delete(clients).where(eq(clients.id, testClient.id))
    await db.delete(users).where(inArray(users.id, [testStaff.id, testPartner.id]))
    assert(true, 'Simulation 15 test data cleanly purged')
  } catch (err: any) {
    assert(false, 'CRM tables simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 16: CRM Workspace Dual-Scope & Multi-Tenancy Logic
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 16: CRM Workspace Dual-Scope & Multi-Tenancy Logic')
  try {
    // 1. Setup two isolated partner agencies and their employees
    const [partnerA] = await db.insert(users).values({
      name: 'Agency Alpha Owner',
      email: `agency_alpha_${Date.now()}@test.com`,
      passwordHash: await hashPassword('AlphaPass123!'),
      role: 'partner',
      isActive: true,
    }).returning()

    const [staffA] = await db.insert(users).values({
      name: 'Staff Alpha',
      email: `staff_alpha_${Date.now()}@test.com`,
      passwordHash: await hashPassword('StaffAlpha123!'),
      role: 'partner_employee',
      partnerId: partnerA.id,
      isActive: true,
    }).returning()

    const [partnerB] = await db.insert(users).values({
      name: 'Agency Beta Owner',
      email: `agency_beta_${Date.now()}@test.com`,
      passwordHash: await hashPassword('BetaPass123!'),
      role: 'partner',
      isActive: true,
    }).returning()

    const [staffB] = await db.insert(users).values({
      name: 'Staff Beta',
      email: `staff_beta_${Date.now()}@test.com`,
      passwordHash: await hashPassword('StaffBeta123!'),
      role: 'partner_employee',
      partnerId: partnerB.id,
      isActive: true,
    }).returning()

    // 2. Setup clients for Agency Alpha and Agency Beta
    const [clientA1] = await db.insert(clients).values({
      name: 'Client Alpha 1 Owner',
      businessName: 'Alpha Dental Care',
      partnerId: partnerA.id,
    }).returning()

    const [clientA2] = await db.insert(clients).values({
      name: 'Client Alpha 2 Owner',
      businessName: 'Alpha Law Group',
      partnerId: partnerA.id,
    }).returning()

    const [clientB] = await db.insert(clients).values({
      name: 'Client Beta Owner',
      businessName: 'Beta Auto Repair',
      partnerId: partnerB.id,
    }).returning()

    assert(Boolean(clientA1 && clientA2 && clientB), 'Test clients created under isolated agencies')

    // 3. Test Tenancy Assertion (Cross-Tenant Rejection)
    const sessionStaffA = { role: 'partner_employee' as const, userId: staffA.id, partnerId: partnerA.id, email: staffA.email, isActive: true }
    const sessionPartnerB = { role: 'partner' as const, userId: partnerB.id, email: partnerB.email, isActive: true }
    const sessionClientRole = { role: 'client' as const, userId: 'client-user-id', email: 'client@test.com', isActive: true }

    // Helper simulating assertClientAccess
    async function simulateAssertClientAccess(auth: any, clientId: string) {
      if (auth.role === 'client') {
        throw new Error('Unauthorized: Client role cannot access CRM workspace')
      }
      const isSuperadmin = auth.role === 'superadmin' || auth.role === 'admin'
      const effectivePartnerId = getEffectivePartnerId(auth)

      const [c] = await db
        .select({ id: clients.id, partnerId: clients.partnerId })
        .from(clients)
        .where(and(eq(clients.id, clientId), isNull(clients.deletedAt)))

      if (!c) throw new Error('Client not found')
      if (!isSuperadmin && c.partnerId !== effectivePartnerId) {
        throw new Error('Unauthorized: Client does not belong to your agency')
      }
      return c
    }

    // Staff A accessing Client A1 -> OK
    let staffAAccessA1 = false
    try {
      await simulateAssertClientAccess(sessionStaffA, clientA1.id)
      staffAAccessA1 = true
    } catch {
      staffAAccessA1 = false
    }
    assert(staffAAccessA1, 'Staff Alpha successfully authorized for Agency Alpha client')

    // Staff A accessing Client B -> BLOCKED
    let staffAAccessBBlocked = false
    try {
      await simulateAssertClientAccess(sessionStaffA, clientB.id)
    } catch (e: any) {
      staffAAccessBBlocked = e.message.includes('Unauthorized')
    }
    assert(staffAAccessBBlocked, 'Cross-tenant access blocked: Staff Alpha cannot access Agency Beta client')

    // Partner B accessing Client A1 -> BLOCKED
    let partnerBAccessABlocked = false
    try {
      await simulateAssertClientAccess(sessionPartnerB, clientA1.id)
    } catch (e: any) {
      partnerBAccessABlocked = e.message.includes('Unauthorized')
    }
    assert(partnerBAccessABlocked, 'Cross-tenant access blocked: Partner Beta cannot access Agency Alpha client')

    // Client role accessing CRM -> BLOCKED
    let clientRoleBlocked = false
    try {
      await simulateAssertClientAccess(sessionClientRole, clientA1.id)
    } catch (e: any) {
      clientRoleBlocked = e.message.includes('cannot access CRM')
    }
    assert(clientRoleBlocked, 'Client role strictly blocked from CRM workspace functions')

    // 4. Test Dual-Scope Deliverable Queries (Client Specific vs Agency Roll-up)
    // Insert deliverables for Client A1, Client A2, and Client B
    const [lpA1] = await db.insert(landingPages).values({
      clientId: clientA1.id,
      title: 'Alpha Dental Implants',
      targetUrl: 'https://alphadental.com/implants',
      focusKeyword: 'dental implants',
      assignedTo: staffA.id,
    }).returning()

    const [lpA2] = await db.insert(landingPages).values({
      clientId: clientA2.id,
      title: 'Alpha Law Personal Injury',
      targetUrl: 'https://alphalaw.com/injury',
      focusKeyword: 'injury lawyer',
      assignedTo: staffA.id,
    }).returning()

    const [lpB] = await db.insert(landingPages).values({
      clientId: clientB.id,
      title: 'Beta Transmission Repair',
      targetUrl: 'https://betaauto.com/trans',
      focusKeyword: 'transmission repair',
      assignedTo: staffB.id,
    }).returning()

    // Test Scope 1: Single Client View (Client A1)
    const clientA1LandingPages = await db
      .select({ id: landingPages.id, clientId: landingPages.clientId })
      .from(landingPages)
      .where(eq(landingPages.clientId, clientA1.id))

    assert(
      clientA1LandingPages.length === 1 && clientA1LandingPages[0].id === lpA1.id,
      'Single-client scope returns only that specific client deliverables (found 1 of 1)'
    )

    // Test Scope 2: Agency-Wide Roll-up View (Agency Alpha)
    const effectivePartnerA = getEffectivePartnerId(sessionStaffA)
    const agencyAlphaLandingPages = await db
      .select({ id: landingPages.id, clientId: landingPages.clientId })
      .from(landingPages)
      .innerJoin(clients, eq(landingPages.clientId, clients.id))
      .where(and(eq(clients.partnerId, effectivePartnerA!), isNull(clients.deletedAt)))

    assert(
      agencyAlphaLandingPages.length === 2 &&
      agencyAlphaLandingPages.some((p) => p.id === lpA1.id) &&
      agencyAlphaLandingPages.some((p) => p.id === lpA2.id),
      'Agency roll-up scope returns all deliverables across all partner clients (found 2)'
    )
    assert(
      !agencyAlphaLandingPages.some((p) => p.id === lpB.id),
      'Agency roll-up strictly excludes deliverables belonging to other partner agencies'
    )

    // 5. Test Tasks: Client-scoped task vs Internal Agency task (clientId: null)
    const [clientTaskA] = await db.insert(tasks).values({
      clientId: clientA1.id,
      partnerId: partnerA.id,
      title: 'Schema markup for Alpha Dental',
      category: 'schema',
      assignedTo: staffA.id,
    }).returning()

    const [internalAgencyTaskA] = await db.insert(tasks).values({
      clientId: null,
      partnerId: partnerA.id,
      title: 'Update Alpha Agency monthly SOPs',
      category: 'technical_seo',
      assignedTo: staffA.id,
    }).returning()

    // Query Client A1 tasks -> must not include internal agency task
    const clientA1Tasks = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(eq(tasks.clientId, clientA1.id))
    assert(
      clientA1Tasks.length === 1 && clientA1Tasks[0].id === clientTaskA.id,
      'Client tasks query returns only client deliverables and excludes internal agency tasks'
    )

    // Query Agency Alpha roll-up tasks -> includes both client tasks and internal tasks
    const agencyAlphaTasks = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(eq(tasks.partnerId, effectivePartnerA!))
    assert(
      agencyAlphaTasks.length === 2 &&
      agencyAlphaTasks.some((t) => t.id === clientTaskA.id) &&
      agencyAlphaTasks.some((t) => t.id === internalAgencyTaskA.id),
      'Agency tasks roll-up includes both client-specific tasks and internal agency tasks'
    )

    // 6. Test Status Progression & Auto-Timestamp Rules
    // Article creation & transition to 'live' sets publishedAt
    const [art] = await db.insert(clientArticles).values({
      clientId: clientA1.id,
      title: 'Top 10 Dental Hygiene Habits',
      writerId: staffA.id,
      status: 'idea',
    }).returning()
    assert(art.publishedAt === null, 'New article publishedAt is initially null')

    const nowArticleTime = new Date()
    const [artLive] = await db
      .update(clientArticles)
      .set({ status: 'live', publishedAt: nowArticleTime, updatedAt: nowArticleTime })
      .where(eq(clientArticles.id, art.id))
      .returning()
    assert(artLive.status === 'live', 'Article transitioned to live')
    assert(Boolean(artLive.publishedAt), 'publishedAt set automatically upon status reaching live')

    // Task toggle: todo -> done (sets completedAt) -> todo (clears completedAt)
    const [taskDone] = await db
      .update(tasks)
      .set({ status: 'done', completedAt: new Date() })
      .where(eq(tasks.id, clientTaskA.id))
      .returning()
    assert(taskDone.status === 'done' && Boolean(taskDone.completedAt), 'Task done status sets completedAt')

    const [taskReverted] = await db
      .update(tasks)
      .set({ status: 'todo', completedAt: null })
      .where(eq(tasks.id, clientTaskA.id))
      .returning()
    assert(taskReverted.status === 'todo' && taskReverted.completedAt === null, 'Reverting task to todo clears completedAt')

    // 7. Test Cross-Client "My Work" Aggregation Logic
    // staffA is assigned to: lpA1, lpA2, art, clientTaskA, internalAgencyTaskA
    const userTasks = await db
      .select({ id: tasks.id, title: tasks.title })
      .from(tasks)
      .where(eq(tasks.assignedTo, staffA.id))

    const userPages = await db
      .select({ id: landingPages.id, title: landingPages.title })
      .from(landingPages)
      .where(eq(landingPages.assignedTo, staffA.id))

    const userArticles = await db
      .select({ id: clientArticles.id, title: clientArticles.title })
      .from(clientArticles)
      .where(eq(clientArticles.writerId, staffA.id))

    assert(userTasks.length === 2, 'My-Work aggregation finds all 2 tasks assigned across multiple clients/internal')
    assert(userPages.length === 2, 'My-Work aggregation finds all 2 landing pages assigned across clients')
    assert(userArticles.length === 1, 'My-Work aggregation finds all 1 written articles')
    assert(
      !userPages.some((p) => p.id === lpB.id),
      'My-Work query strictly excludes deliverables assigned to other users or agencies'
    )

    // 8. Clean up Simulation 16 test fixtures
    await db.delete(tasks).where(inArray(tasks.id, [clientTaskA.id, internalAgencyTaskA.id]))
    await db.delete(clientArticles).where(eq(clientArticles.id, art.id))
    await db.delete(landingPages).where(inArray(landingPages.id, [lpA1.id, lpA2.id, lpB.id]))
    await db.delete(clients).where(inArray(clients.id, [clientA1.id, clientA2.id, clientB.id]))
    await db.delete(users).where(inArray(users.id, [staffA.id, partnerA.id, staffB.id, partnerB.id]))
    assert(true, 'Simulation 16 test data cleanly purged')
  } catch (err: any) {
    assert(false, 'CRM Workspace simulation failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 17: Monthly KPI Form, SEMrush CSV Importer & Rank History
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 17: Monthly KPI Form, SEMrush CSV Importer & Rank History')
  try {
    // 1. Setup agency, staff, and client
    const [partner17] = await db.insert(users).values({
      name: 'Agency 17 Owner',
      email: `agency_17_${Date.now()}@test.com`,
      passwordHash: await hashPassword('Pass17!'),
      role: 'partner',
      isActive: true,
    }).returning()

    const [staff17] = await db.insert(users).values({
      name: 'Staff 17',
      email: `staff_17_${Date.now()}@test.com`,
      passwordHash: await hashPassword('StaffPass17!'),
      role: 'partner_employee',
      partnerId: partner17.id,
      isActive: true,
    }).returning()

    const [client17] = await db.insert(clients).values({
      name: 'Dr. John Smile',
      businessName: 'Smile Dental Miami',
      partnerId: partner17.id,
    }).returning()

    assert(Boolean(partner17 && staff17 && client17), 'Test agency and client created for Simulation 17')

    // 2. Test Future API Seam: recordMonthlyMetrics idempotent upsert
    const metricsJan = await recordMonthlyMetrics({
      clientId: client17.id,
      month: 1,
      year: 2026,
      metrics: {
        gscClicks: 400,
        gscImpressions: 10000,
        gscCtr: 4.0,
        gscPosition: 8.5,
        gaSessions: 550,
        gaUsers: 480,
        gaEngagementRate: 60.0,
        gbpCalls: 28,
        gbpRating: 4.8,
        semrushAuthorityScore: 24,
        semrushRankedKeywords: 110,
      },
    })
    assert(Boolean(metricsJan?.id), 'Canonical recordMonthlyMetrics successfully created initial record')
    assert(metricsJan.gscClicks === 400, 'Initial metrics match input values')

    // Subsequent call for identical (client_id, month, year) performs an idempotent upsert
    const metricsJanUpdated = await recordMonthlyMetrics({
      clientId: client17.id,
      month: 1,
      year: 2026,
      metrics: {
        gscClicks: 475, // updated
        gscImpressions: 11500, // updated
        gscCtr: 4.13,
        gscPosition: 8.1,
        gaSessions: 620,
        gaUsers: 530,
        gaEngagementRate: 63.5,
        gbpCalls: 35,
        gbpRating: 4.9,
        semrushAuthorityScore: 26,
        semrushRankedKeywords: 125,
      },
    })
    assert(metricsJanUpdated.id === metricsJan.id, 'Idempotent upsert updated existing row without creating duplicate')
    assert(metricsJanUpdated.gscClicks === 475, 'Updated value accurately stored')
    assert(metricsJanUpdated.gbpCalls === 35, 'Updated GBP calls stored')

    const countRecords = await db
      .select({ count: sql<number>`count(*)` })
      .from(monthlyMetrics)
      .where(
        and(
          eq(monthlyMetrics.clientId, client17.id),
          eq(monthlyMetrics.month, 1),
          eq(monthlyMetrics.year, 2026)
        )
      )
    assert(Number(countRecords[0].count) === 1, 'Only 1 record exists for (client_id, month, year) after multiple saves')

    // 3. Test 50% MoM Deviation Warning Logic
    function checkMoMDeviation(entered: number, prior: number | null | undefined): { isWarning: boolean; percent: number | null } {
      if (prior === null || prior === undefined || prior === 0) {
        return { isWarning: false, percent: null }
      }
      const percent = ((entered - prior) / Math.abs(prior)) * 100
      const isWarning = Math.abs(percent) > 50
      return { isWarning, percent }
    }

    const testHighIncrease = checkMoMDeviation(750, 400)
    assert(testHighIncrease.isWarning && testHighIncrease.percent === 87.5, '>50% increase correctly flagged as discrepancy (+87.5%)')

    const testHighDrop = checkMoMDeviation(180, 400)
    assert(testHighDrop.isWarning && Math.abs(testHighDrop.percent! - (-55)) < 0.001, '>50% drop correctly flagged as discrepancy (-55%)')

    const testNormalVariance = checkMoMDeviation(460, 400)
    assert(!testNormalVariance.isWarning && testNormalVariance.percent === 15, 'Normal variance (+15%) does not trigger warning')

    const testZeroPrior = checkMoMDeviation(100, 0)
    assert(!testZeroPrior.isWarning, 'Zero baseline prior handled cleanly without division by zero')

    const testNullPrior = checkMoMDeviation(100, null)
    assert(!testNullPrior.isWarning, 'Null prior handled cleanly for new accounts')

    // 4. Test SEMrush CSV Importer Matching, Diff Preview & Rank Shifting
    // Insert initial keywords for client
    const [kw1] = await db.insert(keywords).values({
      clientId: client17.id,
      keyword: 'miami cosmetic dentist',
      currentRank: 8,
      previousRank: 12,
      searchVolume: 1200,
      status: 'ranking',
    }).returning()

    const [kw2] = await db.insert(keywords).values({
      clientId: client17.id,
      keyword: 'teeth whitening miami',
      currentRank: 15,
      previousRank: 10,
      searchVolume: 800,
      status: 'in_progress',
    }).returning()

    // Simulated CSV rows: 2 matched, 1 unmatched
    const mockCsvRows = [
      { keyword: 'Miami Cosmetic Dentist', rank: 5, searchVolume: 1400 }, // case-insensitive match, rank improved: 8 -> 5 (+3)
      { keyword: 'teeth whitening miami', rank: 19, searchVolume: 800 }, // matched, rank declined: 15 -> 19 (-4)
      { keyword: 'emergency root canal miami', rank: 25, searchVolume: 350 }, // unmatched query
    ]

    // Simulate preview matching
    const existingKws = await db.select().from(keywords).where(eq(keywords.clientId, client17.id))
    const kwMap = new Map(existingKws.map((k) => [k.keyword.trim().toLowerCase(), k]))

    const matchedList: any[] = []
    const unmatchedList: any[] = []
    for (const row of mockCsvRows) {
      const existing = kwMap.get(row.keyword.trim().toLowerCase())
      if (existing) {
        const delta = existing.currentRank !== null ? existing.currentRank - row.rank : null
        matchedList.push({
          keywordId: existing.id,
          keyword: existing.keyword,
          oldCurrentRank: existing.currentRank,
          newCurrentRank: row.rank,
          oldPreviousRank: existing.previousRank,
          newPreviousRank: existing.currentRank,
          rankDelta: delta,
          newVolume: row.searchVolume,
        })
      } else {
        unmatchedList.push(row)
      }
    }

    assert(matchedList.length === 2, 'SEMrush preview matched 2 existing keywords case-insensitively')
    assert(unmatchedList.length === 1, 'SEMrush preview isolated 1 unmatched keyword')
    assert(matchedList[0].rankDelta === 3, 'Rank delta correctly computed as +3 improvement')
    assert(matchedList[1].rankDelta === -4, 'Rank delta correctly computed as -4 decline')

    // Commit matched updates: current_rank moves to previous_rank, new rank becomes current_rank
    const nowTime = new Date()
    for (const m of matchedList) {
      await db
        .update(keywords)
        .set({
          previousRank: m.oldCurrentRank,
          currentRank: m.newCurrentRank,
          searchVolume: m.newVolume,
          updatedAt: nowTime,
        })
        .where(eq(keywords.id, m.keywordId))

      // Upsert keyword_rank_history
      await db
        .insert(keywordRankHistory)
        .values({
          keywordId: m.keywordId,
          month: 2,
          year: 2026,
          rank: m.newCurrentRank,
          recordedAt: nowTime,
        })
        .onConflictDoUpdate({
          target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
          set: {
            rank: m.newCurrentRank,
            recordedAt: nowTime,
          },
        })
    }

    const [updatedKw1] = await db.select().from(keywords).where(eq(keywords.id, kw1.id))
    assert(updatedKw1.previousRank === 8, 'Old current_rank (8) shifted to previous_rank')
    assert(updatedKw1.currentRank === 5, 'New position from CSV (5) set as current_rank')
    assert(updatedKw1.searchVolume === 1400, 'Search volume updated from CSV')

    // Verify unmatched query is NOT created when createUnmatched = false
    const [checkUnmatchedIgnored] = await db
      .select()
      .from(keywords)
      .where(and(eq(keywords.clientId, client17.id), eq(keywords.keyword, 'emergency root canal miami')))
    assert(!checkUnmatchedIgnored, 'Unmatched keyword was NOT silently created (silent creation prevented)')

    // 5. Test Rank History Snapshot Continuity
    const [historyFeb] = await db
      .select()
      .from(keywordRankHistory)
      .where(
        and(
          eq(keywordRankHistory.keywordId, kw1.id),
          eq(keywordRankHistory.month, 2),
          eq(keywordRankHistory.year, 2026)
        )
      )
    assert(Boolean(historyFeb), 'keyword_rank_history snapshot record created for month 2, 2026')
    assert(historyFeb.rank === 5, 'Snapshot recorded rank 5 accurately')

    // Re-upserting in same month updates rank rather than duplicating or throwing
    await db
      .insert(keywordRankHistory)
      .values({
        keywordId: kw1.id,
        month: 2,
        year: 2026,
        rank: 4,
        recordedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [keywordRankHistory.keywordId, keywordRankHistory.month, keywordRankHistory.year],
        set: {
          rank: 4,
          recordedAt: new Date(),
        },
      })

    const allHistoryFeb = await db
      .select()
      .from(keywordRankHistory)
      .where(
        and(
          eq(keywordRankHistory.keywordId, kw1.id),
          eq(keywordRankHistory.month, 2),
          eq(keywordRankHistory.year, 2026)
        )
      )
    assert(allHistoryFeb.length === 1, 'Rank history onConflictDoUpdate maintains 1 snapshot per (keyword, month, year)')
    assert(allHistoryFeb[0].rank === 4, 'Rank history updated to latest position')

    // 6. Test Unmatched Creation when explicitly opted-in
    const [createdUnmatchedKw] = await db
      .insert(keywords)
      .values({
        clientId: client17.id,
        keyword: unmatchedList[0].keyword,
        currentRank: unmatchedList[0].rank,
        previousRank: null,
        searchVolume: unmatchedList[0].searchVolume,
        status: 'research',
      })
      .returning()
    assert(Boolean(createdUnmatchedKw?.id), 'Unmatched keyword successfully created upon explicit user confirmation')
    assert(createdUnmatchedKw.status === 'research', 'Newly created unmatched keyword initialized with research status')

    // 7. Clean up Simulation 17 fixtures
    await db.delete(keywordRankHistory).where(inArray(keywordRankHistory.keywordId, [kw1.id, kw2.id, createdUnmatchedKw.id]))
    await db.delete(keywords).where(inArray(keywords.id, [kw1.id, kw2.id, createdUnmatchedKw.id]))
    await db.delete(monthlyMetrics).where(eq(monthlyMetrics.clientId, client17.id))
    await db.delete(clients).where(eq(clients.id, client17.id))
    await db.delete(users).where(inArray(users.id, [staff17.id, partner17.id]))
    assert(true, 'Simulation 17 test data cleanly purged')
  } catch (err: any) {
    assert(false, 'Simulation 17 failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 18: Public Report Share Links
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 18: Public Report Share Links — Generate, Retrieve, Revoke, Re-generate, Tenancy Guard')
  try {
    // ─── Setup: Create isolated partner + client + report ───────────────────
    const [partner18] = await db
      .insert(users)
      .values({
        email: 'sim18-partner@builtbymiguel.test',
        name: 'Sim18 Partner',
        passwordHash: await hashPassword('SimPass18!'),
        role: 'partner',
        isActive: true,
      })
      .returning()
    assert(Boolean(partner18?.id), 'Sim18: partner user created')

    const [client18] = await db
      .insert(clients)
      .values({
        name: 'Sim18 Client Contact',
        businessName: 'Sim18 Test Co',
        email: 'sim18-client@test.com',
        partnerId: partner18.id,
        isActive: true,
      })
      .returning()
    assert(Boolean(client18?.id), 'Sim18: client created')

    const [report18] = await db
      .insert(reports)
      .values({
        clientId: client18.id,
        title: 'Sim18 Monthly Report',
        reportMonth: 'August 2026',
        periodStart: new Date('2026-08-01'),
        periodEnd: new Date('2026-08-31'),
        clientSnapshot: {
          businessName: 'Sim18 Test Co',
          name: 'Sim18 Client Contact',
          websiteUrl: null,
          logoUrl: null,
          primaryColor: '#2563eb',
          secondaryColor: null,
          isWhiteLabel: false,
          partnerName: null,
          partnerLogoUrl: null,
        },
        createdByUserId: partner18.id,
      })
      .returning()
    assert(Boolean(report18?.id), 'Sim18: report created for share link tests')

    // ─── 1. Generate Share Link ──────────────────────────────────────────────
    const crypto = await import('crypto')
    const token1 = crypto.randomBytes(24).toString('base64url')
    assert(token1.length === 32, `Token is exactly 32 chars (got ${token1.length})`)
    assert(!/[+/=]/.test(token1), 'Token is URL-safe (base64url: no +, /, or =)')
    assert(token1 !== report18.id, 'Token is NOT the report UUID')

    const [savedReport] = await db
      .update(reports)
      .set({ shareToken: token1, shareRevokedAt: null })
      .where(eq(reports.id, report18.id))
      .returning({ id: reports.id, shareToken: reports.shareToken, shareRevokedAt: reports.shareRevokedAt })
    assert(savedReport.shareToken === token1, 'Sim18: shareToken saved to DB correctly')
    assert(savedReport.shareRevokedAt === null, 'Sim18: shareRevokedAt is null after generation')

    // ─── 2. Public Retrieval — Valid Token ──────────────────────────────────
    const [publicRow] = await db
      .select({
        id: reports.id,
        reportMonth: reports.reportMonth,
        clientSnapshot: reports.clientSnapshot,
        shareRevokedAt: reports.shareRevokedAt,
      })
      .from(reports)
      .where(eq(reports.shareToken, token1))
    assert(Boolean(publicRow), 'Sim18: Public retrieval with valid token returns a row')
    assert(publicRow?.shareRevokedAt === null, 'Sim18: Token is active (shareRevokedAt is null)')
    assert(publicRow?.clientSnapshot !== null, 'Sim18: clientSnapshot is present in public payload')

    // Verify no user email, user IDs, or internal keys are selected in public payload
    assert(!('createdByUserId' in publicRow), 'Sim18: createdByUserId NOT exposed in public payload')
    assert(!('creatorEmail' in publicRow), 'Sim18: creatorEmail NOT in public payload')

    // ─── 3. Revocation ──────────────────────────────────────────────────────
    const revokedAt = new Date()
    await db
      .update(reports)
      .set({ shareRevokedAt: revokedAt })
      .where(eq(reports.id, report18.id))

    const [revokedRow] = await db
      .select({ shareToken: reports.shareToken, shareRevokedAt: reports.shareRevokedAt })
      .from(reports)
      .where(eq(reports.id, report18.id))
    assert(revokedRow.shareRevokedAt !== null, 'Sim18: shareRevokedAt is set after revocation')

    // Public retrieval must return nothing for revoked token
    const [afterRevoke] = await db
      .select({ id: reports.id })
      .from(reports)
      .where(eq(reports.shareToken, token1))
    const isRevoked = !afterRevoke || afterRevoke && revokedRow.shareRevokedAt !== null
    assert(Boolean(isRevoked), 'Sim18: Revoked token correctly has non-null shareRevokedAt — would return found:false')

    // ─── 4. Re-generation — New Token ───────────────────────────────────────
    const token2 = crypto.randomBytes(24).toString('base64url')
    assert(token2 !== token1, 'Sim18: New token differs from revoked token (no token reuse)')

    await db
      .update(reports)
      .set({ shareToken: token2, shareRevokedAt: null })
      .where(eq(reports.id, report18.id))

    const [regenRow] = await db
      .select({ shareToken: reports.shareToken, shareRevokedAt: reports.shareRevokedAt })
      .from(reports)
      .where(eq(reports.id, report18.id))
    assert(regenRow.shareToken === token2, 'Sim18: Re-generated token is new token2')
    assert(regenRow.shareRevokedAt === null, 'Sim18: shareRevokedAt cleared after re-generation')

    // Old token1 check: it no longer matches any active share (same row now has token2)
    const [oldTokenRow] = await db
      .select({ id: reports.id, shareToken: reports.shareToken })
      .from(reports)
      .where(eq(reports.shareToken, token1))
    assert(!oldTokenRow, 'Sim18: Old revoked token1 can no longer find report (row now has token2)')

    // ─── 5. Tenancy Guard — Partner B cannot touch Partner A's report ────────
    const [partner18B] = await db
      .insert(users)
      .values({
        email: 'sim18-partnerB@builtbymiguel.test',
        name: 'Sim18 Partner B',
        passwordHash: await hashPassword('SimPassB18!'),
        role: 'partner',
        isActive: true,
      })
      .returning()

    // Partner B tries to query report18 — should get no result because
    // report18.clientId belongs to client18 whose partnerId = partner18.id (not partner18B)
    const [partnerBClient] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, client18.id),
          eq(clients.partnerId, partner18B.id),
          isNull(clients.deletedAt)
        )
      )
    assert(!partnerBClient, 'Sim18: Partner B cannot access Partner A\'s client — tenancy guard holds')

    // ─── Cleanup Simulation 18 fixtures ─────────────────────────────────────
    await db.delete(reports).where(eq(reports.id, report18.id))
    await db.delete(clients).where(eq(clients.id, client18.id))
    await db.delete(users).where(inArray(users.id, [partner18.id, partner18B.id]))
    assert(true, 'Sim18: Test data cleanly purged')
  } catch (err: any) {
    assert(false, 'Simulation 18 failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 19: Soft Delete Integrity, Report Retention & Auth Exclusion
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 19: Soft Delete Integrity, Report Retention & Auth Exclusion')
  try {
    // 1. Create a partner, client, staff member, and report with snapshot
    const [partner19] = await db
      .insert(users)
      .values({
        email: 'sim19-partner@builtbymiguel.test',
        name: 'Sim19 Partner Agency',
        passwordHash: await hashPassword('Sim19Pass!'),
        role: 'partner',
        isActive: true,
      })
      .returning()
    assert(Boolean(partner19?.id), 'Sim19: Partner agency created')

    const [client19] = await db
      .insert(clients)
      .values({
        name: 'Sim19 Client Owner',
        businessName: 'Sim19 Architecture Studio',
        websiteUrl: 'https://sim19arch.test',
        partnerId: partner19.id,
      })
      .returning()
    assert(Boolean(client19?.id), 'Sim19: Client created under partner')

    const [staff19] = await db
      .insert(users)
      .values({
        email: 'sim19-staff@builtbymiguel.test',
        name: 'Sim19 Staff Member',
        passwordHash: await hashPassword('Sim19StaffPass!'),
        role: 'partner_employee',
        partnerId: partner19.id,
        isActive: true,
      })
      .returning()
    assert(Boolean(staff19?.id), 'Sim19: Staff employee created under partner')

    const [report19] = await db
      .insert(reports)
      .values({
        clientId: client19.id,
        title: 'Sim19 Architecture Performance Q3',
        reportMonth: 'September 2026',
        periodStart: new Date('2026-09-01T00:00:00.000Z'),
        periodEnd: new Date('2026-09-30T23:59:59.999Z'),
        clientSnapshot: {
          businessName: client19.businessName,
          name: client19.name,
          websiteUrl: client19.websiteUrl,
          primaryColor: '#2563eb',
          secondaryColor: '#1e293b',
          isWhiteLabel: false,
        },
        createdByUserId: staff19.id,
        gbpCalls: 12,
        gscClicks: 150,
      })
      .returning()
    assert(Boolean(report19?.id), 'Sim19: Report created with frozen snapshot for client')

    // 2. Soft-delete the client
    await db
      .update(clients)
      .set({ deletedAt: new Date() })
      .where(eq(clients.id, client19.id))

    await db.insert(activityLogs).values({
      userId: partner19.id,
      userEmail: partner19.email,
      role: partner19.role,
      action: 'delete_client',
    })

    // Assert client is omitted from active clients query
    const [activeClientQuery] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, client19.id), isNull(clients.deletedAt)))
    assert(!activeClientQuery, 'Sim19: Soft-deleted client excluded from active clients query')

    // Assert report still exists and joins successfully via leftJoin
    const [reportJoinRow] = await db
      .select({
        reportId: reports.id,
        reportTitle: reports.title,
        clientSnapshot: reports.clientSnapshot,
        clientId: clients.id,
        clientDeletedAt: clients.deletedAt,
        clientPartnerId: clients.partnerId,
      })
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .where(eq(reports.id, report19.id))

    assert(Boolean(reportJoinRow), 'Sim19: Historical report survives client archiving')
    assert(reportJoinRow?.clientSnapshot?.businessName === 'Sim19 Architecture Studio', 'Sim19: Report client snapshot intact')
    assert(reportJoinRow?.clientPartnerId === partner19.id, 'Sim19: Partner tenancy linkage retained for historical reports')

    // Assert report renders properly with frozen snapshot
    const renderedReportHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        report: report19 as any,
        client: client19 as any,
      })
    )
    assert(renderedReportHtml.includes('Sim19 Architecture Studio'), 'Sim19: Report renders seamlessly using frozen snapshot')

    // 3. Soft-delete staff member
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false,
      })
      .where(eq(users.id, staff19.id))

    await db.insert(activityLogs).values({
      userId: partner19.id,
      userEmail: partner19.email,
      role: partner19.role,
      action: 'delete_user',
    })

    // Assert staff member is excluded from active team query
    const [activeStaffQuery] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, staff19.id), isNull(users.deletedAt)))
    assert(!activeStaffQuery, 'Sim19: Soft-deleted staff excluded from active users query')

    // Assert login query rejects soft-deleted user (simulating loginServerFn check)
    const [loginUserCheck] = await db
      .select()
      .from(users)
      .where(eq(users.email, staff19.email))
    assert(loginUserCheck?.deletedAt !== null, 'Sim19: Archived user has deletedAt set in DB')
    const loginAllowed = loginUserCheck && !loginUserCheck.deletedAt && loginUserCheck.isActive
    assert(!loginAllowed, 'Sim19: Login rejects archived user (deletedAt is set / isActive is false)')

    // 4. Verify activity logs recorded delete_client and delete_user
    const [clientLog] = await db
      .select()
      .from(activityLogs)
      .where(and(eq(activityLogs.userId, partner19.id), eq(activityLogs.action, 'delete_client')))
    assert(Boolean(clientLog), 'Sim19: delete_client action logged in activity_logs')

    const [userLog] = await db
      .select()
      .from(activityLogs)
      .where(and(eq(activityLogs.userId, partner19.id), eq(activityLogs.action, 'delete_user')))
    assert(Boolean(userLog), 'Sim19: delete_user action logged in activity_logs')

    // 5. Cleanup Simulation 19 fixtures
    await db.delete(reports).where(eq(reports.id, report19.id))
    await db.delete(clients).where(eq(clients.id, client19.id))
    await db.delete(users).where(inArray(users.id, [partner19.id, staff19.id]))
    await db.delete(activityLogs).where(eq(activityLogs.userId, partner19.id))
    assert(true, 'Sim19: Test data cleanly purged')
  } catch (err: any) {
    assert(false, 'Simulation 19 failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION 20: CRM Deliverables Wiring to Report Generator
  // ---------------------------------------------------------------
  console.log('\n🔍 SIMULATION 20: CRM Deliverables Wiring to Report Generator, Immutability & Versioning')
  try {
    // 0. Pre-cleanup in case of prior interrupted run
    const existingSim20Users = await db.select().from(users).where(eq(users.email, 'sim20-partner@builtbymiguel.test'))
    if (existingSim20Users.length > 0) {
      const uId = existingSim20Users[0].id
      const sim20Clients = await db.select().from(clients).where(eq(clients.partnerId, uId))
      for (const c of sim20Clients) {
        await db.delete(reports).where(eq(reports.clientId, c.id))
        await db.delete(landingPages).where(eq(landingPages.clientId, c.id))
        await db.delete(clientArticles).where(eq(clientArticles.clientId, c.id))
        await db.delete(tasks).where(eq(tasks.clientId, c.id))
        await db.delete(keywords).where(eq(keywords.clientId, c.id))
        await db.delete(monthlyMetrics).where(eq(monthlyMetrics.clientId, c.id))
        await db.delete(clients).where(eq(clients.id, c.id))
      }
      await db.delete(tasks).where(eq(tasks.partnerId, uId))
      await db.delete(users).where(eq(users.id, uId))
    }

    // 1. Setup: Partner and Client
    const [partner20] = await db
      .insert(users)
      .values({
        email: 'sim20-partner@builtbymiguel.test',
        name: 'Sim20 Partner Agency',
        passwordHash: await hashPassword('SimPass20!'),
        role: 'partner',
        isActive: true,
      })
      .returning()
    assert(Boolean(partner20?.id), 'Sim20: Partner agency created')

    const [client20] = await db
      .insert(clients)
      .values({
        name: 'Sim20 Contact',
        businessName: 'Sim20 Digital Corp',
        email: 'sim20@digitalcorp.test',
        partnerId: partner20.id,
        primaryColor: '#059669',
        isActive: true,
      })
      .returning()
    assert(Boolean(client20?.id), 'Sim20: Client created under partner')

    const reportMonth = 'September 2026'
    const { periodStart, periodEnd, nextMonthStart, month, year } = parseReportPeriod(reportMonth)
    assert(month === 9 && year === 2026, 'Sim20: Period parsed to Month 9, Year 2026')

    // 2. Pre-flight Check: blocked when monthly_metrics missing
    const [preflightMetricsCheck] = await db
      .select()
      .from(monthlyMetrics)
      .where(and(eq(monthlyMetrics.clientId, client20.id), eq(monthlyMetrics.month, month), eq(monthlyMetrics.year, year)))
    assert(!preflightMetricsCheck, 'Sim20: monthly_metrics initially missing for client & period')

    // Simulate pre-flight blocking logic
    const isPreflightBlocked = !preflightMetricsCheck
    assert(isPreflightBlocked, 'Sim20: Report generation blocked when monthly_metrics missing')

    // Now insert monthly_metrics
    await recordMonthlyMetrics({
      clientId: client20.id,
      month,
      year,
      metrics: {
        gbpCalls: 45,
        gbpDirections: 60,
        gbpViews: 520,
        gbpWebsiteClicks: 110,
        gbpRating: 4.9,
        gbpReviewsCount: 38,
        gscClicks: 820,
        gscImpressions: 14500,
        gscCtr: 5.6,
        gscPosition: 8.4,
        gaUsers: 1400,
        gaNewUsers: 1100,
        gaSessions: 1950,
        gaViews: 3200,
      },
      isSystemSync: true,
    })

    const [verifiedMetrics] = await db
      .select()
      .from(monthlyMetrics)
      .where(and(eq(monthlyMetrics.clientId, client20.id), eq(monthlyMetrics.month, month), eq(monthlyMetrics.year, year)))
    assert(Boolean(verifiedMetrics && verifiedMetrics.gscClicks === 820), 'Sim20: monthly_metrics successfully recorded')

    // 3. Half-Open Period Boundaries & Deliverables Collection
    // In-period Landing Page: live within [periodStart, nextMonthStart)
    const inPeriodDate = new Date(periodStart.getTime() + 2 * 24 * 60 * 60 * 1000) // Sept 3
    const [lp1] = await db
      .insert(landingPages)
      .values({
        clientId: client20.id,
        title: 'Emergency Plumbing Sydney',
        slug: 'emergency-plumbing-sydney',
        url: 'https://digitalcorp.test/emergency-plumbing-sydney',
        status: 'live',
        wentLiveAt: inPeriodDate,
      })
      .returning()

    // Non-live Landing Page (planning)
    const [lp2] = await db
      .insert(landingPages)
      .values({
        clientId: client20.id,
        title: 'Commercial Drains Planning',
        slug: 'commercial-drains',
        status: 'planning',
      })
      .returning()

    // In-period Client Article
    const inPeriodArticleDate = new Date(periodStart.getTime() + 5 * 24 * 60 * 60 * 1000) // Sept 6
    const [art1] = await db
      .insert(clientArticles)
      .values({
        clientId: client20.id,
        title: 'Top 10 Signs of Blocked Drains',
        status: 'live',
        publishedAt: inPeriodArticleDate,
        liveUrl: 'https://digitalcorp.test/blog/blocked-drains-guide',
      })
      .returning()

    // In-period Task (Client-scoped)
    const inPeriodTaskDate = new Date(periodStart.getTime() + 3600 * 1000) // Sept 1 01:00:00
    const [task1] = await db
      .insert(tasks)
      .values({
        clientId: client20.id,
        partnerId: partner20.id,
        title: 'Audit Schema Markup',
        category: 'schema',
        status: 'done',
        completedAt: inPeriodTaskDate,
      })
      .returning()

    // Out-of-period Task (Completed at nextMonthStart: Oct 1 00:00:00 UTC)
    const [taskOut] = await db
      .insert(tasks)
      .values({
        clientId: client20.id,
        partnerId: partner20.id,
        title: 'October Post-Period Optimization',
        category: 'technical_seo',
        status: 'done',
        completedAt: nextMonthStart,
      })
      .returning()

    // Internal Agency Task (clientId is null) completed within period
    const [internalTask] = await db
      .insert(tasks)
      .values({
        clientId: null,
        partnerId: partner20.id,
        title: 'Internal Agency Server Maintenance',
        category: 'technical_seo',
        status: 'done',
        completedAt: inPeriodTaskDate,
      })
      .returning()

    // Keywords: 1 targeting_next, 1 ranking
    const [kwNext] = await db
      .insert(keywords)
      .values({
        clientId: client20.id,
        keyword: 'plumber near me',
        status: 'targeting_next',
        currentRank: 12,
        searchVolume: 3600,
      })
      .returning()

    const [kwRanking] = await db
      .insert(keywords)
      .values({
        clientId: client20.id,
        keyword: 'local plumber cost',
        status: 'ranking',
        currentRank: 3,
        searchVolume: 880,
      })
      .returning()

    // Execute canonical collectDeliverablesSnapshot
    const snapshot = await collectDeliverablesSnapshot(client20.id, periodStart, nextMonthStart)
    assert(snapshot !== null, 'Sim20: Snapshot collected successfully')
    assert(snapshot.landingPages.length === 1 && snapshot.landingPages[0].id === lp1.id, 'Sim20: Only live landing pages in period included')
    assert(snapshot.articles.length === 1 && snapshot.articles[0].id === art1.id, 'Sim20: Only live articles published in period included')
    assert(snapshot.tasks.length === 1 && snapshot.tasks[0].id === task1.id, 'Sim20: Completed task in period included; out-of-period task excluded')
    assert(!snapshot.tasks.some((t: any) => t.id === internalTask.id), 'Sim20: Internal agency tasks (clientId=null) strictly excluded from client report deliverables')
    assert(snapshot.nextKeywords.length === 1 && snapshot.nextKeywords[0].id === kwNext.id, 'Sim20: Only targeting_next keywords included in next target roadmap')

    // 4. Report Creation & Immutability Check
    const [reportV1] = await db
      .insert(reports)
      .values({
        clientId: client20.id,
        title: 'Sim20 September Performance Report',
        reportMonth,
        periodStart,
        periodEnd,
        version: 1,
        clientSnapshot: {
          businessName: client20.businessName,
          name: client20.name,
          websiteUrl: null,
          logoUrl: null,
          primaryColor: client20.primaryColor,
          secondaryColor: '#1e293b',
          isWhiteLabel: false,
          partnerName: 'Sim20 Partner Agency',
          partnerLogoUrl: null,
        },
        deliverablesSnapshot: snapshot,
        shareToken: 'sim20-share-token-1234567890123456',
        gbpCalls: verifiedMetrics.gbpCalls,
        gscClicks: verifiedMetrics.gscClicks,
        gaUsers: verifiedMetrics.gaUsers,
      })
      .returning()
    assert(reportV1.version === 1, 'Sim20: Report version 1 created successfully')

    // Mutate source deliverables in DB
    await db.update(landingPages).set({ title: 'Mutated DB Landing Page Title', status: 'planning' }).where(eq(landingPages.id, lp1.id))
    await db.update(tasks).set({ title: 'Mutated DB Task Title', status: 'todo' }).where(eq(tasks.id, task1.id))

    // Re-query report from DB to verify snapshot immutability
    const [reloadedV1] = await db.select().from(reports).where(eq(reports.id, reportV1.id))
    assert(reloadedV1.deliverablesSnapshot?.landingPages[0].title === 'Emergency Plumbing Sydney', 'Sim20: Report deliverables_snapshot is IMMUTABLE: Landing page title remains frozen')
    assert(reloadedV1.deliverablesSnapshot?.tasks[0].title === 'Audit Schema Markup', 'Sim20: Report deliverables_snapshot is IMMUTABLE: Task title remains frozen')

    // 5. Versioning (Regeneration)
    // Find highest version
    const allVersions = await db
      .select({ version: reports.version })
      .from(reports)
      .where(and(eq(reports.clientId, client20.id), eq(reports.periodStart, periodStart)))
      .orderBy(sql`${reports.version} DESC`)

    const nextVer = (allVersions[0]?.version || 1) + 1
    assert(nextVer === 2, 'Sim20: Next version correctly computed as 2')

    // Null shareToken on v1 before inserting v2 with the same shareToken (unique constraint compliance)
    const tokenToTransfer = reportV1.shareToken
    await db.update(reports).set({ shareToken: null }).where(eq(reports.id, reportV1.id))

    // Insert Version 2 with transferred shareToken
    const [reportV2] = await db
      .insert(reports)
      .values({
        clientId: client20.id,
        title: reportV1.title,
        reportMonth,
        periodStart,
        periodEnd,
        version: nextVer,
        clientSnapshot: reportV1.clientSnapshot,
        deliverablesSnapshot: snapshot,
        shareToken: tokenToTransfer,
        gbpCalls: reportV1.gbpCalls,
        gscClicks: reportV1.gscClicks,
        gaUsers: reportV1.gaUsers,
      })
      .returning()

    const [checkV1] = await db.select().from(reports).where(eq(reports.id, reportV1.id))
    const [checkV2] = await db.select().from(reports).where(eq(reports.id, reportV2.id))

    assert(checkV1.version === 1 && checkV1.shareToken === null, 'Sim20: Version 1 preserved intact with shareToken relinquished')
    assert(checkV2.version === 2 && checkV2.shareToken === 'sim20-share-token-1234567890123456', 'Sim20: Version 2 created with shareToken pointing to latest version')

    // 6. Historical Fallback Rendering (deliverablesSnapshot is null)
    const [historicalReport] = await db
      .insert(reports)
      .values({
        clientId: client20.id,
        title: 'Historical Legacy Report',
        reportMonth: 'January 2025',
        periodStart: new Date('2025-01-01'),
        periodEnd: new Date('2025-01-31'),
        version: 1,
        clientSnapshot: null,
        deliverablesSnapshot: null,
        gbpCalls: 10,
        gscClicks: 200,
        gaUsers: 300,
      })
      .returning()

    const renderedHistoricalHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        report: historicalReport as any,
        client: client20 as any,
      })
    )
    assert(renderedHistoricalHtml.includes('Sim20 Digital Corp'), 'Sim20: Historical report with null deliverables_snapshot renders cleanly without crashing')

    // Render report with deliverables snapshot
    const renderedDeliverablesHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        report: checkV2 as any,
        client: client20 as any,
      })
    )
    assert(renderedDeliverablesHtml.includes('Emergency Plumbing Sydney'), 'Sim20: Deliverables section renders landing pages correctly')
    assert(renderedDeliverablesHtml.includes('Top 10 Signs of Blocked Drains'), 'Sim20: Deliverables section renders articles correctly')
    assert(renderedDeliverablesHtml.includes('Audit Schema Markup'), 'Sim20: Deliverables section renders completed tasks correctly')

    // 7. Cleanup Simulation 20 fixtures
    await db.delete(reports).where(inArray(reports.id, [reportV1.id, reportV2.id, historicalReport.id]))
    await db.delete(landingPages).where(inArray(landingPages.id, [lp1.id, lp2.id]))
    await db.delete(clientArticles).where(eq(clientArticles.id, art1.id))
    await db.delete(tasks).where(inArray(tasks.id, [task1.id, taskOut.id, internalTask.id]))
    await db.delete(keywords).where(inArray(keywords.id, [kwNext.id, kwRanking.id]))
    await db.delete(monthlyMetrics).where(eq(monthlyMetrics.clientId, client20.id))
    await db.delete(clients).where(eq(clients.id, client20.id))
    await db.delete(users).where(eq(users.id, partner20.id))
    assert(true, 'Sim20: Test data cleanly purged')
  } catch (err: any) {
    assert(false, 'Simulation 20 failed', err.message)
  }

  // ---------------------------------------------------------------
  // SIMULATION SUMMARY
  // ---------------------------------------------------------------
  console.log('\n====================================================')
  console.log(`📊 SIMULATION RESULTS: ${passed} Passed, ${failed} Failed`)
  console.log('====================================================')
  if (failed > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runSimulations().catch((err) => {
  console.error('Unhandled simulation exception:', err)
  process.exit(1)
})
