import { Resend } from 'resend'
import type { Booking } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@littleclubfriends.ro'
const OWNER_EMAIL = 'littleskifriends@yahoo.com'

export async function sendBookingNotification(booking: Booking & { activity?: { translations: { locale: string; name: string }[] } | null }) {
  const activityName = booking.activity?.translations.find(t => t.locale === 'ro')?.name ?? 'Nespecificată'

  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `Rezervare nouă de la ${booking.parentName}`,
    html: `
      <h2>Rezervare nouă primită</h2>
      <table>
        <tr><td><strong>Nume:</strong></td><td>${booking.parentName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${booking.email}</td></tr>
        <tr><td><strong>Telefon:</strong></td><td>${booking.phone}</td></tr>
        <tr><td><strong>Nr. copii:</strong></td><td>${booking.numberOfChildren}</td></tr>
        <tr><td><strong>Vârste copii:</strong></td><td>${booking.childrenAges}</td></tr>
        <tr><td><strong>Activitate:</strong></td><td>${activityName}</td></tr>
        <tr><td><strong>Date preferate:</strong></td><td>${booking.preferredDates}</td></tr>
        <tr><td><strong>Observații:</strong></td><td>${booking.notes ?? '-'}</td></tr>
      </table>
      <p>Intră în <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings">panoul de administrare</a> pentru a gestiona această rezervare.</p>
    `,
  })
}

export async function sendBookingConfirmation(booking: Booking) {
  await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: 'Cererea ta a fost primită — Little Club Friends',
    html: `
      <h2>Bună, ${booking.parentName}!</h2>
      <p>Am primit cererea ta de rezervare și te vom contacta în cel mai scurt timp la numărul <strong>${booking.phone}</strong> sau pe email.</p>
      <h3>Detaliile cererii tale:</h3>
      <table>
        <tr><td><strong>Nr. copii:</strong></td><td>${booking.numberOfChildren}</td></tr>
        <tr><td><strong>Vârste copii:</strong></td><td>${booking.childrenAges}</td></tr>
        <tr><td><strong>Date preferate:</strong></td><td>${booking.preferredDates}</td></tr>
      </table>
      <p>Dacă ai întrebări urgente, ne poți contacta direct la:</p>
      <ul>
        <li>📞 <a href="tel:0770675375">0770 675 375</a></li>
        <li>📧 <a href="mailto:littleskifriends@yahoo.com">littleskifriends@yahoo.com</a></li>
      </ul>
      <p>Cu drag,<br/><strong>Echipa Little Club Friends</strong><br/>Poiana Brașov</p>
    `,
  })
}
