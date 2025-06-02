import { createI18n } from "vue-i18n";
import PtBrTranslations from "./pt_br.json";
import { LocaleAppConfigs, type LocaleAppProperty } from "@/models/locale-masks";


export const i18nApplication = createI18n({
  legacy: false,
  locale: 'br',
  messages: {
    br: PtBrTranslations,
  },
})

export const t = i18nApplication.global.t

export const getCurrentLang = (): string => {
  try {
    const locale = i18nApplication.global.locale.value
    return locale === 'br' ? 'pt-br' : locale
  } catch (error) {
    console.error('i18n: ', error)
    return 'pt-br'
  }
}

export const getCurrentLocale = (): string => {
  try {
    return i18nApplication.global.locale.value
  } catch (error) {
    console.error('i18n', error)
    return 'pt-br'
  }
}

export const getLocaleConfig = (): LocaleAppProperty => {
  const currentConfig = LocaleAppConfigs.find((config) =>
    config.locale.includes(getCurrentLocale()),
  )
  return currentConfig ?? LocaleAppConfigs[0]
}
