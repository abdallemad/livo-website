/** Booking-chat copy, verbatim from the prototype (assets/js/chat.js). `{x}` are placeholders. */
import type { Locale } from "@/i18n/config"

export const CHAT_COPY = {
  en: {
    status: "online", hello: "Hello! What are you looking for?", anyHello: "Tell us what you need — any service, even if it isn’t on our list.", anyPh: "e.g. Install a garage door", svcPh: "e.g. My drain is clogged", svcReact: "Got it — {a}!",
    date: "Got it! When would you like the pro to come?", asap: "As soon as possible", confirmDate: "Confirm date", dateReact: "Perfect, noted!",
    time: "What time would be good for you?", confirmTime: "Confirm time", later: "I’ll decide later", laterMe: "I’ll decide later",
    timeReact: "Perfect! We’ve already started looking.\nJust a couple more things...",
    name: "What’s your first and last name?", namePh: "e.g. Jane Doe", nameErr: "Please enter your first and last name",
    addr: "And your address?", addrPh: "e.g. 14 Rue de la Forêt, Luxembourg", confirmAddr: "Confirm address", addrErr: "Please enter your address", addrReact: "Got it!",
    phone: "What’s your phone number?", phonePh: "+352 621 000 000", phoneErr: "Please enter a valid phone number", pref: "How should we contact you?",
    consent: "I agree to the {t} and the {p}", terms: "Terms & Conditions", privacy: "Privacy Policy", consentErr: "Please agree to the terms and privacy policy", send: "Continue", phoneReact: "Thank you!",
    email: "Could you please share your email?\nWe’ll send you a confirmation.", emailPh: "name@example.com", emailErr: "Please enter a valid email address",
    photos: "Any photos of the issue?", upload: "Upload photo", add: "Add another", cont: "Continue", skip: "No, skip", attached: "{n} photo(s) attached", skipMe: "No photos",
    doneT: "That’s it!", doneS: "We’ll match you with a pro and be in touch soon.", note: "Your reference: {r}. To reach us now, call {p}.", sendErr: "Sorry, your booking could not be sent. Please try again, or call us on {p}.",
    wa: "Talk to us on WhatsApp", close: "Close", lblS: "Service", lblD: "When", lblN: "Name", lblA: "Address", lblP: "Phone", custom: "Your request", inspect: "Free inspection",
    prefPhone: "Phone", prefEmail: "Email",
    checkT: "Please check your booking", checkS: "Confirm it and we create your booking.", confirm: "✓ Confirm booking", confirmMe: "Confirmed ✓", sending: "Sending…", cancel: "Not now",
  },
  fr: {
    status: "en ligne", hello: "Bonjour ! Que recherchez-vous ?", anyHello: "Dites-nous ce qu’il vous faut — n’importe quel service, même hors de notre liste.", anyPh: "ex. Installer une porte de garage", svcPh: "ex. Mon évier est bouché", svcReact: "Compris — {a} !",
    date: "Compris ! Quand souhaitez-vous que le pro passe ?", asap: "Dès que possible", confirmDate: "Confirmer la date", dateReact: "Parfait, c’est noté !",
    time: "Quelle heure vous conviendrait ?", confirmTime: "Confirmer l’heure", later: "Je déciderai plus tard", laterMe: "Je déciderai plus tard",
    timeReact: "Parfait ! Nous avons déjà commencé à chercher.\nEncore quelques détails...",
    name: "Quels sont vos prénom et nom ?", namePh: "ex. Jeanne Dupont", nameErr: "Veuillez saisir votre prénom et votre nom",
    addr: "Et votre adresse ?", addrPh: "ex. 14 Rue de la Forêt, Luxembourg", confirmAddr: "Confirmer l’adresse", addrErr: "Veuillez saisir votre adresse", addrReact: "Compris !",
    phone: "Quel est votre numéro de téléphone ?", phonePh: "+352 621 000 000", phoneErr: "Veuillez saisir un numéro valide", pref: "Comment vous contacter ?",
    consent: "J’accepte les {t} et la {p}", terms: "Conditions générales", privacy: "Politique de confidentialité", consentErr: "Veuillez accepter les conditions et la politique de confidentialité", send: "Continuer", phoneReact: "Merci !",
    email: "Pouvez-vous nous donner votre e-mail ?\nNous vous enverrons une confirmation.", emailPh: "nom@exemple.com", emailErr: "Veuillez saisir une adresse e-mail valide",
    photos: "Des photos du problème ?", upload: "Ajouter une photo", add: "En ajouter une", cont: "Continuer", skip: "Non, passer", attached: "{n} photo(s) jointe(s)", skipMe: "Pas de photos",
    doneT: "C’est fait !", doneS: "Nous vous associons à un pro et revenons vers vous très vite.", note: "Votre référence : {r}. Pour nous joindre, appelez le {p}.", sendErr: "Désolé, votre réservation n’a pas pu être envoyée. Réessayez, ou appelez-nous au {p}.",
    wa: "Parlez-nous sur WhatsApp", close: "Fermer", lblS: "Service", lblD: "Quand", lblN: "Nom", lblA: "Adresse", lblP: "Téléphone", custom: "Votre demande", inspect: "Inspection gratuite",
    prefPhone: "Téléphone", prefEmail: "Email",
    checkT: "Vérifiez votre réservation", checkS: "Confirmez-la et nous créons votre réservation.", confirm: "✓ Confirmer la réservation", confirmMe: "Confirmé ✓", sending: "Envoi…", cancel: "Pas maintenant",
  },
  de: {
    status: "online", hello: "Hallo! Was suchen Sie?", anyHello: "Sagen Sie uns, was Sie brauchen — jeden Service, auch wenn er nicht auf unserer Liste steht.", anyPh: "z. B. Garagentor einbauen", svcPh: "z. B. Mein Abfluss ist verstopft", svcReact: "Verstanden — {a}!",
    date: "Verstanden! Wann soll die Fachkraft kommen?", asap: "So bald wie möglich", confirmDate: "Datum bestätigen", dateReact: "Perfekt, notiert!",
    time: "Welche Uhrzeit passt Ihnen?", confirmTime: "Uhrzeit bestätigen", later: "Entscheide ich später", laterMe: "Entscheide ich später",
    timeReact: "Perfekt! Wir suchen bereits.\nNur noch ein paar Angaben...",
    name: "Wie lauten Ihr Vor- und Nachname?", namePh: "z. B. Anna Müller", nameErr: "Bitte geben Sie Vor- und Nachnamen ein",
    addr: "Und Ihre Adresse?", addrPh: "z. B. 14 Rue de la Forêt, Luxemburg", confirmAddr: "Adresse bestätigen", addrErr: "Bitte geben Sie Ihre Adresse ein", addrReact: "Verstanden!",
    phone: "Wie lautet Ihre Telefonnummer?", phonePh: "+352 621 000 000", phoneErr: "Bitte geben Sie eine gültige Nummer ein", pref: "Wie sollen wir Sie kontaktieren?",
    consent: "Ich akzeptiere die {t} und die {p}", terms: "AGB", privacy: "Datenschutzerklärung", consentErr: "Bitte akzeptieren Sie die AGB und die Datenschutzerklärung", send: "Weiter", phoneReact: "Vielen Dank!",
    email: "Wie lautet Ihre E-Mail-Adresse?\nWir senden Ihnen eine Bestätigung.", emailPh: "name@beispiel.com", emailErr: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    photos: "Haben Sie Fotos vom Problem?", upload: "Foto hochladen", add: "Weiteres Foto", cont: "Weiter", skip: "Nein, überspringen", attached: "{n} Foto(s) angehängt", skipMe: "Keine Fotos",
    doneT: "Geschafft!", doneS: "Wir finden die passende Fachkraft und melden uns in Kürze.", note: "Ihre Referenz: {r}. Sie erreichen uns jetzt unter {p}.", sendErr: "Leider konnte Ihre Buchung nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: {p}.",
    wa: "Schreiben Sie uns auf WhatsApp", close: "Schließen", lblS: "Service", lblD: "Wann", lblN: "Name", lblA: "Adresse", lblP: "Telefon", custom: "Ihre Anfrage", inspect: "Kostenlose Besichtigung",
    prefPhone: "Telefon", prefEmail: "E-Mail",
    checkT: "Bitte prüfen Sie Ihre Buchung", checkS: "Bestätigen Sie, und wir legen Ihre Buchung an.", confirm: "✓ Buchung bestätigen", confirmMe: "Bestätigt ✓", sending: "Wird gesendet…", cancel: "Nicht jetzt",
  },
} satisfies Record<Locale, Record<string, string>>

export type ChatCopy = (typeof CHAT_COPY)["en"]

export const fill = (s: string, o: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(o[k]))
