export interface IPdfDocumentGenerator<TData, TExtra = void> {
  /**
   * Generates a PDF and returns its Blob URL for previewing.
   * @param data The specific data required by the template
   */
  generateBlobUrl(...args: TExtra extends void ? [data: TData] : [data: TData, extra: TExtra]): Promise<string> | string;

  /**
   * Generates and downloads the PDF directly to the user's device.
   * @param data The specific data required by the template
   * @param fileName Optional filename (some templates might generate their own name)
   */
  downloadPdf(...args: TExtra extends void ? [data: TData, fileName?: string] : [data: TData, extra: TExtra, fileName?: string]): Promise<void> | void;
}
