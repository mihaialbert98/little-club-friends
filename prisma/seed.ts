import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

import { PrismaClient, Season, Theme } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@littleclubfriends.ro'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123'

  const existingUser = await db.user.findUnique({ where: { email: adminEmail } })
  if (!existingUser) {
    await db.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        name: 'Administrator',
      },
    })
    console.log(`✓ Admin user created: ${adminEmail}`)
  } else {
    console.log(`→ Admin user already exists: ${adminEmail}`)
  }

  // Default site settings
  const existingSettings = await db.siteSettings.findFirst()
  if (!existingSettings) {
    await db.siteSettings.create({
      data: {
        activeTheme: Theme.WINTER,
        siteName: 'Little Club Friends',
        contactEmail: 'littleskifriends@yahoo.com',
        contactPhone: '0770675375',
      },
    })
    console.log('✓ Site settings created')
  }

  // Default page content
  const contentItems = [
    { page: 'home', key: 'hero_title.ro', value: 'Aventuri pentru copii în inima munților' },
    { page: 'home', key: 'hero_title.en', value: 'Adventures for children in the heart of the mountains' },
    { page: 'home', key: 'hero_subtitle.ro', value: 'Lecții de schi, snowboard, ciclism montan și multe altele la Poiana Brașov' },
    { page: 'home', key: 'hero_subtitle.en', value: 'Skiing, snowboarding, mountain biking and more in Poiana Brașov' },
    { page: 'home', key: 'about_text.ro', value: 'Little Club Friends este locul unde copiii descoperă bucuria sportului în natură. Cu instructori pasionați și certificați, oferim o experiență sigură, distractivă și de neuitat la Poiana Brașov.' },
    { page: 'home', key: 'about_text.en', value: 'Little Club Friends is the place where children discover the joy of sport in nature. With passionate and certified instructors, we offer a safe, fun and unforgettable experience in Poiana Brașov.' },
    { page: 'about', key: 'story.ro', value: 'Povestea noastră a început cu o pasiune pentru munți și dorința de a împărtăși această iubire cu cei mici. Înființat în Poiana Brașov, Little Club Friends a crescut an de an, devenind locul de referință pentru lecții de sport în natură pentru copii.' },
    { page: 'about', key: 'story.en', value: 'Our story began with a passion for the mountains and a desire to share this love with the little ones. Founded in Poiana Brașov, Little Club Friends has grown year after year, becoming the reference place for outdoor sports lessons for children.' },
    { page: 'contact', key: 'address.ro', value: 'Poiana Brașov, Brașov, România' },
    { page: 'contact', key: 'address.en', value: 'Poiana Brașov, Brașov, Romania' },
  ]

  for (const item of contentItems) {
    await db.pageContent.upsert({
      where: { page_key: { page: item.page, key: item.key } },
      update: { value: item.value },
      create: { page: item.page, key: item.key, value: item.value },
    })
  }
  console.log(`✓ Page content seeded (${contentItems.length} items)`)

  // Seed activities
  const activities = [
    {
      slug: 'lectii-schi',
      season: Season.WINTER,
      ageMin: 4,
      ageMax: 16,
      durationMin: 60,
      priceFrom: 150,
      sortOrder: 1,
      translations: [
        { locale: 'ro', name: 'Lecții de schi', shortDesc: 'Lecții individuale și de grup pentru toate nivelurile, de la începători la avansat.', description: 'Oferim lecții de schi pentru copii de toate nivelurile la Poiana Brașov. Instructorii noștri certificați asigură o experiență sigură și distractivă, adaptată vârstei și nivelului fiecărui copil.' },
        { locale: 'en', name: 'Skiing lessons', shortDesc: 'Individual and group lessons for all levels, from beginners to advanced.', description: 'We offer skiing lessons for children of all levels in Poiana Brașov. Our certified instructors ensure a safe and fun experience, adapted to each child\'s age and level.' },
      ],
    },
    {
      slug: 'lectii-snowboard',
      season: Season.WINTER,
      ageMin: 7,
      ageMax: 16,
      durationMin: 60,
      priceFrom: 160,
      sortOrder: 2,
      translations: [
        { locale: 'ro', name: 'Lecții de snowboard', shortDesc: 'Descoperă snowboard-ul cu instructori certificați în Poiana Brașov.', description: 'Snowboard-ul este una dintre cele mai distractive activități de iarnă! Instructorii noștri certificați vor ghida copilul tău de la primii pași până la tehnici avansate.' },
        { locale: 'en', name: 'Snowboard lessons', shortDesc: 'Discover snowboarding with certified instructors in Poiana Brașov.', description: 'Snowboarding is one of the most fun winter activities! Our certified instructors will guide your child from first steps to advanced techniques.' },
      ],
    },
    {
      slug: 'ciclism-montan',
      season: Season.SUMMER,
      ageMin: 6,
      ageMax: 16,
      durationMin: 90,
      priceFrom: 100,
      sortOrder: 1,
      translations: [
        { locale: 'ro', name: 'Ciclism montan', shortDesc: 'Explorează pârtiile și potecile din Poiana Brașov pe bicicletă.', description: 'Ciclismul montan este aventura perfectă pentru copiii activi! Pe bicicletele potrivite vârstei, copiii explorează potecile din Poiana Brașov sub îndrumarea instructorilor noștri.' },
        { locale: 'en', name: 'Mountain biking', shortDesc: 'Explore the slopes and trails of Poiana Brașov on a bike.', description: 'Mountain biking is the perfect adventure for active children! On age-appropriate bikes, children explore Poiana Brașov trails under the guidance of our instructors.' },
      ],
    },
    {
      slug: 'drumetii-munte',
      season: Season.SUMMER,
      ageMin: 4,
      ageMax: 16,
      durationMin: 120,
      priceFrom: 80,
      sortOrder: 2,
      translations: [
        { locale: 'ro', name: 'Drumeții la munte', shortDesc: 'Plimbări ghidate pe traseele montane din jurul Poienii Brașov.', description: 'Drumeția este activitatea perfectă pentru întreaga familie! Ghizii noștri experimentați conduc grupuri de copii pe traseele superbe din jurul Poienii Brașov.' },
        { locale: 'en', name: 'Mountain hiking', shortDesc: 'Guided walks on mountain trails around Poiana Brașov.', description: 'Hiking is the perfect activity for the whole family! Our experienced guides lead groups of children on the beautiful trails around Poiana Brașov.' },
      ],
    },
    {
      slug: 'paddleboard',
      season: Season.SUMMER,
      ageMin: 7,
      ageMax: 16,
      durationMin: 60,
      priceFrom: 120,
      sortOrder: 3,
      translations: [
        { locale: 'ro', name: 'Paddleboard', shortDesc: 'Aventură pe apă cu stand-up paddleboard pentru copii și tineri.', description: 'Stand-up paddleboard-ul combină echilibrul, puterea și distracția pe apă! Copiii învață să stea în picioare pe plăci speciale și să vâslească, într-un mediu controlat și sigur.' },
        { locale: 'en', name: 'Paddleboard', shortDesc: 'Water adventure with stand-up paddleboard for children and teens.', description: 'Stand-up paddleboarding combines balance, strength and water fun! Children learn to stand on special boards and paddle, in a controlled and safe environment.' },
      ],
    },
  ]

  for (const act of activities) {
    const { translations, ...actData } = act
    const existing = await db.activity.findUnique({ where: { slug: act.slug } })
    if (!existing) {
      await db.activity.create({
        data: {
          ...actData,
          priceFrom: actData.priceFrom,
          translations: { create: translations },
        },
      })
      console.log(`✓ Activity seeded: ${act.slug}`)
    } else {
      console.log(`→ Activity already exists: ${act.slug}`)
    }
  }

  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
