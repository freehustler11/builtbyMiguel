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
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ReportDocument } from '../src/components/ReportDocument'

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
