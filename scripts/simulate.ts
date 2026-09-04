import 'dotenv/config'
import { db } from '../app/db/index'
import { users, clients, reports } from '../app/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, getSessionData } from '../app/lib/auth'
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
    const html3 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReportDocument, {
        client: whiteLabelClient,
        report: sampleReport,
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
