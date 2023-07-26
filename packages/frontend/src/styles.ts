import { css } from 'styled-components'
import WebFont from 'webfontloader'

export const background = '#081b24'
export const lighterBackground = '#5D7078'
export const darkerBackground = '#0E2936'
export const textColor = '#FFFFFF'
export const accentColor = '#00ffd1' // Primary 1
export const secondAccent = '#D0fff7' // Primary 2
export const lightBorder = '#5D7078'
export const darkBorder = '#0E2936'
export const gray1 = '#333333'
export const subtleText = '#95a7ae'
export const inverseText = '#000000'

export const titleFont = 'Luckiest Guy'
export const bodyFont = 'Inconsolata'

export const textBase = css`
    font-family: ${bodyFont};
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 140%;
    color: ${textColor};
`

export const textSubtle = css`
    font-family: ${bodyFont};
    font-weight: bold;
    font-size: 24px;
    color: ${subtleText};
`

WebFont.load({
    google: {
        families: [
            'Shrikhand',
            'Avenir Next',
            `${titleFont}:200,300,400,500,700,800`,
            `${bodyFont}:200,300,400,500,700,800`,
        ],
    },
})