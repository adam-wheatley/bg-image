import '@babel/polyfill'
import { fixOpacity } from '../StyleUtils'

global.console.debug = jest.fn()


describe(`fixOpacity()`, () => {
  it(`should return fixedOpacityProps for style prop with text content`, () => {
    const styledPropsWithText = {
      style: {
        opacity: `inherit`,
      }
    }
    const fixedOpacityProps = fixOpacity(styledPropsWithText)
    expect(fixedOpacityProps.style.opacity).toEqual(.99)
  })

  it(`should return fixedOpacityProps for style prop with opacity of 1`, () => {
    const styledPropsOpaqueOpacity = {
      style: {
        opacity: 1,
      }
    }
    const fixedOpacityProps = fixOpacity(styledPropsOpaqueOpacity)
    expect(fixedOpacityProps.style.opacity).toEqual(.99)
  })

  it(`shouldn't change opacityProps for style prop with opacity < .99`, () => {
    const styledPropsSmallOpacity = {
      style: {
        opacity: .5,
      }
    }
    const opacityProps = fixOpacity(styledPropsSmallOpacity)
    expect(opacityProps.style.opacity).toEqual(.5)
  })

  it(`should't change opacityProps for style prop without opacity`, () => {
    const styledPropsNoOpacity = {
      style: {}
    }
    const fixedOpacityProps = fixOpacity(styledPropsNoOpacity)
    expect(fixedOpacityProps.style.opacity).toBeUndefined()
  })
})