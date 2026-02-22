import sharp from "sharp"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { buildConfig } from "payload"
import { Media } from "collections/Media"
import { Products } from "collections/Products"
import { Users } from "collections/Users"
import { en } from '@payloadcms/translations/languages/en'
import { fa } from '@payloadcms/translations/languages/fa'
export default buildConfig({
    editor: lexicalEditor(),
    collections: [
        Users,
        Products,
        Media,
    ],
    i18n: {
        fallbackLanguage: 'en', // Fallback to English if translation missing
        supportedLanguages: {
            en,  // English
            fa,  // Farsi/Persian
        },
    },
    localization: {
        locales: [
            { code: 'en', label: 'English' },
            { code: 'fa', label: 'فارسی', rtl: true }, // Mark Farsi as RTL
        ],
        defaultLocale: 'en',
        fallback: true,
    },
    secret: process.env.PAYLOAD_SECRET || "",
    db: postgresAdapter({
        pool: {
            connectionString: process.env.PAYLOAD_DATABASE_URL || "",
        },
    }),
    sharp,
})