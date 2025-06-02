export type LocaleAppProperty = {
  lang: Array<string>
  locale: Array<string>
  masks: Array<string>
  currency: CurrencyType
}

export type CurrencyType = {
  symbol?: string
  precision: number
  decimal?: string
  separator?: string
}

export const LocaleAppConfigs: Array<LocaleAppProperty> = [
  {
    lang: ['pt-br'],
    locale: ['br'],
    currency: {
      precision: 2,
      symbol: 'R$',
      decimal: ',',
      separator: '.',
    },
    masks: [],
  },
]
