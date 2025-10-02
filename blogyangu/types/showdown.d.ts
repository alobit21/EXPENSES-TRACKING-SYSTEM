declare module "showdown" {
  interface ConverterOptions {
    [key: string]: any
  }

  class Converter {
    constructor(options?: ConverterOptions)
    makeHtml(markdown: string): string
    makeMarkdown(html: string): string
  }

  export { Converter, ConverterOptions }
  export default Converter
}
