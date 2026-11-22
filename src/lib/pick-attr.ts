/** The editor's select-only marker, or nothing: it is drawn only for the editor's canvas (see EditModeProvider). */
export const pickProps = (edit: boolean, value: string): { "data-cms-pick"?: string } => (edit ? { "data-cms-pick": value } : {});
